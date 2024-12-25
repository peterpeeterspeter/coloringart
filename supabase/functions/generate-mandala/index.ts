import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { settings, jobId } = await req.json();
    console.log("Request received:", { settings, jobId });

    // Input validation
    if (!settings || typeof settings !== 'object') {
      throw new Error("Invalid settings provided");
    }

    // Generate prompt from settings
    const promptElements = Object.entries(settings)
      .filter(([_, value]) => value && value !== '')
      .map(([_, value]) => Array.isArray(value) ? value.join(', ') : value);

    const prompt = `Create a black and white line art mandala design with the following elements: ${promptElements.join(', ')}. Make it symmetrical and balanced, with clear, well-defined lines suitable for coloring.`;

    console.log("Generated prompt:", prompt);

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error("HUGGING_FACE_ACCESS_TOKEN not configured");
    }

    const hf = new HfInference(hfToken);
    console.log("Starting image generation...");
    
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'rexoscare/mandala-art-lora',
      parameters: {
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    });

    if (!image) {
      throw new Error("No image generated");
    }

    console.log("Image generation successful");

    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    // Only update job if jobId is provided
    if (jobId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

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
    console.error('Edge function error:', error);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
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