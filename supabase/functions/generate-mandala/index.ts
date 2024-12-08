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

    // Otherwise, create a new prediction
    const prompt = generateMandalaPrompt(settings)
    console.log("Generated prompt:", prompt)

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
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

    if (!response.ok) {
      const error = await response.text()
      console.error("API Error:", error)
      throw new Error(`API returned ${response.status}: ${error}`)
    }

    const prediction = await response.json()
    console.log("Replicate response:", prediction)

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function generateMandalaPrompt(settings: any): string {
  // Extract emotional elements
  const emotions = Array.isArray(settings.emotions) ? settings.emotions.join(", ") : settings.emotions;
  const intensity = settings.emotionalIntensity;
  const quality = settings.emotionalQuality;
  
  // Physical and mental aspects
  const energy = settings.energyLevel;
  const tension = settings.bodyTension;
  const thoughtPattern = settings.thoughtPattern;
  const detailLevel = settings.detailLevel;
  
  // Spiritual and environmental elements
  const symbols = Array.isArray(settings.spiritualSymbols) ? settings.spiritualSymbols.join(", ") : settings.spiritualSymbols;
  const intention = settings.spiritualIntention;
  const naturalElement = settings.naturalElements;
  const timeOfDay = settings.timeOfDay;

  return `Create a beautiful and intricate mandala design with the following characteristics:
    - Emotional essence: ${emotions} with ${intensity}/10 intensity
    - Emotional quality: ${quality}
    - Energy level: ${energy}
    - Physical tension: ${tension}
    - Mental state: ${thoughtPattern}
    - Detail complexity: ${detailLevel}
    - Spiritual symbols: ${symbols}
    - Spiritual intention: ${intention}
    - Natural elements: ${naturalElement}
    - Time influence: ${timeOfDay}
    
    The mandala should be perfectly symmetrical, centered, and incorporate these elements into a harmonious spiritual artwork using sacred geometry.`.replace(/\n\s+/g, ' ');
}
