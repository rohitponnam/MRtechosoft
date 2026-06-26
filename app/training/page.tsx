import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import TrainingSection from "@/components/TrainingSection";

export const metadata: Metadata = {
  title: "Technology Training",
  description: "Project-based technology training and career coaching.",
};

export default function TrainingPage() {
  return (
    <PageShell
      eyebrow="Technology training"
      title="Build the skills that modern engineering teams need."
      description="Instructor-led programs combine core concepts, production-style projects, mentorship, and interview preparation."
    >
      <TrainingSection />
    </PageShell>
  );
}
