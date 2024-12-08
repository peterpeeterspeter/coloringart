import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Question } from "./questions";

interface QuestionStepProps {
  question: Question;
  value: string | string[];
  onAnswer: (value: string | string[]) => void;
}

export const QuestionStep = ({ question, value, onAnswer }: QuestionStepProps) => {
  const handleMultipleSelection = (option: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    const maxSelections = question.maxSelections || 1;

    if (currentValue.includes(option)) {
      onAnswer(currentValue.filter((item) => item !== option));
    } else if (currentValue.length < maxSelections) {
      onAnswer([...currentValue, option]);
    }
  };

  if (question.type === "multiple") {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {question.question} {question.optional ? "(Optional)" : ""}
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Choose up to {question.maxSelections} options
        </p>
        <div className="space-y-4">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={Array.isArray(value) && value.includes(option)}
                onCheckedChange={() => handleMultipleSelection(option)}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {question.question} {question.optional ? "(Optional)" : ""}
      </h2>
      <RadioGroup
        onValueChange={(val) => onAnswer(val)}
        value={value as string}
        className="space-y-4"
      >
        {question.options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};