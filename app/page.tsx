import AIWidgets from "@/components/AIWidgets";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LeadPopup from "@/components/LeadPopup";
import Navbar from "@/components/Navbar";
import PlacementSection from "@/components/PlacementSection";
import ServiceCards from "@/components/ServiceCards";
import SecurityConsulting from "@/components/SecurityConsulting";
import TrainingSection from "@/components/TrainingSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServiceCards />
        <SecurityConsulting />
        <AIWidgets />
        <TrainingSection />
        <PlacementSection />
      </main>
      <LeadPopup />
      <Footer />
    </>
  );
}
