import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/app/generated/prisma/enums";

const COOKIE_NAME = "mrtechnosoft_session";

function getSessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production.");
  }
  return new TextEncoder().encode(secret ?? "development-only-change-me");
}

type SessionPayload = {
  userId: string;
  role: UserRole;
};

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export const getSession = cache(async () => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: true,
    },
  });
});

export async function requireUser(roles?: UserRole[]) {
  const user = await getCurrentUser();
  if (!user || (roles && !roles.includes(user.role))) {
    redirect(`/login?next=${encodeURIComponent(roleHome(roles?.[0]))}`);
  }
  return user;
}

export function roleHome(role?: UserRole) {
  if (role === "ADMIN") return "/admin";
  if (role === "STUDENT") return "/student";
  if (role === "CLIENT") return "/client";
  return "/";
}
