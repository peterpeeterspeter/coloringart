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
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      console.error("Invalid settings:", settings);
      return new Response(
        JSON.stringify({ error: "Settings must be a valid object" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate the prompt based on settings
    const prompt = generateEnhancedPrompt(settings);
    console.log("Generated prompt:", prompt);

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
        input: {
          prompt,
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

    if (prediction.error) {
      console.error("Prediction error:", prediction.error);
      return new Response(
        JSON.stringify({ error: prediction.error }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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

function generateEnhancedPrompt(settings: Record<string, unknown>) {
  const basePrompt = "Create a line art mandala in black and white with the following characteristics:";
  
  // Default settings if any are missing
  const defaultSettings = {
    emotions: "balanced",
    spiritualSymbols: "geometric",
    emotionalIntensity: "5",
    emotionalQuality: "harmonious",
    energyLevel: "Medium (balanced, regular patterns)",
    bodyTension: "Center (influences core design)",
    thoughtPattern: "Creative (organic, flowing patterns)",
    detailLevel: "Moderately detailed (balanced complexity)",
    spiritualIntention: "Inner peace",
    naturalElements: "Earth (solid, grounding patterns)",
    timeOfDay: "Noon (bold, clear patterns)",
    style: "balanced and harmonious",
    theme: "spiritual and meditative"
  };

  // Merge provided settings with defaults
  const finalSettings = { ...defaultSettings, ...settings };
  
  // Safely handle array values
  const emotions = Array.isArray(finalSettings.emotions) ? finalSettings.emotions.join(", ") : finalSettings.emotions;
  const symbols = Array.isArray(finalSettings.spiritualSymbols) ? finalSettings.spiritualSymbols.join(", ") : finalSettings.spiritualSymbols;
  
  const prompt = `${basePrompt}
    Emotions: ${emotions}
    Intensity: ${finalSettings.emotionalIntensity}
    Quality: ${finalSettings.emotionalQuality}
    Energy: ${finalSettings.energyLevel}
    Tension: ${finalSettings.bodyTension}
    Thought Pattern: ${finalSettings.thoughtPattern}
    Detail Level: ${finalSettings.detailLevel}
    Spiritual Symbols: ${symbols}
    Intention: ${finalSettings.spiritualIntention}
    Natural Elements: ${finalSettings.naturalElements}
    Time of Day: ${finalSettings.timeOfDay}
    Style: ${finalSettings.style}
    Theme: ${finalSettings.theme}
    Make it suitable for coloring with clear, well-defined lines.
    Negative prompt: shadows, gradient`;

  return prompt;
}