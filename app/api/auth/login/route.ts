import { createSession, roleHome } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/app/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const requestedRole =
      typeof body.role === "string" ? (body.role.toUpperCase() as UserRole) : undefined;

    if (!email || password.length < 8) {
      return Response.json({ error: "Enter a valid email and password." }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (
      !user &&
      email === process.env.ADMIN_EMAIL?.toLowerCase() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      user = await prisma.user.create({
        data: {
          name: process.env.ADMIN_NAME ?? "Platform Admin",
          email,
          passwordHash: await hashPassword(password),
          role: "ADMIN",
        },
      });
    }

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (requestedRole && user.role !== requestedRole) {
      return Response.json(
        { error: `This account is registered as ${user.role.toLowerCase()}.` },
        { status: 403 },
      );
    }

    await createSession({ userId: user.id, role: user.role });
    return Response.json({ success: true, redirectTo: roleHome(user.role) });
  } catch (error) {
    console.error("Login failed", error);
    return Response.json({ error: "Unable to log in." }, { status: 500 });
  }
}
