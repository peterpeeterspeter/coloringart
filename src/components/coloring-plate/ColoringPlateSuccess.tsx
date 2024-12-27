import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ColoringPlateSuccessProps {
  imageUrl: string | null;
}

export const ColoringPlateSuccess = ({ imageUrl }: ColoringPlateSuccessProps) => {
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
      link.download = `coloring-plate-${Date.now()}.png`;
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
        <h2 className="text-2xl font-bold text-primary">Your Coloring Plate is Ready!</h2>
        <Button
          onClick={handleDownload}
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