import "server-only";

type CrmLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string;
  score: number;
  source: string;
};

export async function syncLeadToCrm(lead: CrmLead) {
  if (process.env.CRM_WEBHOOK_URL) {
    const response = await fetch(process.env.CRM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({ event: "lead.created", lead }),
    });
    if (!response.ok) throw new Error(`CRM webhook failed: ${response.status}`);
    const result = (await response.json().catch(() => ({}))) as { id?: string };
    return result.id ?? lead.id;
  }

  if (process.env.HUBSPOT_ACCESS_TOKEN) {
    const [firstName, ...lastName] = lead.name.split(" ");
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email: lead.email,
          firstname: firstName,
          lastname: lastName.join(" "),
          phone: lead.phone ?? "",
          company: lead.company ?? "",
          lifecyclestage: "lead",
          lead_source: lead.source,
        },
      }),
    });
    if (!response.ok) throw new Error(`HubSpot sync failed: ${response.status}`);
    const result = (await response.json()) as { id: string };
    return result.id;
  }

  return null;
}
