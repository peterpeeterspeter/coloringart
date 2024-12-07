import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      console.log("Final answers:", answers);
      // Here we would generate the mandala based on answers
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 animate-fade-in">
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
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {currentQuestion === questions.length - 1 ? "Generate" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};