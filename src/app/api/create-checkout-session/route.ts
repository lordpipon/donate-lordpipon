import { NextResponse } from "next/server";
import Stripe from "stripe";

// Hosted Stripe Checkout — redirect the donor to a Stripe-hosted payment page.
// Parameters below follow the Checkout Studio configuration. See STRIPE_INTEGRATION_TODO.md.
export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // One-time donation. Set to "subscription" for recurring billing.
  const mode = "payment";

  let amount = 10;
  try {
    const body = await req.json();
    if (typeof body?.amount === "number") amount = body.amount;
  } catch {
    // no/invalid body -> keep default
  }

  // Validate the amount server-side (whole dollars, within bounds).
  if (!Number.isFinite(amount) || amount < 1 || amount > 1000) {
    return NextResponse.json(
      { error: "Amount must be between $1 and $1000." },
      { status: 400 }
    );
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    ui_mode: "hosted_page",
    billing_address_collection: "auto",
    phone_number_collection: { enabled: false },
    automatic_tax: { enabled: false },
    allow_promotion_codes: false,
    submit_type: "auto",
    saved_payment_method_options: { payment_method_save: "enabled" },
    integration_identifier: "hosted_web_0001",
    origin_context: "web",
    mode,
    success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Donation to LordPipon" },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
  };

  const session = await stripe.checkout.sessions.create(params);

  return NextResponse.json({ url: session.url });
}
