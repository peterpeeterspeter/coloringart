import { MandalaPreview } from "./MandalaPreview";
import { MandalaExplanation } from "./MandalaExplanation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { MandalaAnswers } from "@/types/mandala";

interface MandalaSuccessProps {
  imageUrl: string | null;
  answers: MandalaAnswers;
  onDownload: () => void;
}

export const MandalaSuccess = ({ imageUrl, answers }: MandalaSuccessProps) => {
  const handleDownload = async () => {
    if (!imageUrl) {
      toast.error("No image available to download");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mandala-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Your Mandala is Ready!</h2>
        <Button
          onClick={handleDownload}
          className="mt-4"
          disabled={!imageUrl}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Mandala
        </Button>
      </div>
      
      <MandalaPreview imageUrl={imageUrl} />
      
      <MandalaExplanation answers={answers} />
    </div>
  );
};