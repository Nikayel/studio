import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { donationSchema } from "@/lib/validations/donation";
import { SITE_CONFIG } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = donationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid donation data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { profileId, amount, donorName, donorEmail, message } = parsed.data;

    // Verify profile exists and is active
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, profile_id")
      .eq("id", profileId)
      .eq("is_active", true)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to ${profile.display_name}`,
              description: `Direct donation for ${profile.display_name} (#${profile.profile_id}). 100% hand-delivered.`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${SITE_CONFIG.url}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_CONFIG.url}/donate/${profile.profile_id}`,
      metadata: {
        profile_id: profile.id,
        donor_name: donorName || "",
        donor_email: donorEmail || "",
        message: message || "",
      },
      ...(donorEmail ? { customer_email: donorEmail } : {}),
    });

    // Create pending donation record
    await supabaseAdmin.from("donations").insert({
      profile_id: profile.id,
      amount,
      donor_name: donorName || null,
      donor_email: donorEmail || null,
      message: message || null,
      stripe_session_id: session.id,
      status: "pending",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
