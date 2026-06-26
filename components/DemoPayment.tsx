"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DemoPayment({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function complete() {
    setLoading(true);
    const response = await fetch("/api/payments/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });
    if (response.ok) router.push("/payment/success");
    else setLoading(false);
  }

  return (
    <button className="primaryBtn" onClick={complete} disabled={loading}>
      {loading ? "Processing..." : "Complete demo payment"}
    </button>
  );
}
