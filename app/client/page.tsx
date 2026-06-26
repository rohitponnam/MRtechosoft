import type { Metadata } from "next";
import PaymentButton from "@/components/PaymentButton";
import PortalShell from "@/components/PortalShell";
import { requireUser } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Client Portal" };

export default async function ClientPage() {
  const user = await requireUser(["CLIENT"]);
  const [projects, proposals] = await Promise.all([
    prisma.project.findMany({ where: { clientId: user.id }, orderBy: { updatedAt: "desc" } }),
    prisma.proposal.findMany({ where: { clientId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <PortalShell title="Client workspace" role="CLIENT" userName={user.name}>
      <section className="portalSection">
        <div className="portalSectionHeader">
          <div>
            <p className="eyebrow">Delivery visibility</p>
            <h2>Active projects</h2>
          </div>
        </div>
        <div className="portalCardGrid">
          {projects.map((project) => (
            <article className="portalCard" key={project.id}>
              <span className="statusPill active">{project.status}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="progressTrack">
                <span style={{ width: `${project.progress}%` }} />
              </div>
              <small>Next: {project.nextMilestone ?? "Milestone planning"}</small>
            </article>
          ))}
          {!projects.length && (
            <article className="portalEmpty">
              <h3>No active projects yet.</h3>
              <p>Accepted proposals appear here when delivery begins.</p>
            </article>
          )}
        </div>
      </section>
      <section className="portalSection">
        <div className="portalSectionHeader">
          <div>
            <p className="eyebrow">Commercials</p>
            <h2>Proposals & payments</h2>
          </div>
        </div>
        <div className="proposalList wide">
          {proposals.map((proposal) => (
            <article key={proposal.id}>
              <div>
                <span>{proposal.number} · {formatDate(proposal.createdAt)}</span>
                <strong>{proposal.title}</strong>
                <small>
                  {formatCurrency(proposal.amountCents)} · {proposal.status}
                </small>
              </div>
              <div className="proposalActions">
                <a href={`/api/proposals/${proposal.id}/pdf`}>Download PDF</a>
                {proposal.status !== "ACCEPTED" && <PaymentButton proposalId={proposal.id} />}
              </div>
            </article>
          ))}
          {!proposals.length && <p>No proposals assigned to this account yet.</p>}
        </div>
      </section>
    </PortalShell>
  );
}
