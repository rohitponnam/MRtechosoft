import { getCurrentUser } from "@/lib/auth";
import { syncLeadToCrm } from "@/lib/crm";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json()) as { status?: string; syncCrm?: boolean };
  const statuses = new Set(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]);
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return Response.json({ error: "Lead not found." }, { status: 404 });

  if (body.syncCrm) {
    const crmId = await syncLeadToCrm(lead);
    if (!crmId) {
      return Response.json({ error: "CRM integration is not configured." }, { status: 503 });
    }
    await prisma.lead.update({
      where: { id },
      data: { crmId, crmSyncedAt: new Date() },
    });
  }

  if (body.status && statuses.has(body.status)) {
    await prisma.lead.update({
      where: { id },
      data: { status: body.status as never },
    });
  }

  return Response.json({ success: true });
}
