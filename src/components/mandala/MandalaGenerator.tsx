import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MandalaAnswers } from "@/types/mandala";
import { useSession } from "@supabase/auth-helpers-react";

interface MandalaGeneratorProps {
  answers: MandalaAnswers;
}

export const useMandalaGenerator = ({ answers }: MandalaGeneratorProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const session = useSession();

  const generateMandala = async () => {
    try {
      setIsGenerating(true);
      console.log("Starting mandala generation...");
      
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
      
      console.log("Creating mandala job with settings:", settings);

      // Create a job record
      const { data: job, error: jobError } = await supabase
        .from('mandala_jobs')
        .insert({
          status: 'processing',
          settings,
          user_id: session?.user?.id || null
        })
        .select()
        .single();

      if (jobError) {
        console.error("Error creating job:", jobError);
        throw new Error("Failed to create mandala job");
      }

      if (!job) {
        throw new Error("No job was created");
      }

      console.log("Job created successfully:", job);

      // Generate the mandala using the edge function
      const { data, error } = await supabase.functions.invoke('generate-mandala', {
        body: { 
          settings,
          jobId: job.id 
        }
      });

      if (error) {
        console.error("Error generating mandala:", error);
        throw error;
      }

      if (!data || !data.output || !data.output[0]) {
        throw new Error("No image was generated");
      }

      const imageUrl = data.output[0];
      console.log("Mandala generated successfully:", imageUrl);
      setGeneratedImage(imageUrl);
      return imageUrl;

    } catch (error) {
      console.error("Error in mandala generation:", error);
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