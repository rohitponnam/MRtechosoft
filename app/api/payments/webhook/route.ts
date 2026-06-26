import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    if (paymentId) {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "PAID", providerSessionId: session.id },
      });
      if (payment.enrollmentId) {
        await prisma.enrollment.update({
          where: { id: payment.enrollmentId },
          data: { status: "ACTIVE" },
        });
      }
      if (payment.proposalId) {
        await prisma.proposal.update({
          where: { id: payment.proposalId },
          data: { status: "ACCEPTED" },
        });
      }
    }
  }

  return Response.json({ received: true });
}
