import { Question } from "./questions";
import { QuestionStep } from "./QuestionStep";

interface QuestionGroupProps {
  questions: Question[];
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export const QuestionGroup = ({ questions, answers, onAnswer }: QuestionGroupProps) => {
  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id}>
          <QuestionStep
            question={question}
            value={answers[question.id] || (question.type === "multiple" ? [] : "")}
            onAnswer={(value) => onAnswer(question.id, value)}
            optional
          />
        </div>
      ))}
    </div>
  );
};