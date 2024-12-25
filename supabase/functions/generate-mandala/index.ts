import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { settings, jobId } = await req.json()
    console.log("Starting mandala generation with settings:", settings)

    // Initialize Hugging Face client first to fail fast if token is invalid
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    if (!hf) {
      throw new Error("Failed to initialize Hugging Face client")
    }

    // Generate prompt from settings
    const promptElements = []
    for (const [key, value] of Object.entries(settings)) {
      if (Array.isArray(value) && value.length > 0) {
        promptElements.push(value.join(', '))
      } else if (typeof value === 'string' && value.trim() !== '') {
        promptElements.push(value)
      }
    }

    const prompt = `Create a black and white line art mandala design with the following elements: ${promptElements.join(', ')}. Make it symmetrical and balanced, with clear, well-defined lines suitable for coloring.`
    console.log("Using prompt:", prompt)

    // Generate the image
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'rexoscare/mandala-art-lora',
      parameters: {
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    })

    if (!image) {
      throw new Error("No image was generated")
    }

    // Convert image to base64
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/png;base64,${base64}`

    // Update job status if jobId is provided
    if (jobId) {
      let supabase
      try {
        supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: updateError } = await supabase
          .from('mandala_jobs')
          .update({
            status: 'completed',
            image_url: imageUrl,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId)

        if (updateError) {
          console.error("Error updating job:", updateError)
          // Don't throw, continue to return the image
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Don't throw, continue to return the image
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
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    // Ensure we're not passing the full error object which might cause circular references
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})