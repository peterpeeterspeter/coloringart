import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Image, Home } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF8F0]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/05478edb-875e-4a7a-8662-3f2fad9e4121.png" 
              alt="Coloring.art Logo" 
              className="h-16 md:h-20"
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
              className="ml-4"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-serif">
              AI Coloring Pages Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Create custom coloring pages and mandalas with our AI-powered tools. Perfect for relaxation and creativity!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/create-coloring-plate")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              >
                Create Coloring Page
              </Button>
              <Button 
                onClick={() => navigate("/create-mandala")}
                className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg"
              >
                Create Mandala
              </Button>
            </div>
            <p className="text-sm text-gray-500">No credit card required • High-quality output</p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src="/lovable-uploads/d14e85bb-e030-4722-a7fd-7fdc12bc2cfe.png" 
              alt="Coloring Page Example" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 space-y-16">
        {/* Text to Coloring Pages */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Convert Text Into Coloring Pages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            With the power of AI Coloring Pages Generator, you can now convert any text into coloring pictures
          </p>
          <Button 
            onClick={() => navigate("/create-coloring-plate")}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
          >
            <Image className="mr-2 h-4 w-4" />
            Generate AI coloring page
          </Button>
        </div>

        {/* Sample Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleImages.map((image, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src={image.url} alt={image.title} className="w-full h-64 object-contain mb-4" />
              <h3 className="font-semibold text-lg">{image.title}</h3>
              <p className="text-sm text-gray-500">{image.pages} Pages</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => navigate("/gallery")}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
          >
            View more free printable coloring pages
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-[#FFF8F0]">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently asked questions</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const sampleImages = [
  {
    url: "https://placehold.co/400x400",
    title: "Christmas Tree",
    pages: "12"
  },
  {
    url: "https://placehold.co/400x400",
    title: "Cupcake",
    pages: "8"
  },
  {
    url: "https://placehold.co/400x400",
    title: "Dolphin",
    pages: "15"
  }
];

const faqs = [
  {
    question: "What is coloring.art?",
    answer: "Coloring.art is an AI-powered platform that converts text descriptions and images into beautiful coloring pages."
  },
  {
    question: "Can I use coloring.art's AI coloring pages generator on PC and mobile?",
    answer: "Yes, our platform is fully responsive and works on all devices including PC, tablets, and smartphones."
  },
  {
    question: "Can the AI-converted coloring pages be printed directly? Or do they need other processing?",
    answer: "All generated coloring pages can be downloaded and printed directly without any additional processing required."
  }
];

export default Index;
