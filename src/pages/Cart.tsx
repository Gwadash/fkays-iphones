import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleYocoCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("Please sign in to continue with checkout");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      const amountInCents = totalPrice * 100;
      const items = cartItems.map(item => ({
        id: item.id,
        name: `${item.model} ${item.storage} (${item.condition})`,
        price: item.price * 100,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke("yoco-charge", {
        body: {
          amountInCents,
          items,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.redirectUrl && data?.checkoutId) {
        // Redirect to Yoco hosted checkout page with checkoutId for verification
        window.location.href = `${data.redirectUrl}`;
        // Store checkoutId for verification on return
        localStorage.setItem("yoco_checkout_id", data.checkoutId);
      } else {
        throw new Error("No redirect URL received from payment gateway");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to initiate checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Button onClick={() => navigate("/")} className="bg-brand-orange hover:bg-brand-orange/90">
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.model}
                      className="w-24 h-24 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.model}</h3>
                    <p className="text-sm text-muted-foreground">{item.storage}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.condition.replace("-", " ")}</p>
                    <p className="text-brand-orange font-bold mt-2">
                      R{item.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand-orange">R{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <Button
                onClick={handleYocoCheckout}
                disabled={isProcessing}
                className="w-full bg-brand-orange hover:bg-brand-orange/90"
              >
                {isProcessing ? "Processing..." : "Pay with Yoco"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full mt-2"
              >
                Continue Shopping
              </Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
