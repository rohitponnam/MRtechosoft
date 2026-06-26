"use client";

import { useState } from "react";

export default function PaymentButton({ proposalId }: { proposalId: string }) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId }),
    });
    const result = await response.json();
    if (response.ok) window.location.assign(result.checkoutUrl);
    else {
      alert(result.error ?? "Unable to start payment.");
      setLoading(false);
    }
  }

  return (
    <button className="primaryBtn" type="button" onClick={checkout} disabled={loading}>
      {loading ? "Starting..." : "Accept & pay"}
    </button>
  );
}
