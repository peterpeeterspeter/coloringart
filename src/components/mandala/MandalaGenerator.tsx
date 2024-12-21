import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MandalaAnswers } from "@/types/mandala";

interface MandalaGeneratorProps {
  answers: MandalaAnswers;
}

export const generateEnhancedPrompt = (answers: MandalaAnswers) => {
  const basePrompt = "Create a line art mandala in black and white with the following characteristics:";
  const emotions = Array.isArray(answers.emotions) ? answers.emotions.join(", ") : "";
  const symbols = Array.isArray(answers.spiritualSymbols) ? answers.spiritualSymbols.join(", ") : "";
  
  const prompt = `${basePrompt}
    Emotions: ${emotions}
    Intensity: ${answers.emotionalIntensity || "balanced"}
    Quality: ${answers.emotionalQuality || "harmonious"}
    Energy: ${answers.energyLevel || "balanced"}
    Tension: ${answers.bodyTension || "relaxed"}
    Thought Pattern: ${answers.thoughtPattern || "flowing"}
    Detail Level: ${answers.detailLevel || "moderate"}
    Spiritual Symbols: ${symbols}
    Intention: ${answers.spiritualIntention || "peace"}
    Natural Elements: ${answers.naturalElements || "balanced"}
    Time of Day: ${answers.timeOfDay || "daylight"}
    Make it suitable for coloring with clear, well-defined lines.
    Negative prompt: shadows, gradient`;

  return prompt;
};

export const useMandalaGenerator = ({ answers }: MandalaGeneratorProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMandala = async () => {
    try {
      setIsGenerating(true);
      const enhancedPrompt = generateEnhancedPrompt(answers);
      
      const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-mandala', {
        body: { settings: { prompt: enhancedPrompt } }
      });

      if (initialError) throw initialError;
      console.log("Initial response:", initialData);

      const checkResult = async (predictionId: string): Promise<string> => {
        const { data: statusData, error: statusError } = await supabase.functions.invoke('generate-mandala', {
          body: { predictionId }
        });

        if (statusError) throw statusError;
        console.log("Status check response:", statusData);
        
        if (statusData.status === "succeeded") {
          return statusData.output[0];
        } else if (statusData.status === "failed") {
          throw new Error("Image generation failed");
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkResult(predictionId);
      };

      const imageUrl = await checkResult(initialData.id);
      setGeneratedImage(imageUrl);
      return imageUrl;

    } catch (error) {
      console.error("Error generating mandala:", error);
      toast.error("Failed to generate mandala. Please try again.");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatedImage,
    isGenerating,
    generateMandala,
  };
};