import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  metadata: any;
}

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      // First get the customer record
      const { data: customerData } = await supabase
        .from("customers")
        .select("id")
        .eq("auth_uid", user!.id)
        .single();

      if (customerData) {
        // Then get orders for this customer
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", customerData.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(order.created_at), "PPP")}
                    </p>
                    {order.metadata?.items && (
                      <div className="mt-4 space-y-2">
                        {order.metadata.items.map((item: any, index: number) => (
                          <div key={index} className="text-sm">
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${(order.total_amount / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {order.currency.toUpperCase()}
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
