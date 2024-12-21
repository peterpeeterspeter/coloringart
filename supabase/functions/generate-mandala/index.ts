import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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
    const { settings } = await req.json();
    console.log("Received request with settings:", settings);

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

    const prompt = generateEnhancedPrompt(settings);
    console.log("Generated prompt:", prompt);

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));

    try {
      const image = await hf.textToImage({
        inputs: prompt,
        model: 'rexoscare/mandala-art-lora',
        parameters: {
          negative_prompt: "shadows, gradient, color, ugly, blurry, low quality, distorted, disfigured",
        }
      });

      // Convert the blob to a base64 string
      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const imageUrl = `data:image/png;base64,${base64}`;

      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error("Hugging Face API error:", hfError);
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
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
  const basePrompt = "Create a black and white line art mandala with the following characteristics:";
  
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
    Black and white line art only, no shadows or gradients.`;

  return prompt;
}