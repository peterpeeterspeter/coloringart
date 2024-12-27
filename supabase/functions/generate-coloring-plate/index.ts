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
    const { settings, predictionId } = await req.json()
    console.log("Received request:", { settings, predictionId })

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    if (!settings?.prompt) {
      throw new Error("No prompt provided");
    }

    // Generate the image
    console.log("Generating image with prompt:", settings.prompt);
    const image = await hf.textToImage({
      inputs: settings.prompt,
      model: "prithivMLmods/Coloring-Book-Flux-LoRA",
      parameters: {
        negative_prompt: "blurry, bad, text, watermark, signature, color, photorealistic, shadows, gradient",
      }
    });

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/png;base64,${base64}`

    return new Response(
      JSON.stringify({ 
        status: 'succeeded',
        output: [imageUrl]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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