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

  return `A beautiful and personalized mandala with the following characteristics:
    - Emotional essence: ${emotions} with ${intensity}/10 intensity
    - Emotional quality: ${quality}
    - Energy level: ${energy}
    - Body focus: ${tension}
    - Mental state: ${thoughtPattern}
    - Detail level: ${detailLevel}
    - Spiritual symbols: ${symbols}
    - Intention: ${intention}
    - Natural element: ${naturalElement}
    - Time influence: ${timeOfDay}
    
    Create a centered, symmetrical mandala with perfect balance, incorporating these elements into a harmonious spiritual artwork. Use sacred geometry and mystical symbolism to enhance the spiritual significance.`.replace(/\n\s+/g, ' ');
}