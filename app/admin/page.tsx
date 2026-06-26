import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import PortalShell from "@/components/PortalShell";
import { requireUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const user = await requireUser(["ADMIN"]);
  const [leads, proposals, enrollments, paid] = await Promise.all([
    prisma.lead.findMany({ orderBy: [{ score: "desc" }, { createdAt: "desc" }], take: 50 }),
    prisma.proposal.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.enrollment.count(),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
  ]);

  const qualified = leads.filter((lead) => lead.score >= 60).length;

  return (
    <PortalShell title="Operating dashboard" role="ADMIN" userName={user.name}>
      <section className="metricGrid">
        <article>
          <span>Pipeline leads</span>
          <strong>{leads.length}</strong>
          <small>{qualified} high intent</small>
        </article>
        <article>
          <span>Proposals</span>
          <strong>{proposals.length}</strong>
          <small>{proposals.filter((item) => item.status === "ACCEPTED").length} accepted</small>
        </article>
        <article>
          <span>Enrollments</span>
          <strong>{enrollments}</strong>
          <small>All programs</small>
        </article>
        <article>
          <span>Collected</span>
          <strong>{formatCurrency(paid._sum.amountCents ?? 0)}</strong>
          <small>Recorded payments</small>
        </article>
      </section>
      <AdminDashboard
        leads={leads.map((lead) => ({ ...lead, createdAt: lead.createdAt.toISOString() }))}
        proposals={proposals.map((proposal) => ({
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
        }))}
      />
    </PortalShell>
  );
}
