import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Image, Home, Search, Filter, FlowerIcon, Type, PaintBucket } from "lucide-react";
import { Input } from "@/components/ui/input";

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
              className="h-24 md:h-28"
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
                <Type className="mr-2 h-5 w-5" />
                Create Coloring Page
              </Button>
              <Button 
                onClick={() => navigate("/create-mandala")}
                className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg"
              >
                <FlowerIcon className="mr-2 h-5 w-5" />
                Create Mandala
              </Button>
            </div>
            <p className="text-sm text-gray-500">No credit card required • High-quality output</p>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/lovable-uploads/d14e85bb-e030-4722-a7fd-7fdc12bc2cfe.png" 
              alt="Coloring Page Example" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Custom Mandalas Feature */}
          <div className="space-y-6 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FlowerIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-primary">Custom Mandalas</h2>
            </div>
            <p className="text-gray-600">
              Create unique mandalas based on your current state of mind. Our AI transforms your emotions
              and intentions into beautiful, symmetrical designs perfect for mindful coloring.
            </p>
            <Button 
              onClick={() => navigate("/create-mandala")}
              variant="outline"
              className="w-full"
            >
              Generate Your Mandala
            </Button>
          </div>

          {/* Text-to-Coloring Feature */}
          <div className="space-y-6 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Type className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-secondary">Text to Coloring Page</h2>
            </div>
            <p className="text-gray-600">
              Transform your words into stunning coloring pages. Type any phrase or story, and watch as our
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

      {/* Library Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-primary mb-4">
            Explore Our Coloring Library
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover a vast collection of coloring pages featuring various themes, characters, and styles.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search coloring pages..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sample Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleImages.map((image, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img src={image.url} alt={image.title} className="w-full h-64 object-contain mb-4" />
              <h3 className="font-semibold text-lg">{image.title}</h3>
              <p className="text-sm text-gray-500">{image.pages} Pages</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate("/gallery")}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
          >
            <PaintBucket className="mr-2 h-4 w-4" />
            View More Coloring Pages
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-[#FFF8F0]">
        <h2 className="text-3xl font-bold text-center mb-8 font-serif">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary">
            Ready to Start Your Creative Journey?
          </h2>
          <p className="text-lg text-gray-600">
            Join our community and start creating beautiful, personalized coloring pages today.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
          >
            Get Started Now
          </Button>
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