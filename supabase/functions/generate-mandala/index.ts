import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      }
    })
  }

  try {
    console.log("Starting mandala generation request")
    
    // Parse request body
    const { settings } = await req.json()
    console.log("Received settings:", settings)

    if (!settings) {
      throw new Error("No settings provided")
    }

    // Initialize Hugging Face client
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      throw new Error("Missing Hugging Face API token")
    }
    
    console.log("Initializing Hugging Face client")
    const hf = new HfInference(hfToken)

    // Create a specialized mandala prompt
    const basePrompt = "black and white mandala coloring page, clean lines, high contrast, white background"
    const stylePrompt = settings.style ? `, ${settings.style}` : ""
    const themePrompt = settings.theme ? `, ${settings.theme}` : ""
    const mandalaPrompt = `${basePrompt}${stylePrompt}${themePrompt}, line art, coloring book style`
    
    console.log("Using prompt:", mandalaPrompt)

    // Create an AbortController with timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
      console.log("Generation timed out")
    }, 15000) // 15 second timeout for better quality

    try {
      console.log("Starting image generation")
      const response = await hf.textToImage({
        inputs: mandalaPrompt,
        model: "gokaygokay/Flux-Mandala-LoRA",
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 20,
          width: 768,
          height: 768,
          negative_prompt: "color, colored, realistic, photographic, 3d, shading"
        }
      }, { signal: controller.signal })

      clearTimeout(timeout)
      console.log("Image generation completed")

      if (!response) {
        throw new Error("No response from Hugging Face API")
      }

      // Convert blob to base64 in chunks to prevent stack overflow
      const buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('')
      const base64 = btoa(binary)
      const imageUrl = `data:image/png;base64,${base64}`

      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { 
          headers: { 
            ...corsHeaders,
            'Cache-Control': 'no-cache',
          }
        }
      )

    } catch (apiError) {
      clearTimeout(timeout)
      console.error("API error:", apiError)
      throw apiError.name === 'AbortError' 
        ? new Error('Generation timed out. Please try again.')
        : new Error(`API error: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate mandala',
        details: error.message 
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
})