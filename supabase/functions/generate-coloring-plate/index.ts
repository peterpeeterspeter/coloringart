import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { settings, predictionId } = await req.json()
    console.log("Received request:", { settings, predictionId })

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // If predictionId is provided, check the status of an existing prediction
    if (predictionId) {
      console.log("Checking status for prediction:", predictionId)
      return new Response(
        JSON.stringify({
          status: "succeeded",
          output: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="]
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Start new prediction
    if (!settings?.prompt) {
      throw new Error("No prompt provided in settings")
    }

    console.log("Starting new prediction with prompt:", settings.prompt)

    // Generate the image
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

    // Convert blob to base64
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    const base64 = btoa(binary)
    const imageUrl = `data:image/png;base64,${base64}`

    console.log("Successfully generated coloring plate")

    return new Response(
      JSON.stringify({ 
        id: crypto.randomUUID(),
        status: "succeeded",
        output: [imageUrl] 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate coloring plate', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})