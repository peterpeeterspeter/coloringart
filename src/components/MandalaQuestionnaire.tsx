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

export const MandalaQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
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
        const { error } = await supabase.from("mandalas").insert({
          name,
          description,
          settings: answers,
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
          <FinalStep
            name={name}
            description={description}
            answers={answers}
            onNameChange={setName}
            onDescriptionChange={setDescription}
          />
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
            {isSubmitting
              ? "Creating..."
              : isLastQuestion
              ? "Create Mandala"
              : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};