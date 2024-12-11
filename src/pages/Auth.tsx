import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
          </Button>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary font-serif">
          Welcome Back
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;