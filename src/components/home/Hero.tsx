import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 pt-4 pb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold font-serif bg-gradient-to-r from-primary to-[#FFA500] bg-clip-text text-transparent">
            Transform Your Imagination into Coloring Masterpieces
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Welcome to coloring.art, the ultimate AI-powered coloring book generator that brings your creativity to life!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate("/create-coloring-plate")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            >
              Try IdeaArtist
            </Button>
            <Button 
              onClick={() => navigate("/create-mandala")}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg"
            >
              Try SoulScape
            </Button>
          </div>
          <p className="text-sm text-gray-500">2 free generations • No credit card required</p>
        </div>
        <div className="md:w-1/2">
          <img 
            src="/lovable-uploads/2150c025-127a-44b9-8f77-4f907012b62b.png" 
            alt="AI Robot Artist" 
            className="w-full max-w-sm mx-auto rounded-lg shadow-lg animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
};