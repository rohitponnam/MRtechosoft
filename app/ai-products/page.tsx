import type { Metadata } from "next";
import AIWidgets from "@/components/AIWidgets";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "AI Products",
  description: "Applied AI tools for product discovery and business workflows.",
};

export default function AIProductsPage() {
  return (
    <PageShell
      eyebrow="Applied AI"
      title="Useful AI products, grounded in real workflows."
      description="We build focused copilots, automation, retrieval systems, and decision tools that improve throughput without adding operational noise."
    >
      <AIWidgets />
    </PageShell>
  );
}
