import { useState } from "react";
import { questions } from "@/components/mandala/questions";

export const useQuestionnaireState = () => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isValid = () => {
    return name.trim() !== "";
  };

  return {
    answers,
    name,
    description,
    setName,
    setDescription,
    handleAnswer,
    isValid,
  };
};