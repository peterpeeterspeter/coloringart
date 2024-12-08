import { MandalaPreview } from "./MandalaPreview";
import { MandalaExplanation } from "./MandalaExplanation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { MandalaAnswers } from "@/types/mandala";

interface MandalaSuccessProps {
  imageUrl: string | null;
  answers: MandalaAnswers;
  onDownload: () => void;
}

export const MandalaSuccess = ({ imageUrl, answers, onDownload }: MandalaSuccessProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Your Mandala is Ready!</h2>
        <Button
          onClick={onDownload}
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