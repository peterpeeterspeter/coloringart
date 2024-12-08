import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')

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
    
    // Convert questionnaire answers into a prompt
    const prompt = generateMandalaPrompt(settings)
    console.log("Generated prompt:", prompt)

    // Call Replicate API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: prompt,
          negative_prompt: "ugly, blurry, low quality, distorted, disfigured",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    })

    const prediction = await response.json()
    console.log("Replicate response:", prediction)

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function generateMandalaPrompt(settings: any): string {
  const moodPrompts = {
    Calm: "serene and peaceful mandala with soft flowing patterns",
    Energetic: "vibrant and dynamic mandala with spiraling energy patterns",
    Focused: "precise geometric mandala with clear, structured patterns",
    Relaxed: "gentle, organic mandala with natural flowing elements"
  }

  const complexityPrompts = {
    Simple: "minimal and elegant",
    Moderate: "balanced level of detail",
    Complex: "intricate and detailed",
    "Very Intricate": "highly detailed and elaborate"
  }

  const stylePrompts = {
    Geometric: "sacred geometry",
    Floral: "botanical and floral elements",
    Abstract: "abstract patterns",
    Traditional: "traditional tibetan"
  }

  return `A beautiful ${complexityPrompts[settings.complexity]} mandala in ${stylePrompts[settings.style]} style, ${moodPrompts[settings.mood]}. Spiritual and mystical artwork, centered composition, perfect symmetry, intricate details, meditation art, spiritual symbolism, sacred art.`
}