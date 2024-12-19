import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const Pricing = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSubscribe = async (priceId: string, mode: 'subscription' | 'payment') => {
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      console.log('Creating checkout session with:', { priceId, mode });
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, mode }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 font-serif text-primary">Choose Your Creative Journey</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Free Trial</h3>
          <p className="text-3xl font-bold mb-6">$0</p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              2 free generations
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Basic customization
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Standard quality exports
            </li>
          </ul>
          <Button 
            onClick={() => navigate("/auth")}
            variant="outline"
            className="w-full"
          >
            Start Free
          </Button>
        </div>

        <div className="bg-primary/5 p-8 rounded-xl shadow-lg border-2 border-primary relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
            Most Popular
          </div>
          <h3 className="text-xl font-bold mb-4">Premium Monthly</h3>
          <p className="text-3xl font-bold mb-6">$9.99<span className="text-sm text-gray-600">/month</span></p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Unlimited generations
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Advanced customization
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              High-quality exports
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Exclusive designs
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Priority support
            </li>
          </ul>
          <Button 
            onClick={() => handleSubscribe('price_1QXhBQAhsTfuXhtS3SUSYbvO', 'subscription')}
            className="w-full bg-primary text-white"
          >
            Subscribe Now
          </Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Pay As You Go</h3>
          <p className="text-3xl font-bold mb-6">$4.99<span className="text-sm text-gray-600">/20 pages</span></p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              20 generations
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Advanced customization
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              High-quality exports
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Never expires
            </li>
          </ul>
          <Button 
            onClick={() => handleSubscribe('price_1QXhCLAhsTfuXhtSNWqnvF8m', 'payment')}
            variant="outline"
            className="w-full"
          >
            Buy Pack
          </Button>
        </div>
      </div>
    </section>
  );
};