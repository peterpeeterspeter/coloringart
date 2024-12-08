import { ColoringPlateQuestionnaire } from "@/components/ColoringPlateQuestionnaire";

const CreateColoringPlate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF8F0]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/05478edb-875e-4a7a-8662-3f2fad9e4121.png" 
              alt="Coloring.art Logo" 
              className="h-12"
            />
          </div>
          <div className="flex space-x-6 text-gray-600">
            <a href="/" className="hover:text-primary">Free Coloring Pages</a>
            <a href="/create-coloring-plate" className="hover:text-primary">Text To Coloring Page</a>
            <a href="/gallery" className="hover:text-primary">Gallery</a>
          </div>
        </nav>
      </header>
      <ColoringPlateQuestionnaire />
    </div>
  );
};

export default CreateColoringPlate;