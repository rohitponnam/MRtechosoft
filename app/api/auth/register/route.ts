import { createSession, roleHome } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/app/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = body.role === "CLIENT" ? "CLIENT" : "STUDENT";
    const company = typeof body.company === "string" ? body.company.trim() : "";

    if (name.length < 2 || !email.includes("@") || password.length < 8) {
      return Response.json(
        { error: "Use a valid name, email, and password of at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "An account already exists for this email." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: name.slice(0, 120),
        email,
        passwordHash: await hashPassword(password),
        role: role as UserRole,
        company: company ? company.slice(0, 160) : null,
      },
    });

    if (user.role === "CLIENT") {
      await prisma.proposal.updateMany({
        where: { clientEmail: email, clientId: null },
        data: { clientId: user.id },
      });
    }

    await createSession({ userId: user.id, role: user.role });
    return Response.json({ success: true, redirectTo: roleHome(user.role) });
  } catch (error) {
    console.error("Registration failed", error);
    return Response.json({ error: "Unable to create account." }, { status: 500 });
  }
}
