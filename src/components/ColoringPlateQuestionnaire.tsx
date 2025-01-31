import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { ColoringPlateForm } from "./coloring-plate/ColoringPlateForm";
import { ColoringPlateSuccess } from "./coloring-plate/ColoringPlateSuccess";
import { useNavigate } from "react-router-dom";
import { useColoringPlateGenerator } from "./coloring-plate/ColoringPlateGenerator";

export const ColoringPlateQuestionnaire = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const { generatedImage, generateColoringPlate, isGenerating } = useColoringPlateGenerator({
    prompt,
    answers,
  });

  const handleSubmit = async () => {
    if (isGenerating || isSubmitting) {
      toast.error("Generation already in progress. Please wait...");
      return;
    }

    // Basic validation
    if (!name.trim() || !prompt.trim()) {
      toast.error("Please provide a name and prompt for your coloring plate");
      return;
    }

    // Check generation count for anonymous users
    const currentCount = parseInt(localStorage.getItem('generationCount') || '0');
    if (!session?.user?.id && currentCount >= 9) {
      toast.error("You've reached your 10 free generations limit. Please sign in to continue.");
      navigate("/auth");
      return;
    }

    try {
      setIsSubmitting(true);
      localStorage.setItem('generationCount', (currentCount + 1).toString());

      const imageUrl = await generateColoringPlate();
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }

      if (!session?.user?.id) {
        setIsSuccess(true);
        toast.success("Your coloring plate has been created");
        return;
      }

      const { error } = await supabase.from("coloring_plates").insert({
        name,
        description,
        prompt,
        settings: { ...answers, prompt },
        image_url: imageUrl,
        user_id: session.user.id,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Your coloring plate has been created");
      
    } catch (error) {
      console.error("Error creating coloring plate:", error);
      toast.error("Failed to create coloring plate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-8 animate-fade-in">
        {!isSuccess ? (
          <ColoringPlateForm
            name={name}
            description={description}
            prompt={prompt}
            answers={answers}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onPromptChange={setPrompt}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isGenerating}
          />
        ) : (
          <ColoringPlateSuccess
            imageUrl={generatedImage}
          />
        )}
      </Card>
    </div>
  );
};