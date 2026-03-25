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
    const { amountInCents, items } = await req.json();

    if (!amountInCents) throw new Error("No amount provided");
    if (!items || items.length === 0) throw new Error("No items provided");

    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // Create checkout session using Yoco Checkout API v2
    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) throw new Error("Yoco secret key not configured");

    const origin = req.headers.get("origin") || "https://fkayplug.lovable.app";

    const checkoutResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${yocoSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: "ZAR",
        successUrl: `${origin}/payment-success`,
        cancelUrl: `${origin}/cart`,
        failureUrl: `${origin}/cart?payment=failed`,
        metadata: {
          user_id: user.id,
          items: JSON.stringify(items),
        },
      }),
    });

    const checkoutResult = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      console.error("Yoco checkout creation failed:", checkoutResult);
      throw new Error(checkoutResult.message || checkoutResult.displayMessage || "Failed to create checkout");
    }

    console.log("Yoco checkout created:", checkoutResult.id);

    // Get or create customer record
    const { data: existingCustomer } = await supabaseClient
      .from("customers")
      .select("id")
      .eq("auth_uid", user.id)
      .single();

    let customerId = existingCustomer?.id;

    if (!existingCustomer) {
      const { data: newCustomer, error: customerError } = await supabaseClient
        .from("customers")
        .insert({ auth_uid: user.id, email: user.email })
        .select("id")
        .single();

      if (customerError) {
        console.error("Error creating customer:", customerError);
      } else {
        customerId = newCustomer.id;
      }
    }

    // Create pending order record
    if (customerId) {
      const { error: orderError } = await supabaseClient
        .from("orders")
        .insert({
          customer_id: customerId,
          total_amount: amountInCents,
          currency: "zar",
          status: "pending",
          stripe_payment_intent_id: checkoutResult.id,
          metadata: {
            items: items,
            payment_gateway: "yoco",
            yoco_checkout_id: checkoutResult.id,
          },
        });

      if (orderError) {
        console.error("Error creating order:", orderError);
      } else {
        console.log("Pending order created successfully");
      }
    }

    return new Response(JSON.stringify({ 
      redirectUrl: checkoutResult.redirectUrl,
      checkoutId: checkoutResult.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Yoco checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
