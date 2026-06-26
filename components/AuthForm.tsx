"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
  role: "ADMIN" | "CLIENT" | "STUDENT";
};

export default function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Authentication failed.");
      router.push(result.redirectTo);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const roleLabel = role.charAt(0) + role.slice(1).toLowerCase();

  return (
    <form className="authForm" onSubmit={submit}>
      <div>
        <p className="eyebrow">{roleLabel} portal</p>
        <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>
        <p>
          {mode === "login"
            ? `Sign in to your ${roleLabel.toLowerCase()} workspace.`
            : `Set up secure access to the ${roleLabel.toLowerCase()} portal.`}
        </p>
      </div>
      {mode === "register" && (
        <>
          <label>
            Full name
            <input name="name" required autoComplete="name" />
          </label>
          {role === "CLIENT" && (
            <label>
              Company
              <input name="company" autoComplete="organization" />
            </label>
          )}
        </>
      )}
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      <button className="primaryBtn" type="submit" disabled={submitting}>
        {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
      {error && <p className="formError">{error}</p>}
      {role !== "ADMIN" && (
        <p className="authSwitch">
          {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
          <Link href={`/${mode === "login" ? "register" : "login"}?role=${role.toLowerCase()}`}>
            {mode === "login" ? "Register" : "Sign in"}
          </Link>
        </p>
      )}
    </form>
  );
}
