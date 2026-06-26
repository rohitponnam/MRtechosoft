"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          company: formData.get("company"),
          interest: formData.get("interest"),
          budget: formData.get("budget"),
          timeline: formData.get("timeline"),
          message: formData.get("message"),
          source: "Contact Page",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Submission failed.");
      event.currentTarget.reset();
      setStatus("Thanks — we’ll be in touch within one business day.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contactForm" onSubmit={submit}>
      <input name="name" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Work email" required />
      <input name="phone" placeholder="Phone (optional)" />
      <input name="company" placeholder="Company (optional)" />
      <select name="interest" defaultValue="Software Development">
        <option>Software Development</option>
        <option>IT Consulting</option>
        <option>AI Products</option>
        <option>Training</option>
        <option>Placement Support</option>
      </select>
      <select name="budget" defaultValue="Not sure yet">
        <option>Not sure yet</option>
        <option>Under $25,000</option>
        <option>$25,000 - $75,000</option>
        <option>$75,000 - $150,000</option>
        <option>$150,000+</option>
      </select>
      <select name="timeline" defaultValue="1-3 months">
        <option>Immediate / 30 days</option>
        <option>1-3 months</option>
        <option>This quarter</option>
        <option>Exploring options</option>
      </select>
      <textarea name="message" placeholder="Tell us briefly about your goal" />
      <button className="primaryBtn" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send inquiry"}
      </button>
      {status && <p className="statusMessage">{status}</p>}
    </form>
  );
}
