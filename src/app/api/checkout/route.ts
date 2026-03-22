import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { auth } from "@/lib/hub/auth";

const bodySchema = z.object({
  price: z.enum(["monthly", "yearly", "mock_interview"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env." },
      { status: 503 },
    );
  }
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid price option" }, { status: 400 });
    }
    const stripe = new Stripe(secret);
    const origin = new URL(req.url).origin;

    if (parsed.data.price === "mock_interview") {
      const priceId = process.env.STRIPE_PRICE_MOCK_INR;
      if (!priceId) {
        return NextResponse.json(
          { error: "Set STRIPE_PRICE_MOCK_INR to a one-time Price ID (INR)." },
          { status: 503 },
        );
      }
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: session.user.email,
        client_reference_id: session.user.id,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/hub/mock-interview?paid=1`,
        cancel_url: `${origin}/hub/mock-interview?canceled=1`,
        metadata: { userId: session.user.id, kind: "mock_interview" },
      });
      return NextResponse.json({ url: checkout.url });
    }

    const priceId =
      parsed.data.price === "monthly"
        ? process.env.STRIPE_PRICE_MONTHLY_INR
        : process.env.STRIPE_PRICE_YEARLY_INR;
    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Set STRIPE_PRICE_MONTHLY_INR and STRIPE_PRICE_YEARLY_INR in Stripe Dashboard (INR recurring prices).",
        },
        { status: 503 },
      );
    }
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/hub/pricing?success=1`,
      cancel_url: `${origin}/hub/pricing?canceled=1`,
      subscription_data: {
        metadata: { userId: session.user.id },
      },
      metadata: { userId: session.user.id, kind: "subscription" },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
