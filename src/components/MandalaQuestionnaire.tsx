import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { questions } from "./mandala/questions";
import { QuestionStep } from "./mandala/QuestionStep";
import { FinalStep } from "./mandala/FinalStep";
import { Loader2 } from "lucide-react";

export const MandalaQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const generateMandala = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-mandala', {
        body: { settings: answers }
      });

      if (error) throw error;

      // Poll for the result
      const checkResult = async (url: string) => {
        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          },
        });
        const result = await response.json();
        
        if (result.status === "succeeded") {
          return result.output[0];
        } else if (result.status === "failed") {
          throw new Error("Image generation failed");
        }
        
        // Wait and check again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkResult(url);
      };

      const imageUrl = await checkResult(data.urls.get);
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

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (!name.trim()) {
        toast({
          title: "Name Required",
          description: "Please provide a name for your mandala",
          variant: "destructive",
        });
        return;
      }

      if (!session?.user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a mandala",
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
    }
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-6 animate-fade-in">
        {isLastQuestion ? (
          <>
            <FinalStep
              name={name}
              description={description}
              answers={answers}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
            {generatedImage && (
              <div className="mt-4">
                <img
                  src={generatedImage}
                  alt="Generated Mandala"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </>
        ) : (
          <QuestionStep
            question={currentQ}
            value={answers[currentQ.id]}
            onAnswer={handleAnswer}
          />
        )}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id] || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : isLastQuestion ? (
              "Create Mandala"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};