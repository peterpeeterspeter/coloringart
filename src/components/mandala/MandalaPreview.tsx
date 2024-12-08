import { useState } from "react";

interface MandalaPreviewProps {
  imageUrl: string | null;
}

export const MandalaPreview = ({ imageUrl }: MandalaPreviewProps) => {
  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <img
        src={imageUrl}
        alt="Generated Mandala"
        className="w-full rounded-lg shadow-lg"
      />
    </div>
  );
};