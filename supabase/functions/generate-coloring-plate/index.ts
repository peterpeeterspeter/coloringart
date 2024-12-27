import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Always handle CORS preflight requests first
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    const { settings } = await req.json()
    console.log("Received request with settings:", settings)

    if (!settings?.prompt) {
      throw new Error("No prompt provided in settings")
    }

    // Check if HUGGING_FACE_ACCESS_TOKEN is set
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      console.error("HUGGING_FACE_ACCESS_TOKEN is not set")
      throw new Error("Missing Hugging Face API token")
    }

    // Initialize Hugging Face client
    const hf = new HfInference(hfToken)
    console.log("Initialized Hugging Face client")
    
    try {
      console.log("Starting image generation with prompt:", settings.prompt)
      
      // Generate the image
      const response = await hf.textToImage({
        inputs: settings.prompt,
        model: "prithivMLmods/Coloring-Book-Flux-LoRA",
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 30,
        }
      })

      if (!response) {
        throw new Error("No response from Hugging Face API")
      }

      // Convert blob to base64
      const buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      const base64 = btoa(binary)
      const imageUrl = `data:image/png;base64,${base64}`

      console.log("Successfully generated coloring plate")

      return new Response(
        JSON.stringify({ 
          status: "succeeded",
          output: [imageUrl] 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
          } 
        }
      )
    } catch (apiError) {
      console.error("Hugging Face API error:", apiError)
      throw new Error(`Hugging Face API error: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Error in generate-coloring-plate:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate coloring plate', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
        }, 
        status: 500 
      }
    )
  }
})