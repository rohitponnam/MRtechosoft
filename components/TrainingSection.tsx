const trainings = [
  "Java Full Stack",
  "React & Next.js",
  "Cloud Engineering",
  "DevOps & Kubernetes",
  "AI Engineering",
  "QA Automation",
];

export default function TrainingSection() {
  return (
    <section className="section">
      <div className="container">
        <header className="sectionHeader">
          <p className="eyebrow">Career advancement</p>
          <h2>Training built around the work companies actually hire for.</h2>
          <p>
            Live projects, practical mentorship, interview preparation, and
            structured feedback for working professionals.
          </p>
        </header>
        <div className="grid">
          {trainings.map((training, index) => (
            <article className="card" key={training}>
              <span className="cardNumber">TRACK {index + 1}</span>
              <h3>{training}</h3>
              <p>
                Project-based learning, resume guidance, and individual
                technical coaching.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
