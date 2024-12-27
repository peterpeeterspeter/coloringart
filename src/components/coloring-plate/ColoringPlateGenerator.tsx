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
  const maxRetries = 2;

  const generateColoringPlate = async (retryCount = 0): Promise<string | null> => {
    if (isGenerating) {
      console.log("Generation already in progress, skipping...");
      return null;
    }

    try {
      setIsGenerating(true);
      const enhancedPrompt = generateEnhancedPrompt(prompt, answers);
      console.log("Using enhanced prompt:", enhancedPrompt);
      
      const { data, error } = await supabase.functions.invoke('generate-coloring-plate', {
        body: { 
          settings: { prompt: enhancedPrompt }
        }
      });

      if (error) {
        console.error("Error generating coloring plate:", error);
        
        // Check if it's a worker limit error and we haven't exceeded max retries
        if (error.message?.includes('WORKER_LIMIT') && retryCount < maxRetries) {
          console.log(`Retrying generation (attempt ${retryCount + 1} of ${maxRetries})...`);
          // Wait for 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          return generateColoringPlate(retryCount + 1);
        }
        
        throw error;
      }

      if (!data || !data.output || !data.output[0]) {
        throw new Error("No image was generated");
      }

      const imageUrl = data.output[0];
      console.log("Generation successful, received image URL:", imageUrl);
      setGeneratedImage(imageUrl);
      return imageUrl;

    } catch (error) {
      console.error("Error in coloring plate generation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate coloring plate. Please try again.");
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