import Image from "next/image";
import Link from "next/link";

const discoveryItems = [
  "Identity & access management",
  "Cybersecurity architecture",
  "Governance, risk & compliance",
  "Next-generation security",
];

export default function Hero() {
  return (
    <section className="hero">
      <Image
        className="heroBackgroundImage"
        src="/media/consultants-walking.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <video
        className="heroVideo"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/consultants-walking.webp"
        aria-hidden="true"
      >
        <source src="/media/consultants-walking.mp4" type="video/mp4" />
      </video>
      <div className="heroMediaOverlay" />
      <div className="heroInner container">
        <div>
          <p className="eyebrow">Trusted cybersecurity consulting</p>
          <h1>
            Secure what matters.{" "}
            <span className="heroHighlight">Move forward with confidence.</span>
          </h1>
          <p className="heroText">
            MRTechnosoft helps organizations protect identities, applications,
            infrastructure, and business operations with practical security
            strategy and experienced technical delivery.
          </p>
          <div className="heroActions">
            <Link className="primaryBtn" href="/contact">
              Talk to a security expert
            </Link>
            <Link className="secondaryBtn" href="/services">
              Explore capabilities
            </Link>
          </div>
          <div className="stats" aria-label="Consulting approach">
            <div>
              <b>Identity-first</b>
              <span>Access and privilege protection</span>
            </div>
            <div>
              <b>Risk-led</b>
              <span>Controls aligned to exposure</span>
            </div>
            <div>
              <b>Business-aligned</b>
              <span>Security that enables growth</span>
            </div>
          </div>
        </div>
        <aside className="heroCard">
          <span className="cardLabel">Security capabilities</span>
          <h2>Build a defensible security program.</h2>
          <p>
            Connect strategy, governance, technology, and operations through
            one accountable consulting partner.
          </p>
          <ul className="featureList">
            {discoveryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
