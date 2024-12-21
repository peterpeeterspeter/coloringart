import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MandalaAnswers } from "@/types/mandala";

interface MandalaGeneratorProps {
  answers: MandalaAnswers;
}

export const useMandalaGenerator = ({ answers }: MandalaGeneratorProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMandala = async () => {
    try {
      setIsGenerating(true);
      
      // Create settings object with only valid values
      const settings: Record<string, string | string[]> = {};
      
      Object.entries(answers).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          settings[key] = value;
        } else if (typeof value === 'string' && value.trim() !== '') {
          settings[key] = value;
        }
      });

      // Add a default value if settings is empty
      if (Object.keys(settings).length === 0) {
        settings.style = "balanced and harmonious";
      }
      
      console.log("Generating mandala with settings:", settings);

      const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-mandala', {
        body: { settings }
      });

      if (initialError) {
        console.error("Initial error:", initialError);
        throw initialError;
      }

      console.log("Initial response:", initialData);

      if (initialData.error) {
        throw new Error(initialData.error);
      }

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
      toast.error(error instanceof Error ? error.message : "Failed to generate mandala. Please try again.");
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