import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

const questions = [
  {
    id: "mood",
    question: "How are you feeling today?",
    options: ["Calm", "Energetic", "Focused", "Relaxed"],
  },
  {
    id: "complexity",
    question: "What level of detail do you prefer?",
    options: ["Simple", "Moderate", "Complex", "Very Intricate"],
  },
  {
    id: "style",
    question: "What style appeals to you most?",
    options: ["Geometric", "Floral", "Abstract", "Traditional"],
  },
];

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
        {isLastQuestion && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name your mandala</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your mandala"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Your choices:</h3>
              {Object.entries(answers).map(([key, value]) => (
                <div key={key} className="text-sm text-gray-600">
                  <span className="capitalize">{key}</span>: {value}
                </div>
              ))}
            </div>
          </>
        )}
        {!isLastQuestion && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {currentQ.question}
            </h2>
            <RadioGroup
              onValueChange={handleAnswer}
              value={answers[currentQ.id]}
              className="space-y-4"
            >
              {currentQ.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </>
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