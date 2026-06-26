import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Create Portal Account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const role = (await searchParams).role === "client" ? "CLIENT" : "STUDENT";

  return (
    <main className="authPage">
      <section className="authBrand">
        <Link className="logo" href="/">
          <span className="logoMark">MR</span>
          {company.name}
        </Link>
        <div>
          <p className="eyebrow">Secure portal access</p>
          <h2>
            {role === "CLIENT"
              ? "Keep delivery, proposals, and payments visible."
              : "Manage enrollment, tuition, and course progress."}
          </h2>
        </div>
        <nav className="roleTabs">
          <Link className={role === "CLIENT" ? "active" : ""} href="/register?role=client">
            client
          </Link>
          <Link className={role === "STUDENT" ? "active" : ""} href="/register?role=student">
            student
          </Link>
        </nav>
      </section>
      <section className="authPanel">
        <AuthForm mode="register" role={role} />
      </section>
    </main>
  );
}
