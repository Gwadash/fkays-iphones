import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const hasRun = useState(false);

  useEffect(() => {
    if (hasRun[0]) return;
    hasRun[0] = true;

    const checkoutId = searchParams.get("checkoutId") || searchParams.get("id") || localStorage.getItem("yoco_checkout_id");

    if (!checkoutId || !user) {
      setVerifying(false);
      setVerified(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-yoco-payment", {
          body: { checkoutId },
        });

        if (error) throw error;

        if (data?.completed) {
          setVerified(true);
          clearCart();
          localStorage.removeItem("yoco_checkout_id");
        } else {
          setVerified(false);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <Loader2 className="h-16 w-16 text-brand-orange mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Not Verified</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-brand-orange hover:bg-brand-orange/90"
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. You will receive a confirmation via WhatsApp and SMS shortly.
          </p>
          <Button
            onClick={() => navigate("/orders")}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 mb-2"
          >
            View My Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
