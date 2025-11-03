import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    console.log("Authenticated user:", user.id);

    // Create Stripe session
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "zar",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["ZA"],
      },
      metadata: {
        items: JSON.stringify(items),
        user_id: user.id,
      },
      customer_email: user.email,
    });

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
        .insert({
          auth_uid: user.id,
          email: user.email,
        })
        .select("id")
        .single();

      if (customerError) {
        console.error("Error creating customer:", customerError);
      } else {
        customerId = newCustomer.id;
      }
    }

    // Create order record
    if (customerId) {
      const { error: orderError } = await supabaseClient
        .from("orders")
        .insert({
          customer_id: customerId,
          total_amount: totalAmount,
          currency: "zar",
          status: "pending",
          stripe_payment_intent_id: session.payment_intent as string,
          metadata: {
            items: items,
            stripe_session_id: session.id,
          },
        });

      if (orderError) {
        console.error("Error creating order:", orderError);
      } else {
        console.log("Order created successfully");
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
