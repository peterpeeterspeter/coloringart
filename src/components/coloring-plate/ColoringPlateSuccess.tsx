import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ColoringPlateSuccessProps {
  imageUrl: string | null;
  onDownload: () => void;
}

export const ColoringPlateSuccess = ({ imageUrl, onDownload }: ColoringPlateSuccessProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Your Coloring Plate is Ready!</h2>
        <Button
          onClick={onDownload}
          className="mt-4"
          disabled={!imageUrl}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Coloring Plate
        </Button>
      </div>
      
      {imageUrl && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Generated coloring plate"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};