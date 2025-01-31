import { useState, useEffect, useCallback } from "react";
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

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
      setIsSuccess(false);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    // Prevent multiple submissions
    if (isGenerating || isSubmitting) {
      console.log("Generation or submission already in progress");
      return;
    }

    // Basic validation
    if (!name.trim() || !prompt.trim()) {
      toast.error("Please provide a name and prompt for your coloring plate");
      return;
    }

    try {
      console.log("Starting coloring plate generation...");
      setIsSubmitting(true);

      // Check generation count for anonymous users
      const currentCount = parseInt(localStorage.getItem('generationCount') || '0');
      if (!session?.user?.id && currentCount >= 9) {
        toast.error("You've reached your 10 free generations limit. Please sign in to continue.");
        navigate("/auth");
        return;
      }

      // Generate the coloring plate
      const imageUrl = await generateColoringPlate();
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }

      // Update generation count for anonymous users
      if (!session?.user?.id) {
        localStorage.setItem('generationCount', (currentCount + 1).toString());
        setIsSuccess(true);
        toast.success("Your coloring plate has been created");
        return;
      }

      // Save to database for authenticated users
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
  }, [isGenerating, isSubmitting, name, prompt, session, answers, navigate, generateColoringPlate]);

  const handleAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

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