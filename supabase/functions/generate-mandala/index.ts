import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log("Received request");
    const { settings, jobId } = await req.json();
    console.log("Request details:", { settings, jobId });

    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      throw new Error("Invalid settings provided");
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    try {
      // Simplified prompt generation
      const prompt = `Create a black and white line art mandala design with the following characteristics: ${
        Object.entries(settings)
          .filter(([_, value]) => value) // Filter out empty values
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('. ')
      }. Make it symmetrical and balanced, with clear, well-defined lines suitable for coloring.`;

      console.log("Generated prompt:", prompt);

      const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
      if (!hfToken) {
        throw new Error("Missing HUGGING_FACE_ACCESS_TOKEN");
      }

      const hf = new HfInference(hfToken);
      console.log("Initializing image generation...");
      
      const image = await hf.textToImage({
        inputs: prompt,
        model: 'rexoscare/mandala-art-lora'
      });

      console.log("Image generated successfully");

      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const imageUrl = `data:image/png;base64,${base64}`;

      // Update job status
      if (jobId) {
        console.log("Updating job status:", jobId);
        const { error: updateError } = await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'completed',
            image_url: imageUrl,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (updateError) {
          console.error("Error updating job:", updateError);
        }
      }

      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (hfError) {
      console.error("Error in image generation:", hfError);

      // Update job status on error
      if (jobId) {
        console.log("Updating job status to failed:", jobId);
        const { error: updateError } = await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'failed',
            error: hfError.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (updateError) {
          console.error("Error updating job status:", updateError);
        }
      }

      throw hfError;
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error occurred while processing the request'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});