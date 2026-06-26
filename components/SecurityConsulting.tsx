import Image from "next/image";
import Link from "next/link";

const commitments = [
  "Clear priorities tied to business risk",
  "Practical controls your teams can operate",
  "Experienced guidance from strategy through delivery",
];

export default function SecurityConsulting() {
  return (
    <section className="securityFeature">
      <Image
        className="securityFeatureImage"
        src="/media/security-presentation.webp"
        alt="Cybersecurity consultant presenting a security strategy to business leaders"
        fill
        sizes="100vw"
      />
      <div className="securityFeatureShade" />
      <div className="securityFeatureInner container">
        <div className="securityFeatureCard">
          <p className="eyebrow">A trusted security partner</p>
          <h2>Expert guidance. Practical execution. Stronger resilience.</h2>
          <p>
            We work alongside leadership, security, IT, and delivery teams to
            turn complex security requirements into an actionable program.
          </p>
          <ul>
            {commitments.map((commitment) => (
              <li key={commitment}>{commitment}</li>
            ))}
          </ul>
          <Link className="primaryBtn" href="/contact">
            Connect with us
          </Link>
        </div>
      </div>
    </section>
  );
}
