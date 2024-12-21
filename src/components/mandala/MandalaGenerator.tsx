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

      // Ensure we have at least one valid setting
      if (Object.keys(settings).length === 0) {
        settings.style = "balanced and harmonious";
        settings.theme = "spiritual and meditative";
      }
      
      console.log("Generating mandala with settings:", settings);

      const { data, error } = await supabase.functions.invoke('generate-mandala', {
        body: { settings }
      });

      if (error) {
        console.error("Error generating mandala:", error);
        throw error;
      }

      if (!data || !data.output || !data.output[0]) {
        throw new Error("No image was generated");
      }

      const imageUrl = data.output[0];
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