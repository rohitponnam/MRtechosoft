import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/lead-scoring";
import { syncLeadToCrm } from "@/lib/crm";

const interests = new Set([
  "Software Development",
  "IT Consulting",
  "AI Products",
  "Training",
  "Placement Support",
]);

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim() : "";
    const phone = typeof input.phone === "string" ? input.phone.trim() : "";
    const company = typeof input.company === "string" ? input.company.trim() : "";
    const message = typeof input.message === "string" ? input.message.trim() : "";
    const budget = typeof input.budget === "string" ? input.budget.trim() : "";
    const timeline = typeof input.timeline === "string" ? input.timeline.trim() : "";
    const interest =
      typeof input.interest === "string" ? input.interest : "Software Development";
    const source = typeof input.source === "string" ? input.source : "Website Popup";

    if (name.length < 2 || !email.includes("@") || !interests.has(interest)) {
      return Response.json(
        { error: "Enter a valid name, email, and area of interest." },
        { status: 400 },
      );
    }

    const scored = scoreLead({
      email,
      phone,
      company,
      interest,
      message,
      budget,
      timeline,
      source,
    });
    const lead = await prisma.lead.create({
      data: {
        name: name.slice(0, 120),
        email: email.slice(0, 254),
        phone: phone ? phone.slice(0, 40) : null,
        company: company ? company.slice(0, 160) : null,
        interest,
        source: source.slice(0, 80),
        message: message ? message.slice(0, 4000) : null,
        budget: budget ? budget.slice(0, 80) : null,
        timeline: timeline ? timeline.slice(0, 80) : null,
        score: scored.score,
        scoreReason: scored.reason,
      },
    });

    try {
      const crmId = await syncLeadToCrm(lead);
      if (crmId) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { crmId, crmSyncedAt: new Date() },
        });
      }
    } catch (crmError) {
      console.error("CRM sync failed", crmError);
    }

    return Response.json({
      success: true,
      lead: { id: lead.id, score: lead.score },
    });
  } catch (error) {
    console.error("Lead submission failed", error);
    return Response.json(
      { error: "We could not save your inquiry. Please try again." },
      { status: 500 },
    );
  }
}
