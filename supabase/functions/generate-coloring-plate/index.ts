import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    
    // If predictionId is provided, check the status
    if (predictionId) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("Status check response:", result)

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create a new prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a99db278e33a96e8fab6c90473078e88b21d35181d860ea49fe0980353e9b850",
        input: {
          prompt: settings.prompt,
          negative_prompt: "blurry, bad, text, watermark, signature, color",
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Replicate API Error:", error)
      throw new Error(`API returned ${response.status}: ${error}`)
    }

    const prediction = await response.json()
    console.log("Replicate response:", prediction)

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error in generate-coloring-plate function:", error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})