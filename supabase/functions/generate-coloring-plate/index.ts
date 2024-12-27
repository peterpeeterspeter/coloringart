import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { settings } = await req.json()
    console.log("Received request with settings:", settings)

    if (!settings || !settings.prompt) {
      throw new Error("No prompt provided in settings")
    }

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    console.log("Generating coloring plate with prompt:", settings.prompt)

    // Generate the image using the correct parameter structure
    const response = await hf.textToImage({
      inputs: settings.prompt,
      model: "prithivMLmods/Coloring-Book-Flux-LoRA",
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    })

    if (!response) {
      throw new Error("No response from Hugging Face API")
    }

    // Convert blob to base64 more efficiently
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    const base64 = btoa(binary)
    const imageUrl = `data:image/png;base64,${base64}`

    console.log("Successfully generated coloring plate")

    return new Response(
      JSON.stringify({ output: [imageUrl] }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-coloring-plate function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate coloring plate',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})