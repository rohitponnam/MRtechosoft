import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Portal Login" };

const validRoles = new Set(["admin", "client", "student"]);

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const requested = (await searchParams).role?.toLowerCase() ?? "client";
  const role = validRoles.has(requested) ? requested : "client";
  const typedRole = role.toUpperCase() as "ADMIN" | "CLIENT" | "STUDENT";

  return (
    <main className="authPage">
      <section className="authBrand">
        <Link className="logo" href="/">
          <span className="logoMark">MR</span>
          {company.name}
        </Link>
        <div>
          <p className="eyebrow">One platform</p>
          <h2>Projects, proposals, courses, and progress in one place.</h2>
        </div>
        <nav className="roleTabs">
          {["client", "student", "admin"].map((item) => (
            <Link className={role === item ? "active" : ""} href={`/login?role=${item}`} key={item}>
              {item}
            </Link>
          ))}
        </nav>
      </section>
      <section className="authPanel">
        <AuthForm mode="login" role={typedRole} />
      </section>
    </main>
  );
}
