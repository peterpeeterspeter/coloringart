import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Download } from "lucide-react";

export const ColoringPlateQuestionnaire = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const generateColoringPlate = async () => {
    try {
      const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-coloring-plate', {
        body: { settings: { prompt } }
      });

      if (initialError) throw initialError;
      console.log("Initial response:", initialData);

      const checkResult = async (predictionId: string): Promise<string> => {
        const { data: statusData, error: statusError } = await supabase.functions.invoke('generate-coloring-plate', {
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
      console.error("Error generating coloring plate:", error);
      toast({
        title: "Error",
        description: "Failed to generate coloring plate. Please try again.",
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
      a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-coloring-plate.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your coloring plate has been downloaded",
      });
    } catch (error) {
      console.error("Error downloading coloring plate:", error);
      toast({
        title: "Error",
        description: "Failed to download coloring plate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a coloring plate",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim() || !prompt.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide a name and prompt for your coloring plate",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await generateColoringPlate();
      
      const { error } = await supabase.from("coloring_plates").insert({
        name,
        description,
        prompt,
        settings: { prompt },
        image_url: imageUrl,
        user_id: session.user.id,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your coloring plate has been created",
      });
      
    } catch (error) {
      console.error("Error creating coloring plate:", error);
      toast({
        title: "Error",
        description: "Failed to create coloring plate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-8 animate-fade-in">
        {!isSuccess ? (
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
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want in your coloring plate..."
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? "Generating..." : "Generate Coloring Plate"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-primary">Your Coloring Plate is Ready!</h2>
              <Button
                onClick={handleDownload}
                className="mt-4"
                disabled={!generatedImage}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Coloring Plate
              </Button>
            </div>
            
            {generatedImage && (
              <div className="flex justify-center">
                <img
                  src={generatedImage}
                  alt="Generated coloring plate"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};