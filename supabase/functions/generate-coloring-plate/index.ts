
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': '*',
  'Content-Type': 'application/json'
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
          headers: corsHeaders
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
          headers: corsHeaders
        }
      )
    }

    console.log("Initializing Hugging Face client")
    const hf = new HfInference(hfToken)
    console.log("Starting image generation with prompt:", settings.prompt)
    
    // Create an AbortController with 40 second timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 40000)

    try {
      // Add the trigger words and style instructions to the prompt
      const enhancedPrompt = `coloring book page, c0l0ringb00k, ${settings.prompt}, white background, black line art, high contrast, clean lines`

      const response = await hf.textToImage({
        inputs: enhancedPrompt,
        model: "renderartist/coloringbookflux",
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 7.5
        }
      }, {
        signal: controller.signal,
        retries: 3,
        timeout: 35000
      })

      clearTimeout(timeout)

      if (!response) {
        throw new Error("No response from image generation service")
      }

      console.log("Successfully generated image, converting to base64")
      const buffer = await response.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const imageUrl = `data:image/png;base64,${base64}`

      console.log("Successfully generated coloring plate")
      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { headers: corsHeaders }
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
          headers: corsHeaders
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
        headers: corsHeaders
      }
    )
  }
})
