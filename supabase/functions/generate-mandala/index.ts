import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { settings, jobId } = await req.json();
    console.log("Received request with settings:", settings, "jobId:", jobId);

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    try {
      const prompt = generateEnhancedPrompt(settings);
      console.log("Generated prompt:", prompt);

      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
      
      if (!Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')) {
        throw new Error("Missing HUGGING_FACE_ACCESS_TOKEN");
      }

      const image = await hf.textToImage({
        inputs: prompt,
        model: 'rexoscare/mandala-art-lora',
        parameters: {
          negative_prompt: "shadows, gradient, color, ugly, blurry, low quality, distorted, disfigured",
        }
      });

      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const imageUrl = `data:image/png;base64,${base64}`;

      // Update job status
      if (jobId) {
        const { error: updateError } = await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'completed',
            image_url: imageUrl,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (updateError) {
          console.error("Error updating job:", updateError);
        }
      }

      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error("Error generating image:", hfError);

      // Update job status on error
      if (jobId) {
        const { error: updateError } = await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'failed',
            error: hfError.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (updateError) {
          console.error("Error updating job:", updateError);
        }
      }

      throw hfError;
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateEnhancedPrompt(settings: Record<string, unknown>) {
  const basePrompt = "Create a black and white line art mandala with the following characteristics:";
  
  // Extract questionnaire answers with fallbacks
  const emotions = Array.isArray(settings.emotions) ? settings.emotions.join(", ") : "balanced";
  const intensity = settings.emotionalIntensity || "5";
  const quality = settings.emotionalQuality || "harmonious";
  const energy = settings.energyLevel || "Medium (balanced, regular patterns)";
  const tension = settings.bodyTension || "Center (influences core design)";
  const thought = settings.thoughtPattern || "Creative (organic, flowing patterns)";
  const detail = settings.detailLevel || "Moderately detailed";
  const symbols = Array.isArray(settings.spiritualSymbols) ? settings.spiritualSymbols.join(", ") : "geometric";
  const intention = settings.spiritualIntention || "Inner peace";
  const elements = settings.naturalElements || "Earth (solid, grounding patterns)";
  const timeOfDay = settings.timeOfDay || "Noon (bold, clear patterns)";

  // Build a detailed prompt incorporating all questionnaire answers
  const prompt = `${basePrompt}
    A ${detail.toLowerCase()} mandala design expressing ${emotions} emotions at intensity level ${intensity},
    embodying ${quality} qualities.
    The design should reflect ${energy.toLowerCase()} energy patterns,
    with emphasis on ${tension.toLowerCase()}.
    Incorporate a ${thought.toLowerCase()} style,
    featuring ${symbols.toLowerCase()} symbols.
    The intention is ${intention.toLowerCase()},
    drawing inspiration from ${elements.toLowerCase()}
    and the essence of ${timeOfDay.toLowerCase()}.
    Create this as a pure black and white line art suitable for coloring,
    with clear, well-defined lines and intricate patterns.
    Make it symmetrical and balanced, with no color, shadows, or gradients.`;

  console.log("Final prompt:", prompt);
  return prompt;
}