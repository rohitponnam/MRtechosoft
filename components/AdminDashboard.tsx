"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/format";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  interest: string;
  status: string;
  score: number;
  scoreReason: string | null;
  crmId: string | null;
  createdAt: string;
};

type Proposal = {
  id: string;
  number: string;
  title: string;
  clientName: string;
  amountCents: number;
  status: string;
  createdAt: string;
};

export default function AdminDashboard({
  leads,
  proposals,
}: {
  leads: Lead[];
  proposals: Proposal[];
}) {
  const router = useRouter();
  const [working, setWorking] = useState("");
  const [proposalStatus, setProposalStatus] = useState("");

  async function updateLead(id: string, body: object) {
    setWorking(id);
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) alert(result.error ?? "Update failed.");
    setWorking("");
    router.refresh();
  }

  async function createProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProposalStatus("Creating proposal...");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      setProposalStatus(result.error ?? "Proposal creation failed.");
      return;
    }
    form.reset();
    setProposalStatus(`Created ${result.proposal.number}.`);
    router.refresh();
  }

  return (
    <>
      <section className="portalSection" id="leads">
        <div className="portalSectionHeader">
          <div>
            <p className="eyebrow">CRM pipeline</p>
            <h2>Prioritized leads</h2>
          </div>
          <span>{leads.length} recent leads</span>
        </div>
        <div className="dataTableWrap">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Interest</th>
                <th>Score</th>
                <th>Status</th>
                <th>CRM</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <span>{lead.company ?? lead.email}</span>
                    <small>{formatDate(lead.createdAt)}</small>
                  </td>
                  <td>{lead.interest}</td>
                  <td>
                    <span className={`scoreBadge score${Math.floor(lead.score / 25)}`}>
                      {lead.score}
                    </span>
                    <small title={lead.scoreReason ?? ""}>AI score</small>
                  </td>
                  <td>
                    <select
                      value={lead.status}
                      disabled={working === lead.id}
                      onChange={(event) =>
                        updateLead(lead.id, { status: event.target.value })
                      }
                    >
                      {["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"].map(
                        (status) => (
                          <option key={status}>{status}</option>
                        ),
                      )}
                    </select>
                  </td>
                  <td>
                    {lead.crmId ? (
                      <span className="statusPill active">Synced</span>
                    ) : (
                      <button
                        type="button"
                        className="tableAction"
                        disabled={working === lead.id}
                        onClick={() => updateLead(lead.id, { syncCrm: true })}
                      >
                        Sync
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!leads.length && (
                <tr>
                  <td colSpan={5}>No leads yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="portalSection proposalWorkspace" id="proposals">
        <div>
          <div className="portalSectionHeader">
            <div>
              <p className="eyebrow">Proposal generator</p>
              <h2>Create a client-ready PDF</h2>
            </div>
          </div>
          <form className="proposalForm" onSubmit={createProposal}>
            <input name="title" placeholder="Proposal title" required />
            <div className="formRow">
              <input name="clientName" placeholder="Client name" required />
              <input name="clientEmail" type="email" placeholder="Client email" required />
            </div>
            <div className="formRow">
              <input name="company" placeholder="Company" />
              <input name="amount" type="number" min="1" placeholder="Investment (USD)" required />
            </div>
            <textarea name="summary" placeholder="Executive summary" required />
            <textarea name="scope" placeholder="Scope of work" required />
            <textarea name="timeline" placeholder="Timeline and milestones" required />
            <button className="primaryBtn" type="submit">
              Generate proposal
            </button>
            {proposalStatus && <p className="formNote">{proposalStatus}</p>}
          </form>
        </div>
        <div className="proposalList">
          <h3>Recent proposals</h3>
          {proposals.map((proposal) => (
            <article key={proposal.id}>
              <div>
                <span>{proposal.number}</span>
                <strong>{proposal.title}</strong>
                <small>
                  {proposal.clientName} · {formatCurrency(proposal.amountCents)}
                </small>
              </div>
              <a href={`/api/proposals/${proposal.id}/pdf`}>PDF ↓</a>
            </article>
          ))}
          {!proposals.length && <p>No proposals generated yet.</p>}
        </div>
      </section>
    </>
  );
}
