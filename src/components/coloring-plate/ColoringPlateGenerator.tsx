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
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;
  const GENERATION_TIMEOUT = 30000; // 30 seconds

  const generateColoringPlate = async (): Promise<string | null> => {
    if (isGenerating) {
      console.log("Generation already in progress, skipping...");
      toast.error("Generation already in progress, please wait...");
      return null;
    }

    if (generationAttempts >= MAX_ATTEMPTS) {
      console.log("Maximum generation attempts reached");
      toast.error("Maximum generation attempts reached. Please try again later.");
      return null;
    }

    try {
      setIsGenerating(true);
      setGenerationAttempts(prev => prev + 1);
      
      const enhancedPrompt = generateEnhancedPrompt(prompt, answers);
      console.log("Using enhanced prompt:", enhancedPrompt);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Generation timed out")), GENERATION_TIMEOUT);
      });

      // Create the generation promise
      const generationPromise = supabase.functions.invoke('generate-coloring-plate', {
        body: { 
          settings: { prompt: enhancedPrompt }
        }
      });

      // Race between timeout and generation
      const { data, error } = await Promise.race([
        generationPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error("Error generating coloring plate:", error);
        throw error;
      }

      if (!data || !data.output || !data.output[0]) {
        throw new Error("No image was generated");
      }

      const imageUrl = data.output[0];
      console.log("Generation successful, received image URL:", imageUrl);
      setGeneratedImage(imageUrl);
      setGenerationAttempts(0); // Reset attempts on success
      return imageUrl;

    } catch (error) {
      console.error("Error in coloring plate generation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate coloring plate. Please try again.";
      toast.error(errorMessage);
      
      if (error instanceof Error && error.message.includes("timed out")) {
        toast.error("Generation timed out. Please try again.");
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatedImage,
    isGenerating,
    generateColoringPlate,
    generationAttempts,
  };
};