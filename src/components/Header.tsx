import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/27717273856", "_blank");
  };

  return (
    <header className="bg-background shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/e8830936-ee67-45a4-826a-d8f16b50ff86.png" alt="FkayPlug Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-brand-dark">
                FKAY<span className="text-brand-orange">PLUG</span>
              </h1>
              <p className="text-sm text-brand-gray">Quality iPhones</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 text-brand-gray">
              <Phone className="h-4 w-4 text-brand-orange" />
              <span className="text-sm">0717273856 / 0602270998</span>
            </div>
            <Button 
              onClick={() => navigate("/cart")}
              variant="outline"
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                size="icon"
                className="md:w-auto md:px-4"
              >
                <User className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            )}
            
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
              size="icon"
            >
              <MessageCircle className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;