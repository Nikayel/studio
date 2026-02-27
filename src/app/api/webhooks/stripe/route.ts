import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Update donation status
    const { error } = await supabaseAdmin
      .from("donations")
      .update({
        status: "completed",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("stripe_session_id", session.id);

    if (error) {
      console.error("Failed to update donation:", error);
    }

    // Update profile's amount_raised
    if (session.metadata?.profile_id && session.amount_total) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("amount_raised")
        .eq("id", session.metadata.profile_id)
        .single();

      if (profile) {
        await supabaseAdmin
          .from("profiles")
          .update({
            amount_raised: profile.amount_raised + session.amount_total,
          })
          .eq("id", session.metadata.profile_id);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;

    await supabaseAdmin
      .from("donations")
      .update({ status: "failed" })
      .eq("stripe_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}
