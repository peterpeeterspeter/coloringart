import { FlowerIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-16 bg-white/50">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FlowerIcon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-primary">SoulScape: Personalized Mandalas</h2>
          </div>
          <p className="text-gray-600">
            Create unique mandalas that reflect your inner state. Our AI transforms your emotions
            and intentions into beautiful, symmetrical designs perfect for mindful coloring.
          </p>
          <Button 
            onClick={() => navigate("/create-mandala")}
            variant="outline"
            className="w-full"
          >
            Create Your Mandala
          </Button>
        </div>

        <div className="space-y-6 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Type className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-secondary">IdeaArtist: Transform Ideas</h2>
          </div>
          <p className="text-gray-600">
            Turn your words into stunning coloring pages. Type any phrase or story, and watch as our
            AI converts it into an intricate, ready-to-color design.
          </p>
          <Button 
            onClick={() => navigate("/create-coloring-plate")}
            variant="outline"
            className="w-full"
          >
            Create from Text
          </Button>
        </div>
      </div>
    </section>
  );
};