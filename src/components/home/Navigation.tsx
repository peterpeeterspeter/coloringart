import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <header className="container mx-auto px-4 py-6 border-b border-gray-100">
      <nav className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/05478edb-875e-4a7a-8662-3f2fad9e4121.png" 
            alt="Coloring.art Logo" 
            className="h-16 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
            <a href="/create-coloring-plate" className="hover:text-primary transition-colors">IdeaArtist</a>
            <a href="/create-mandala" className="hover:text-primary transition-colors">SoulScape</a>
            <a href="/gallery" className="hover:text-primary transition-colors">Gallery</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </Button>
        </div>
      </nav>
    </header>
  );
};