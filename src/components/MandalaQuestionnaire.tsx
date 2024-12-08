import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { MandalaForm } from "./mandala/MandalaForm";
import { MandalaSuccess } from "./mandala/MandalaSuccess";
import { SubmitButton } from "./mandala/SubmitButton";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const generateMandala = async () => {
    try {
      const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-mandala', {
        body: { settings: answers }
      });

      if (initialError) throw initialError;
      console.log("Initial response:", initialData);

      const checkResult = async (predictionId: string): Promise<string> => {
        const { data: statusData, error: statusError } = await supabase.functions.invoke('generate-mandala', {
          body: { predictionId }
        });

        if (statusError) throw statusError;
        console.log("Status check response:", statusData);
        
        if (statusData.status === "succeeded") {
          return statusData.output[0];
        } else if (statusData.status === "failed") {
          throw new Error("Image generation failed");
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkResult(predictionId);
      };

      const imageUrl = await checkResult(initialData.id);
      setGeneratedImage(imageUrl);
      return imageUrl;

    } catch (error) {
      console.error("Error generating mandala:", error);
      toast({
        title: "Error",
        description: "Failed to generate mandala. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-mandala.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your mandala has been downloaded",
      });
    } catch (error) {
      console.error("Error downloading mandala:", error);
      toast({
        title: "Error",
        description: "Failed to download mandala. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a mandala",
        variant: "destructive",
      });
      return;
    }

    if (!isValid()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your mandala",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await generateMandala();
      
      const { error } = await supabase.from("mandalas").insert({
        name,
        description,
        settings: {
          ...answers,
          imageUrl
        },
        user_id: session.user.id,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your mandala has been created",
      });
      
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
              onDownload={handleDownload}
            />
          )}
        </Card>
      </div>
    </div>
  );
};
