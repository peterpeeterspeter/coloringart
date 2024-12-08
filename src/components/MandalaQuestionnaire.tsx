import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { questions } from "./mandala/questions";
import { FinalStep } from "./mandala/FinalStep";
import { QuestionGroup } from "./mandala/QuestionGroup";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { MandalaPreview } from "./mandala/MandalaPreview";
import { SubmitButton } from "./mandala/SubmitButton";
import { MandalaExplanation } from "./mandala/MandalaExplanation";
import { Download } from "lucide-react";
import type { MandalaAnswers } from "@/types/mandala";

// Group questions by category
const questionGroups = [
  {
    title: "Emotional Center",
    questions: questions.slice(0, 3),
  },
  {
    title: "Physical Well-being",
    questions: questions.slice(3, 5),
  },
  {
    title: "Mental State",
    questions: questions.slice(5, 7),
  },
  {
    title: "Spiritual Connection",
    questions: questions.slice(7, 9),
  },
  {
    title: "Environmental Influence",
    questions: questions.slice(9),
  },
];

export const MandalaQuestionnaire = () => {
  const {
    answers,
    name,
    description,
    setName,
    setDescription,
    handleAnswer,
    isValid,
  } = useQuestionnaireState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const generateMandala = async () => {
    try {
      // Initial request to start the generation
      const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-mandala', {
        body: { settings: answers }
      });

      if (initialError) throw initialError;
      console.log("Initial response:", initialData);

      // Poll for the result
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
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkResult(predictionId);
      };

      const imageUrl = await checkResult(initialData.id);
      setGeneratedImage(imageUrl);
      return imageUrl;

    } catch (error) {
      console.error("Error generating mandala:", error);
      toast({
        title: "Error",
        description: "Failed to generate mandala. Please try again.",
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
      a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-mandala.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your mandala has been downloaded",
      });
    } catch (error) {
      console.error("Error downloading mandala:", error);
      toast({
        title: "Error",
        description: "Failed to download mandala. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a mandala",
        variant: "destructive",
      });
      return;
    }

    if (!isValid()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your mandala",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await generateMandala();
      
      const { error } = await supabase.from("mandalas").insert({
        name,
        description,
        settings: {
          ...answers,
          imageUrl
        },
        user_id: session.user.id,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your mandala has been created",
      });
      
    } catch (error) {
      console.error("Error creating mandala:", error);
      toast({
        title: "Error",
        description: "Failed to create mandala. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-8 animate-fade-in">
        {!isSuccess ? (
          <>
            <div className="space-y-12">
              {questionGroups.map((group, index) => (
                <div key={index} className="space-y-6">
                  <h3 className="text-3xl font-bold text-center text-primary">
                    {group.title}
                  </h3>
                  <QuestionGroup
                    questions={group.questions}
                    answers={answers}
                    onAnswer={handleAnswer}
                  />
                </div>
              ))}
            </div>

            <FinalStep
              name={name}
              description={description}
              answers={answers}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
          </>
        ) : (
          <>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-primary">Your Mandala is Ready!</h2>
              <Button
                onClick={handleDownload}
                className="mt-4"
                disabled={!generatedImage}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Mandala
              </Button>
            </div>
            
            <MandalaPreview imageUrl={generatedImage} />
            
            <MandalaExplanation answers={answers} />
          </>
        )}

        {!isSuccess && <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />}
      </Card>
    </div>
  );
};
