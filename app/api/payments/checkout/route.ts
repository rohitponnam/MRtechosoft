import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Login required." }, { status: 401 });

  const body = (await request.json()) as {
    enrollmentId?: string;
    proposalId?: string;
  };

  const enrollment = body.enrollmentId
    ? await prisma.enrollment.findFirst({
        where: { id: body.enrollmentId, userId: user.id },
        include: { course: true },
      })
    : null;
  const proposal = body.proposalId
    ? await prisma.proposal.findFirst({
        where:
          user.role === "ADMIN"
            ? { id: body.proposalId }
            : { id: body.proposalId, clientId: user.id },
      })
    : null;

  const amountCents = enrollment?.course.priceCents ?? proposal?.amountCents;
  const label = enrollment?.course.title ?? proposal?.title;
  if (!amountCents || !label) {
    return Response.json({ error: "Payment item not found." }, { status: 404 });
  }

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      enrollmentId: enrollment?.id,
      proposalId: proposal?.id,
      amountCents,
      provider: process.env.STRIPE_SECRET_KEY ? "stripe" : "demo",
    },
  });

  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({
      checkoutUrl: `/payment/demo?payment=${payment.id}`,
      demo: true,
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: { name: label },
        },
      },
    ],
    metadata: { paymentId: payment.id },
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${user.role === "STUDENT" ? "student" : "client"}?payment=cancelled`,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { providerSessionId: session.id },
  });

  return Response.json({ checkoutUrl: session.url });
}
