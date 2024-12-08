import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pricing as PricingSection } from "@/components/home/Pricing";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF8F0]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/05478edb-875e-4a7a-8662-3f2fad9e4121.png" 
              alt="Coloring.art Logo" 
              className="h-16"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="/create-coloring-plate" className="hover:text-primary transition-colors">Text To Coloring Page</a>
              <a href="/create-mandala" className="hover:text-primary transition-colors">Create Mandala</a>
              <a href="/gallery" className="hover:text-primary transition-colors">Gallery</a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary font-serif">
          Choose Your Plan
        </h1>
        <PricingSection />
      </div>
    </div>
  );
};

export default Pricing;