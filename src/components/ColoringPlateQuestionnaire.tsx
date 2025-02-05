import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { ColoringPlateForm } from "./coloring-plate/ColoringPlateForm";
import { ColoringPlateSuccess } from "./coloring-plate/ColoringPlateSuccess";
import { useNavigate } from "react-router-dom";
import { useColoringPlateGenerator } from "./coloring-plate/ColoringPlateGenerator";
import { Loader2 } from "lucide-react";

export const ColoringPlateQuestionnaire = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    // Prevent multiple submissions
    if (isGenerating || isSubmitting) {
      console.log("Generation or submission already in progress");
      return;
    }

    // Reset error state
    setError(null);

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
      const { error: dbError } = await supabase.from("coloring_plates").insert({
        name,
        description,
        prompt,
        settings: { ...answers, prompt },
        image_url: imageUrl,
        user_id: session.user.id,
      });

      if (dbError) throw dbError;

      setIsSuccess(true);
      toast.success("Your coloring plate has been created");
      
    } catch (error) {
      console.error("Error creating coloring plate:", error);
      setError(error.message || "Failed to create coloring plate. Please try again.");
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-6 space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (isSubmitting || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-6 space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-primary">Generating Your Coloring Plate</h2>
            <p className="text-gray-600">Please wait while we create your custom coloring plate...</p>
          </div>
        </Card>
      </div>
    );
  }

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