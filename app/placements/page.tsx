import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PlacementSection from "@/components/PlacementSection";

export const metadata: Metadata = {
  title: "Placement Support",
  description: "Resume, interview, and job-search support for technology roles.",
};

export default function PlacementsPage() {
  return (
    <PageShell
      eyebrow="Career services"
      title="Turn stronger skills into a stronger job search."
      description="Get a practical system for positioning your experience, demonstrating your ability, and approaching the right opportunities."
    >
      <PlacementSection />
    </PageShell>
  );
}
