import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }
  const stripe = new Stripe(key);
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      const kind = session.metadata?.kind;
      if (userId && kind === "subscription") {
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionTier: "premium" },
        });
      }
      if (userId && kind === "mock_interview") {
        await prisma.mockInterviewBooking.create({
          data: {
            userId,
            stripeSessionId: session.id,
            status: "paid",
            amountInr: 2499,
          },
        });
      }
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
