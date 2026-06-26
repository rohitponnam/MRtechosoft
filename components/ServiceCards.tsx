const services = [
  {
    title: "Identity & Access Management",
    description:
      "Protect workforce and customer identities with modern IAM, IGA, PAM, SSO, and access governance.",
  },
  {
    title: "Cyber Security Services",
    description:
      "Strengthen security architecture, vulnerability management, incident readiness, and operational resilience.",
  },
  {
    title: "IT Governance, Risk & Compliance",
    description:
      "Translate regulatory and business requirements into measurable controls, evidence, and sustainable governance.",
  },
  {
    title: "Next-Gen Security",
    description:
      "Modernize protection across cloud, applications, data, endpoints, and emerging AI-enabled environments.",
  },
  {
    title: "IT Consulting",
    description:
      "Align technology strategy, architecture, delivery, and talent with business priorities and risk tolerance.",
  },
  {
    title: "Cloud Security",
    description:
      "Design secure cloud foundations, guardrails, posture management, and identity controls across modern platforms.",
  },
  {
    title: "Security Testing",
    description:
      "Identify exploitable weaknesses through structured assessment, remediation planning, and continuous validation.",
  },
  {
    title: "Security Advisory",
    description:
      "Gain experienced leadership for security roadmaps, program maturity, vendor selection, and transformation.",
  },
];

export default function ServiceCards() {
  return (
    <section className="section" id="services">
      <div className="container">
        <header className="sectionHeader">
          <p className="eyebrow">What we build</p>
          <h2>Security capabilities built around real business risk.</h2>
          <p>
            From identity and governance to cloud and next-generation security,
            our consultants connect strategy with practical implementation.
          </p>
        </header>
        <div className="grid">
          {services.map((service, index) => (
            <article className="card" key={service.title}>
              <span className="cardNumber">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
