import { Button } from "@/components/ui/button";
import { PaintBucket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LibrarySection = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-serif text-primary mb-4">
          Explore Our Coloring Library
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Dive into a vast collection of coloring pages featuring themes, characters, and styles for every mood and interest.
        </p>
      </div>

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
          }
        ].map((image, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img src={image.url} alt={image.title} className="w-full h-64 object-contain mb-4 rounded-lg" />
            <h3 className="font-serif text-xl font-semibold text-gray-800">{image.title}</h3>
            <p className="text-sm text-gray-500">{image.pages} Pages</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button 
          onClick={() => navigate("/gallery")}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white shadow-md hover:shadow-lg transition-all"
        >
          <PaintBucket className="mr-2 h-4 w-4" />
          View More Coloring Pages
        </Button>
      </div>
    </section>
  );
};