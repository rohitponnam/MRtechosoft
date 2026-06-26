import { getCurrentUser } from "@/lib/auth";
import { generateProposalPdf } from "@/lib/proposal-pdf";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Login required." }, { status: 401 });

  const { id } = await params;
  const proposal = await prisma.proposal.findFirst({
    where: user.role === "ADMIN" ? { id } : { id, clientId: user.id },
  });
  if (!proposal) return Response.json({ error: "Proposal not found." }, { status: 404 });

  const bytes = await generateProposalPdf(proposal);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${proposal.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
