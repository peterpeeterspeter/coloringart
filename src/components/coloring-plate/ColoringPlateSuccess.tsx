import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
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
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create download link
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

  const handleTryAgain = () => {
    window.location.reload();
  };

  if (!imageUrl) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Generation Failed</h2>
        <p className="text-gray-600">Sorry, we couldn't generate your coloring plate.</p>
        <Button onClick={handleTryAgain}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Your Coloring Plate is Ready!</h2>
        <p className="text-gray-600">
          Your coloring plate has been generated successfully. You can download it now or create a new one.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleDownload} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Download Coloring Plate
          </Button>
          <Button onClick={handleTryAgain} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Create Another
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="max-w-2xl w-full bg-white p-4 rounded-lg shadow-lg">
          <img
            src={imageUrl}
            alt="Generated coloring plate"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};