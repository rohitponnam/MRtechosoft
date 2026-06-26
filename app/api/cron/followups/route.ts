import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requiredConfig = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
  ] as const;

  if (requiredConfig.some((key) => !process.env[key])) {
    return Response.json(
      { error: "SMTP configuration is incomplete." },
      { status: 503 },
    );
  }

  const leads = await prisma.lead.findMany({
    where: { status: "NEW", followupCount: { lt: 4 } },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let processed = 0;
  for (const lead of leads) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: lead.email,
      subject: "Following up on your technology inquiry",
      text: `Hi ${lead.name},\n\nThank you for your interest in ${lead.interest}. Reply to this email to schedule a free consultation.\n\nMRTechnosoft`,
    });
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        followupCount: { increment: 1 },
        lastContacted: new Date(),
      },
    });
    processed += 1;
  }

  return Response.json({ success: true, processed });
}
