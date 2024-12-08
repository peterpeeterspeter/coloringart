import { QuestionGroup } from "./QuestionGroup";
import { FinalStep } from "./FinalStep";
import { questions } from "./questions";
import type { MandalaAnswers } from "@/types/mandala";

interface MandalaFormProps {
  answers: MandalaAnswers;
  name: string;
  description: string;
  onAnswer: (questionId: string, value: string | string[]) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

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

export const MandalaForm = ({
  answers,
  name,
  description,
  onAnswer,
  onNameChange,
  onDescriptionChange,
}: MandalaFormProps) => {
  return (
    <div className="space-y-12">
      {questionGroups.map((group, index) => (
        <div key={index} className="space-y-6">
          <h3 className="text-3xl font-bold text-center text-primary">
            {group.title}
          </h3>
          <QuestionGroup
            questions={group.questions}
            answers={answers}
            onAnswer={onAnswer}
          />
        </div>
      ))}
      
      <FinalStep
        name={name}
        description={description}
        answers={answers}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
      />
    </div>
  );
};