import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  onClick: () => void;
}

export const SubmitButton = ({ isSubmitting, onClick }: SubmitButtonProps) => (
  <div className="flex justify-end">
    <Button
      onClick={onClick}
      disabled={isSubmitting}
      className="bg-primary hover:bg-primary/90 text-white"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        "Create Mandala"
      )}
    </Button>
  </div>
);