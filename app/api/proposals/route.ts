import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "";
  const clientEmail =
    typeof body.clientEmail === "string" ? body.clientEmail.trim().toLowerCase() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const scope = typeof body.scope === "string" ? body.scope.trim() : "";
  const timeline = typeof body.timeline === "string" ? body.timeline.trim() : "";
  const amount = Number(body.amount);

  if (
    !title ||
    !clientName ||
    !clientEmail.includes("@") ||
    !summary ||
    !scope ||
    !timeline ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return Response.json({ error: "Complete all required proposal fields." }, { status: 400 });
  }

  const client = await prisma.user.findFirst({
    where: { email: clientEmail, role: "CLIENT" },
  });
  const count = await prisma.proposal.count();
  const proposal = await prisma.proposal.create({
    data: {
      number: `NX-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`,
      title: title.slice(0, 160),
      clientName: clientName.slice(0, 120),
      clientEmail,
      company: typeof body.company === "string" ? body.company.slice(0, 160) : null,
      summary: summary.slice(0, 5000),
      scope: scope.slice(0, 10000),
      timeline: timeline.slice(0, 3000),
      amountCents: Math.round(amount * 100),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      leadId: typeof body.leadId === "string" ? body.leadId : null,
      clientId: client?.id,
    },
  });

  if (proposal.leadId) {
    await prisma.lead.update({
      where: { id: proposal.leadId },
      data: { status: "PROPOSAL" },
    });
  }

  return Response.json({ success: true, proposal });
}
