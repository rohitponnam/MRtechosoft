import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Login required." }, { status: 401 });
  if (process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Demo payments are disabled." }, { status: 403 });
  }

  const body = (await request.json()) as { paymentId?: string };
  const payment = await prisma.payment.findFirst({
    where: { id: body.paymentId, userId: user.id, provider: "demo" },
  });
  if (!payment) return Response.json({ error: "Payment not found." }, { status: 404 });

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAID" },
    }),
    ...(payment.enrollmentId
      ? [
          prisma.enrollment.update({
            where: { id: payment.enrollmentId },
            data: { status: "ACTIVE" as const },
          }),
        ]
      : []),
    ...(payment.proposalId
      ? [
          prisma.proposal.update({
            where: { id: payment.proposalId },
            data: { status: "ACCEPTED" as const },
          }),
        ]
      : []),
  ]);

  return Response.json({ success: true });
}
