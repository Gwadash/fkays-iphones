import { Button } from "@/components/ui/button";
import { ArrowDown, Star, Shield, Truck } from "lucide-react";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-hero text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            THE BIGGEST PLUG
            <br />
            <span className="text-yellow-300">IN THE MARKET</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Premium Quality iPhones - Brand New & Pre-owned
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="h-5 w-5 text-green-300" />
              <span>Warranty Included</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Truck className="h-5 w-5 text-blue-300" />
              <span>National Delivery</span>
            </div>
          </div>
          
          <Button 
            onClick={scrollToProducts}
            size="lg"
            className="bg-white text-brand-orange hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-hover"
          >
            Shop Now
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;