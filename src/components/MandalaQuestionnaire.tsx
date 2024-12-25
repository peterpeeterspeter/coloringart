import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { MandalaForm } from "./mandala/MandalaForm";
import { MandalaSuccess } from "./mandala/MandalaSuccess";
import { SubmitButton } from "./mandala/SubmitButton";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMandalaGenerator } from "./mandala/MandalaGenerator";

export const MandalaQuestionnaire = () => {
  const {
    answers,
    name,
    description,
    setName,
    setDescription,
    handleAnswer,
    isValid,
  } = useQuestionnaireState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const { generatedImage, generateMandala } = useMandalaGenerator({
    answers,
  });

  const handleSubmit = async () => {
    // Increment generation count
    const currentCount = parseInt(localStorage.getItem('generationCount') || '0');
    localStorage.setItem('generationCount', (currentCount + 1).toString());

    if (!session?.user?.id && currentCount >= 9) {
      toast.error("You've reached your 10 free generations limit. Please sign in to continue.");
      navigate("/auth");
      return;
    }

    if (!isValid()) {
      toast.error("Please provide a name for your mandala");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await generateMandala();
      
      if (!session?.user?.id) {
        setIsSuccess(true);
        toast.success("Your mandala has been created");
        return;
      }

      const { error } = await supabase.from("mandalas").insert({
        name,
        description,
        settings: {
          ...answers,
          imageUrl
        },
        user_id: session.user.id,
      });

      if (error) {
        console.error("Error saving mandala:", error);
        throw error;
      }

      setIsSuccess(true);
      toast.success("Your mandala has been created");
      
    } catch (error) {
      console.error("Error creating mandala:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create mandala. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <Button
        variant="ghost"
        className="w-fit mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-4xl p-6 space-y-8 animate-fade-in">
          {!isSuccess ? (
            <>
              <MandalaForm
                answers={answers}
                name={name}
                description={description}
                onAnswer={handleAnswer}
                onNameChange={setName}
                onDescriptionChange={setDescription}
              />
              <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
            </>
          ) : (
            <MandalaSuccess
              imageUrl={generatedImage}
              answers={answers}
              onDownload={() => {}} // Implement download functionality if needed
            />
          )}
        </Card>
      </div>
    </div>
  );
};