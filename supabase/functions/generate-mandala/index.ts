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

    if (!settings) {
      throw new Error("No settings provided")
    }

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Construct mandala prompt
    const mandalaPrompt = `Create a beautiful mandala design with the following characteristics:
      Style: ${settings.style || 'balanced and harmonious'}
      Theme: ${settings.theme || 'spiritual and meditative'}
      Make it a perfect mandala with intricate details and perfect symmetry.`

    console.log("Using prompt:", mandalaPrompt)

    // Generate the image using the correct parameter structure
    const response = await hf.textToImage({
      inputs: mandalaPrompt,
      model: "rexoscare/mandala-art-lora",
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    })

    // Convert blob to base64
    const arrayBuffer = await response.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/png;base64,${base64}`

    console.log("Successfully generated mandala")

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
    console.error('Error in generate-mandala function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate mandala',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})