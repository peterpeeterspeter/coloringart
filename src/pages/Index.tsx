import { Navigation } from "@/components/home/Navigation";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Pricing } from "@/components/home/Pricing";
import { LibrarySection } from "@/components/home/LibrarySection";
import { FAQSection } from "@/components/home/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF8F0]">
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <LibrarySection />
      <FAQSection />
    </div>
  );
};

export default Index;