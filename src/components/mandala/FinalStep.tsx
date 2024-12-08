import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { MandalaAnswers } from "@/types/mandala";

interface FinalStepProps {
  name: string;
  description: string;
  answers: MandalaAnswers;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const FinalStep = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: FinalStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold text-center text-primary">Final Details</h3>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name your mandala *
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter a name for your mandala"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add a description for your mandala"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};