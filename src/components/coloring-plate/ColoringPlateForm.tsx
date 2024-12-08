import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuestionStep } from "./QuestionStep";
import { questions } from "./questions";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ColoringPlateFormProps {
  name: string;
  description: string;
  prompt: string;
  answers: Record<string, string | string[]>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onAnswer: (questionId: string, value: string | string[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ColoringPlateForm = ({
  name,
  description,
  prompt,
  answers,
  onNameChange,
  onDescriptionChange,
  onPromptChange,
  onAnswer,
  onSubmit,
  isSubmitting,
}: ColoringPlateFormProps) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-primary">Create Your Coloring Plate</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter a name for your coloring plate"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add a description for your coloring plate"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Prompt *
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe what you want in your coloring plate..."
            className="min-h-[100px]"
            required
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowQuestionnaire(!showQuestionnaire)}
          className="w-full"
        >
          {showQuestionnaire ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Optional Questionnaire
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Optional Questionnaire
            </>
          )}
        </Button>

        {showQuestionnaire && (
          <div className="space-y-8 mt-8">
            {questions.map((question) => (
              <div key={question.id}>
                <QuestionStep
                  question={question}
                  value={answers[question.id] || (question.type === "multiple" ? [] : "")}
                  onAnswer={(value) => onAnswer(question.id, value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? "Generating..." : "Generate Coloring Plate"}
        </Button>
      </div>
    </div>
  );
};