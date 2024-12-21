import { ColoringPlateQuestionnaire } from "@/components/ColoringPlateQuestionnaire";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateColoringPlate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF8F0]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/05478edb-875e-4a7a-8662-3f2fad9e4121.png" 
              alt="Coloring.art Logo" 
              className="h-32 md:h-36 cursor-pointer" 
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
              <a href="/" className="hover:text-primary transition-colors">Free Coloring Pages</a>
              <a href="/create-coloring-plate" className="hover:text-primary transition-colors">Text To Coloring Page</a>
              <a href="/create-mandala" className="hover:text-primary transition-colors">Create Mandala</a>
              <a href="/gallery" className="hover:text-primary transition-colors">Gallery</a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary/10"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-primary to-[#FFA500] bg-clip-text text-transparent">
            Transform Your Imagination into Coloring Masterpieces
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Welcome to coloring.art, the ultimate AI-powered coloring book generator that brings your creativity to life!
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6 p-8 bg-white/50 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold font-serif text-primary">Text-to-Coloring Plate: Bring Your Words to Life</h2>
            <p className="text-gray-600">
              Experience the magic of our Text-to-Coloring Plate feature, which transforms your words into stunning coloring pages.
              Type in any phrase, sentence, or story, and watch as our AI converts your text into intricate, ready-to-color designs.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Type in your ideas and watch them transform
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Customize complexity and style
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Download high-quality printable pages
              </li>
            </ul>
          </div>
          
          <div className="space-y-6 p-8 bg-white/50 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold font-serif text-primary">Easy to Use, Always Accessible</h2>
            <p className="text-gray-600">
              Enjoy a seamless, user-friendly experience with coloring.art, accessible from any device with an internet connection.
              No downloads or installations required – start creating and coloring instantly!
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                User-friendly interface
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Instant high-quality downloads
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Create from any device
              </li>
            </ul>
          </div>
        </div>

        {/* Generator Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 font-serif text-primary">
            Create Your Coloring Page
          </h2>
          <ColoringPlateQuestionnaire />
        </div>
      </div>
    </div>
  );
};

export default CreateColoringPlate;