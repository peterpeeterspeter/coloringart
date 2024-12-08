import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
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
              <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
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
          Coloring Gallery
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              url: "/lovable-uploads/16597c91-0047-43ff-b8ec-a27a1b449c42.png",
              title: "Bird in Leaf Frame",
              pages: "12"
            },
            {
              url: "/lovable-uploads/3494b801-54fc-4fe4-ad69-ff539b6e9d4a.png",
              title: "Rose Mandala",
              pages: "8"
            },
            {
              url: "/lovable-uploads/c9eaccba-8754-4ba9-a3ee-0f6a5e82988e.png",
              title: "Cat in Kimono",
              pages: "15"
            },
            {
              url: "/lovable-uploads/4764d9fe-d0bf-4753-a82b-570a8026f2d1.png",
              title: "Geometric Mandala",
              pages: "10"
            }
          ].map((image, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img src={image.url} alt={image.title} className="w-full h-64 object-contain mb-4" />
              <h3 className="font-semibold text-lg">{image.title}</h3>
              <p className="text-sm text-gray-500">{image.pages} Pages</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;