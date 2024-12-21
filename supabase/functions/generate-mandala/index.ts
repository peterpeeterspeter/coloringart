import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { settings, jobId } = await req.json();
    console.log("Received request with settings:", settings, "jobId:", jobId);

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

      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
      
      if (!Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')) {
        throw new Error("Missing HUGGING_FACE_ACCESS_TOKEN");
      }

      const image = await hf.textToImage({
        inputs: prompt,
        model: 'rexoscare/mandala-art-lora'
      });

      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const imageUrl = `data:image/png;base64,${base64}`;

      // Update job status
      if (jobId) {
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error("Error generating image:", hfError);

      // Update job status on error
      if (jobId) {
        const { error: updateError } = await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'failed',
            error: hfError.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (updateError) {
          console.error("Error updating job:", updateError);
        }
      }

      throw hfError;
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});