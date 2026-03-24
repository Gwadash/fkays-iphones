import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { token, amountInCents, items } = await req.json();

    if (!token) throw new Error("No payment token provided");
    if (!amountInCents) throw new Error("No amount provided");

    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // Charge using Yoco API
    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) throw new Error("Yoco secret key not configured");

    const chargeResponse = await fetch("https://online.yoco.com/v1/charges/", {
      method: "POST",
      headers: {
        "X-Auth-Secret-Key": yocoSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        amountInCents: amountInCents,
        currency: "ZAR",
      }),
    });

    const chargeResult = await chargeResponse.json();

    if (!chargeResponse.ok || chargeResult.errorType) {
      throw new Error(chargeResult.displayMessage || "Payment failed");
    }

    console.log("Yoco charge successful:", chargeResult.id);

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

    // Create order record
    if (customerId) {
      const { error: orderError } = await supabaseClient
        .from("orders")
        .insert({
          customer_id: customerId,
          total_amount: amountInCents,
          currency: "zar",
          status: "completed",
          stripe_payment_intent_id: chargeResult.id, // reusing field for yoco charge id
          metadata: {
            items: items,
            payment_gateway: "yoco",
            yoco_charge_id: chargeResult.id,
          },
        });

      if (orderError) {
        console.error("Error creating order:", orderError);
      } else {
        console.log("Order created successfully");
      }
    }

    // Send email notification
    try {
      const itemsList = items.map((i: any) => `${i.name} x${i.quantity}`).join(", ");
      await supabaseClient.functions.invoke("send-order-email", {
        body: {
          customerEmail: user.email,
          items: items,
          totalAmount: amountInCents / 100,
        },
      });
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    return new Response(JSON.stringify({ success: true, chargeId: chargeResult.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Yoco charge error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
