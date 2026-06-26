import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageShell from "@/components/PageShell";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk with ${company.name} about software, AI, or career programs.`,
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Connect with us"
      title="Start a conversation with MRTechnosoft."
      description="Tell us about your security, technology, or talent priorities. Our team will respond with a practical next step."
    >
      <section className="section">
        <div className="contactGrid container">
          <div>
            <header className="sectionHeader">
              <p className="eyebrow">Connect with us</p>
              <h2>Our team is ready to help.</h2>
            </header>
            <div className="contactDetails">
              <div className="contactItem">
                <span>Mail</span>
                <strong>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </strong>
              </div>
              <div className="contactItem">
                <span>Contact</span>
                <strong>
                  <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
                </strong>
              </div>
              <div className="contactItem">
                <span>Location</span>
                <strong>{company.address}</strong>
              </div>
              <div className="contactItem">
                <span>Response time</span>
                <strong>Within one business day</strong>
              </div>
              <div className="contactSocials">
                <span>Follow MRTechnosoft</span>
                <div>
                  {company.social.map((social) => (
                    <a
                      href={social.href}
                      key={social.name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="contactItem">
                <span>Engagements</span>
                <strong>Remote and on-site delivery</strong>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
