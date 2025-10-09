import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Smartphone, HardDrive } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductCardProps {
  model: string;
  storage: string;
  price: number;
  condition: "brand-new" | "pre-owned";
  image?: string;
}

const ProductCard = ({ model, storage, price, condition, image }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const product = { 
      id: `${model}-${storage}-${condition}`,
      model, 
      storage, 
      price, 
      condition, 
      image 
    };
    addToCart(product);
    toast.success("Added to cart!", {
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  return (
    <Card className="bg-white shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 w-full md:max-w-xs mx-auto h-full flex flex-col">
      {image && (
        <div className="h-64 overflow-hidden flex items-center justify-center">
          <img 
            src={image} 
            alt={`${model} ${storage}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 md:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6">
          <Badge 
            className={condition === "brand-new" ? "bg-brand-orange text-white rounded-full px-3 py-1" : "bg-blue-500 text-white rounded-full px-3 py-1"}
          >
            {condition === "brand-new" ? "BRAND NEW" : "PRE-OWNED"}
          </Badge>
          <div className="p-2 bg-brand-orange/10 rounded border border-brand-orange/20">
            <Smartphone className="h-4 w-4 text-brand-orange" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2 min-h-[4rem] flex items-center">
          {model}
        </h3>
        
        <div className="flex items-center gap-2 mb-6 text-gray-500">
          <HardDrive className="h-4 w-4" />
          <span className="text-sm font-medium">{storage}</span>
        </div>
        
        <div className="mt-auto space-y-4">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-brand-orange">
              R{price.toLocaleString()}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-lg transition-all duration-300 w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;