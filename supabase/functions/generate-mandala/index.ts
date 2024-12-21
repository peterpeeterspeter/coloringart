import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { settings, predictionId } = await req.json()
    console.log("Received request with settings:", settings);
    
    if (predictionId) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
          "Content-Type": "application/json",
        },
      })

      const prediction = await response.json()
      console.log("Prediction status:", prediction.status)

      return new Response(
        JSON.stringify(prediction),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = generateMandalaPrompt(settings)
    console.log("Generated prompt:", prompt)

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "1f0f10e3adc3dd30d8c1e962b5a4442e92644025aa620f40efa4c0b95b58e90a", // codingdudecom/sdxl-mandala model
        input: {
          prompt: prompt,
          negative_prompt: "ugly, blurry, low quality, distorted, disfigured, shadows, gradient",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "DPMSolverMultistep",
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      }),
    })

    const prediction = await response.json()
    console.log("Prediction created:", prediction)

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateMandalaPrompt(settings: any) {
  if (!settings) {
    throw new Error("Settings object is required");
  }

  const emotions = Array.isArray(settings.emotions) ? settings.emotions.join(", ") : (settings.emotions || "balanced");
  const intensity = settings.emotionalIntensity || "5";
  const quality = settings.emotionalQuality || "Balance";
  const energy = settings.energyLevel || "Medium (balanced, regular patterns)";
  const tension = settings.bodyTension || "Center (influences core design)";
  const thoughtPattern = settings.thoughtPattern || "Creative (organic, flowing patterns)";
  const detailLevel = settings.detailLevel || "Moderately detailed (balanced complexity)";
  const symbols = Array.isArray(settings.spiritualSymbols) ? settings.spiritualSymbols.join(", ") : (settings.spiritualSymbols || "Geometric shapes");
  const intention = settings.spiritualIntention || "Inner peace";
  const naturalElement = settings.naturalElements || "Earth (solid, grounding patterns)";
  const timeOfDay = settings.timeOfDay || "Noon (bold, clear patterns)";

  return `Create a beautiful and intricate mandala line art design in black and white with the following characteristics:
    - Emotional essence: ${emotions} with ${intensity}/10 intensity
    - Emotional quality: ${quality}
    - Energy level: ${energy}
    - Body tension: ${tension}
    - Thought patterns: ${thoughtPattern}
    - Detail level: ${detailLevel}
    - Spiritual symbols: ${symbols}
    - Intention: ${intention}
    - Natural elements: ${naturalElement}
    - Time influence: ${timeOfDay}
    
    The mandala should be perfectly symmetrical, centered, and incorporate these elements into a harmonious spiritual artwork using sacred geometry. Style: line art, black and white`.replace(/\n\s+/g, ' ');
}