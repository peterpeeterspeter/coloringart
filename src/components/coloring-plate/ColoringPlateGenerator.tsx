import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ColoringPlateGeneratorProps {
  prompt: string;
  answers: Record<string, string | string[]>;
}

export const generateEnhancedPrompt = (basePrompt: string, answers: Record<string, string | string[]>) => {
  const enhancementParts = [];
  
  if (answers.complexity) {
    enhancementParts.push(`with ${answers.complexity} complexity`);
  }
  if (answers.lineStyle) {
    enhancementParts.push(`using ${answers.lineStyle} lines`);
  }
  if (answers.background) {
    enhancementParts.push(`with ${answers.background}`);
  }
  if (answers.atmosphere) {
    enhancementParts.push(`in a ${answers.atmosphere} atmosphere`);
  }

  const enhancement = enhancementParts.length > 0 
    ? `. Style: ${enhancementParts.join(', ')}`
    : '';

  const lineArtInstructions = `
    Create a simple line art illustration with black lines on a white background, featuring: ${basePrompt}.
    The design should have:
    - No shadows
    - No gradients
    - No filled-in parts
    The artwork should be composed of clean, bold lines, making it perfect for a coloring book.
    Keep the design simple yet engaging, ensuring it's suitable for users to add their own colors and creativity.
  `.trim();

  return `${lineArtInstructions}${enhancement}. Make it suitable for coloring with clear, well-defined lines. Negative prompt: shadows, gradient, color, photorealistic, watermark, text, signature`;
};

export const useColoringPlateGenerator = ({ prompt, answers }: ColoringPlateGeneratorProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateColoringPlate = async () => {
    try {
      setIsGenerating(true);
      const enhancedPrompt = generateEnhancedPrompt(prompt, answers);
      console.log("Using enhanced prompt:", enhancedPrompt);
      
      const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-coloring-plate', {
        body: { settings: { prompt: enhancedPrompt } }
      });

      if (initialError) throw initialError;
      console.log("Initial response:", initialData);

      const checkResult = async (predictionId: string): Promise<string> => {
        const { data: statusData, error: statusError } = await supabase.functions.invoke('generate-coloring-plate', {
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
      console.error("Error generating coloring plate:", error);
      toast.error("Failed to generate coloring plate. Please try again.");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatedImage,
    isGenerating,
    generateColoringPlate,
  };
};