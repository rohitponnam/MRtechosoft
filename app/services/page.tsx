import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ServiceCards from "@/components/ServiceCards";

export const metadata: Metadata = {
  title: "Cybersecurity Services",
  description:
    "Identity and access management, cyber security, IT GRC, next-gen security, cloud security, and IT consulting.",
};

export default function ServicesPage() {
  return (
    <PageShell
      eyebrow="Cybersecurity services"
      title="Protect your organization with strategy that leads to action."
      description="MRTechnosoft helps organizations strengthen identity, governance, cloud, applications, infrastructure, and security operations."
    >
      <ServiceCards />
    </PageShell>
  );
}
