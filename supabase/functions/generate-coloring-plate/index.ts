
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    console.log("Received request")
    const { settings } = await req.json()
    console.log("Request settings:", settings)

    if (!settings?.prompt) {
      console.error("No prompt provided in settings")
      return new Response(
        JSON.stringify({ error: "No prompt provided in settings" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      console.error("HUGGING_FACE_ACCESS_TOKEN is not set")
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log("Initializing Hugging Face client")
    const hf = new HfInference(hfToken)
    console.log("Starting image generation with prompt:", settings.prompt)
    
    // Increase timeout to 50 seconds
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
    }, 50000)

    try {
      const response = await hf.textToImage({
        inputs: settings.prompt,
        model: "runwayml/stable-diffusion-v1-5",
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 50
        }
      }, {
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!response) {
        console.error("No response received from image generation service")
        return new Response(
          JSON.stringify({ error: "No response from image generation service" }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log("Successfully generated image, converting to base64")
      const buffer = await response.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const imageUrl = `data:image/png;base64,${base64}`

      console.log("Successfully generated coloring plate")
      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } catch (apiError) {
      clearTimeout(timeout)
      console.error("Image generation service error:", apiError)
      return new Response(
        JSON.stringify({ 
          error: "Image generation service error", 
          details: apiError.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error in generate-coloring-plate:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
