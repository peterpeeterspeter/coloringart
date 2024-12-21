import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { settings, predictionId } = await req.json();
    console.log("Received request:", { settings, predictionId });
    
    // Handle status check requests
    if (predictionId) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
          "Content-Type": "application/json",
        },
      });

      const prediction = await response.json();
      console.log("Prediction status:", prediction.status);

      return new Response(
        JSON.stringify(prediction),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return new Response(
        JSON.stringify({ error: "Settings object is required and must be a valid object" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const prompt = generateEnhancedPrompt(settings);
    console.log("Generated prompt:", prompt);

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "1f0f10e3adc3dd30d8c1e962b5a4442e92644025aa620f40efa4c0b95b58e90a",
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
    });

    const prediction = await response.json();
    console.log("Initial prediction response:", prediction);

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateEnhancedPrompt(settings: any) {
  const basePrompt = "Create a line art mandala in black and white with the following characteristics:";
  
  // Safely handle array values and provide defaults
  const emotions = Array.isArray(settings.emotions) ? settings.emotions.join(", ") : settings.emotions || "balanced";
  const symbols = Array.isArray(settings.spiritualSymbols) ? settings.spiritualSymbols.join(", ") : settings.spiritualSymbols || "geometric";
  
  const prompt = `${basePrompt}
    Emotions: ${emotions}
    Intensity: ${settings.emotionalIntensity || "balanced"}
    Quality: ${settings.emotionalQuality || "harmonious"}
    Energy: ${settings.energyLevel || "balanced"}
    Tension: ${settings.bodyTension || "relaxed"}
    Thought Pattern: ${settings.thoughtPattern || "flowing"}
    Detail Level: ${settings.detailLevel || "moderate"}
    Spiritual Symbols: ${symbols}
    Intention: ${settings.spiritualIntention || "peace"}
    Natural Elements: ${settings.naturalElements || "balanced"}
    Time of Day: ${settings.timeOfDay || "daylight"}
    Make it suitable for coloring with clear, well-defined lines.
    Negative prompt: shadows, gradient`;

  return prompt;
}