import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { questions } from "./mandala/questions";
import { FinalStep } from "./mandala/FinalStep";
import { QuestionGroup } from "./mandala/QuestionGroup";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { MandalaPreview } from "./mandala/MandalaPreview";
import { SubmitButton } from "./mandala/SubmitButton";
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
  const navigate = useNavigate();
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

      toast({
        title: "Success!",
        description: "Your mandala has been created",
      });
      navigate("/");
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

        <MandalaPreview imageUrl={generatedImage} />
        <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
      </Card>
    </div>
  );
};