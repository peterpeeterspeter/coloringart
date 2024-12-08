import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FinalStepProps {
  name: string;
  description: string;
  answers: Record<string, string>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const FinalStep = ({
  name,
  description,
  answers,
  onNameChange,
  onDescriptionChange,
}: FinalStepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name your mandala</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter a name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe your mandala"
            className="mt-1"
          />
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Your choices:</h3>
        {Object.entries(answers).map(([key, value]) => (
          <div key={key} className="text-sm text-gray-600">
            <span className="capitalize">{key}</span>: {value}
          </div>
        ))}
      </div>
    </>
  );
};