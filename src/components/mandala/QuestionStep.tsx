import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuestionStepProps {
  question: Question;
  value: string;
  onAnswer: (value: string) => void;
}

export const QuestionStep = ({ question, value, onAnswer }: QuestionStepProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">{question.question}</h2>
      <RadioGroup
        onValueChange={onAnswer}
        value={value}
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