import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const Hero = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        Create Your Perfect Coloring Experience
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        Generate unique mandalas and custom coloring pages tailored just for you. Express your creativity
        with our AI-powered coloring book maker.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate("/create-mandala")}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
        >
          Create Mandala
        </Button>
        <Button
          onClick={() => navigate("/create-coloring-plate")}
          className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg"
        >
          Custom Page
        </Button>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="mt-8"
      >
        Sign Out
      </Button>
    </div>
  );
};