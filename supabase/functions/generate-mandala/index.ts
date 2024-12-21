import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders 
      });
    }

    console.log("Received request");
    const { settings, jobId } = await req.json();
    console.log("Request details:", { settings, jobId });

    // Input validation
    if (!settings || typeof settings !== 'object') {
      throw new Error("Invalid settings provided");
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate prompt from settings
    const prompt = `Create a black and white line art mandala design with the following elements: ${
      Object.entries(settings)
        .filter(([_, value]) => value && value !== '')
        .map(([_, value]) => Array.isArray(value) ? value.join(', ') : value)
        .join(', ')
    }. Make it symmetrical and balanced, with clear, well-defined lines suitable for coloring.`;

    console.log("Generated prompt:", prompt);

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      console.error("Missing HUGGING_FACE_ACCESS_TOKEN");
      throw new Error("Configuration error: Missing API token");
    }

    console.log("Initializing Hugging Face client...");
    const hf = new HfInference(hfToken);
    
    console.log("Starting image generation with prompt...");
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'rexoscare/mandala-art-lora',
      parameters: {
        negative_prompt: "blurry, bad quality, text, watermark",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    });

    console.log("Image generation completed");

    if (!image) {
      console.error("No image generated");
      throw new Error("Failed to generate image");
    }

    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    // Update job status if jobId is provided
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
      JSON.stringify({ 
        success: true,
        output: [imageUrl] 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in edge function:', error);
    
    // Update job status to failed if jobId exists
    try {
      const { jobId } = await req.json();
      if (jobId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'failed',
            error: error.message || 'Unknown error occurred',
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);
      }
    } catch (updateError) {
      console.error('Error updating job status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error occurred',
        details: error.stack || 'Error occurred while processing the request'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );
  }
});