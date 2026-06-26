const steps = [
  ["Resume Building", "Position your experience with an ATS-ready, role-specific resume."],
  ["Mock Interviews", "Practice technical, behavioral, and system-design interviews."],
  ["Job Assistance", "Build a focused application, referral, and recruiter outreach plan."],
  ["AI Interview Coach", "Improve clarity, confidence, and structure with instant feedback."],
];

export default function PlacementSection() {
  return (
    <section className="section lightSection">
      <div className="container">
        <header className="sectionHeader">
          <p className="eyebrow">Placement support</p>
          <h2>A structured path from training to opportunity.</h2>
        </header>
        <div className="processGrid">
          {steps.map(([title, description], index) => (
            <article className="processStep" key={title}>
              <strong>{index + 1}</strong>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
