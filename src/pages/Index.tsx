import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Filter, PaintBucket, Home } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Pricing } from "@/components/home/Pricing";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF8F0]">
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

      <Hero />
      <Features />
      <Pricing />

      {/* Library Section */}
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

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif text-primary">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const faqs = [
  {
    question: "What is coloring.art?",
    answer: "Coloring.art is an AI-powered platform offering two unique tools: IdeaArtist for turning text into coloring pages, and SoulScape for creating personalized mandalas."
  },
  {
    question: "How many free generations do I get?",
    answer: "New users receive 10 free generations to explore both IdeaArtist and SoulScape before committing to a subscription."
  },
  {
    question: "What's included in the premium subscription?",
    answer: "Premium subscribers enjoy unlimited generations, advanced customization, high-quality exports, exclusive designs, and priority support."
  }
];

export default Index;