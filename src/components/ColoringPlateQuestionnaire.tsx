import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { ColoringPlateForm } from "./coloring-plate/ColoringPlateForm";
import { ColoringPlateSuccess } from "./coloring-plate/ColoringPlateSuccess";

export const ColoringPlateQuestionnaire = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const generateColoringPlate = async () => {
    try {
      const enhancedPrompt = generateEnhancedPrompt(prompt, answers);
      
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
      toast({
        title: "Error",
        description: "Failed to generate coloring plate. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-coloring-plate.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your coloring plate has been downloaded",
      });
    } catch (error) {
      console.error("Error downloading coloring plate:", error);
      toast({
        title: "Error",
        description: "Failed to download coloring plate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateEnhancedPrompt = (basePrompt: string, answers: Record<string, string | string[]>) => {
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

    return `Create a coloring page of: ${basePrompt}${enhancement}. Make it suitable for coloring with clear, well-defined lines.`;
  };

  const handleSubmit = async () => {
    // Increment generation count
    const currentCount = parseInt(localStorage.getItem('generationCount') || '0');
    localStorage.setItem('generationCount', (currentCount + 1).toString());

    if (!session?.user?.id && currentCount >= 9) {
      toast({
        title: "Free Generations Limit Reached",
        description: "You've reached your 10 free generations limit. Please sign in to continue.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!name.trim() || !prompt.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide a name and prompt for your coloring plate",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await generateColoringPlate();
      
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
      toast({
        title: "Success!",
        description: "Your coloring plate has been created",
      });
      
    } catch (error) {
      console.error("Error creating coloring plate:", error);
      toast({
        title: "Error",
        description: "Failed to create coloring plate. Please try again.",
        variant: "destructive",
      });
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
            isSubmitting={isSubmitting}
          />
        ) : (
          <ColoringPlateSuccess
            imageUrl={generatedImage}
            onDownload={handleDownload}
          />
        )}
      </Card>
    </div>
  );
};
