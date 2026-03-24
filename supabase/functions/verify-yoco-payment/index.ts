import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { checkoutId } = await req.json();

    if (!checkoutId) throw new Error("No checkout ID provided");

    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // Verify checkout status with Yoco API
    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) throw new Error("Yoco secret key not configured");

    const checkoutResponse = await fetch(`https://payments.yoco.com/api/checkouts/${checkoutId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${yocoSecretKey}`,
      },
    });

    const checkoutResult = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      console.error("Yoco checkout verification failed:", checkoutResult);
      throw new Error("Failed to verify payment");
    }

    console.log("Checkout status:", checkoutResult.status);

    const isCompleted = checkoutResult.status === "completed";

    if (isCompleted) {
      // Update order status to completed using service role for the update
      const serviceClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { error: updateError } = await serviceClient
        .from("orders")
        .update({ status: "completed" })
        .eq("stripe_payment_intent_id", checkoutId);

      if (updateError) {
        console.error("Error updating order status:", updateError);
      } else {
        console.log("Order marked as completed");
      }

      // Send email notification
      try {
        const metadata = checkoutResult.metadata || {};
        const items = metadata.items ? JSON.parse(metadata.items) : [];
        
        await supabaseClient.functions.invoke("send-order-email", {
          body: {
            customerEmail: user.email,
            items: items,
            totalAmount: checkoutResult.amount / 100,
          },
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    }

    return new Response(JSON.stringify({ 
      status: checkoutResult.status,
      completed: isCompleted,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
