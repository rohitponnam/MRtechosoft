import DemoPayment from "@/components/DemoPayment";
import PortalShell from "@/components/PortalShell";
import { requireUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DemoPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const user = await requireUser();
  const paymentId = (await searchParams).payment;
  if (!paymentId) notFound();

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId: user.id, provider: "demo" },
  });
  if (!payment) notFound();

  return (
    <PortalShell title="Demo checkout" role={user.role} userName={user.name}>
      <section className="checkoutCard">
        <span className="statusPill pending">Development mode</span>
        <h2>{formatCurrency(payment.amountCents)}</h2>
        <p>
          Stripe credentials are not configured, so this screen simulates a
          successful payment without collecting card information.
        </p>
        <DemoPayment paymentId={payment.id} />
      </section>
    </PortalShell>
  );
}
