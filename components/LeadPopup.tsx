"use client";

import { FormEvent, useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  interest: "Software Development",
};

export default function LeadPopup() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("leadPopupShown")) return;

    const timer = window.setTimeout(() => {
      setShow(true);
      localStorage.setItem("leadPopupShown", "true");
    }, 8000);

    return () => window.clearTimeout(timer);
  }, []);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "We could not submit your details.");
      }

      setForm(emptyForm);
      setShow(false);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not submit your details.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!show) return null;

  return (
    <div className="popupOverlay" role="presentation">
      <form className="popup" onSubmit={submitLead}>
        <button
          type="button"
          className="closeBtn"
          aria-label="Close"
          onClick={() => setShow(false)}
        >
          ×
        </button>
        <h2>Let&apos;s build your next move.</h2>
        <p>Share the goal. We&apos;ll follow up with a practical next step.</p>
        <input
          aria-label="Full name"
          placeholder="Full name"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          aria-label="Email"
          placeholder="Work email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          aria-label="Phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <select
          aria-label="Area of interest"
          value={form.interest}
          onChange={(event) => setForm({ ...form, interest: event.target.value })}
        >
          <option>Software Development</option>
          <option>IT Consulting</option>
          <option>AI Products</option>
          <option>Training</option>
          <option>Placement Support</option>
        </select>
        <button className="primaryBtn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit details"}
        </button>
        {error && <p className="statusMessage">{error}</p>}
      </form>
    </div>
  );
}
