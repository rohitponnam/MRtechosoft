"use client";

import { useState } from "react";

type Estimate = {
  cost: string;
  timeline: string;
  team: string;
  stack: string;
};

export default function AIWidgets() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<Estimate | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function estimate() {
    setError("");
    setResult(null);

    if (idea.trim().length < 10) {
      setError("Add a little more detail so we can produce a useful estimate.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai-estimator", {
        method: "POST",
        body: JSON.stringify({ idea }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to generate an estimate.");
      }
      setResult(data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to generate an estimate.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section darkSection">
      <div className="aiLayout container">
        <header className="sectionHeader">
          <p className="eyebrow">Interactive discovery</p>
          <h2>Pressure-test your product idea in seconds.</h2>
          <p>
            Describe what you want to build. Our estimator returns a realistic
            first-pass delivery range before your discovery call.
          </p>
        </header>
        <div className="aiBox">
          <label htmlFor="project-idea">What are you planning to build?</label>
          <textarea
            id="project-idea"
            value={idea}
            placeholder="Example: A HIPAA-ready marketplace that connects home-care providers with families..."
            onChange={(event) => setIdea(event.target.value)}
          />
          <button
            className="primaryBtn"
            type="button"
            disabled={loading}
            onClick={estimate}
          >
            {loading ? "Analyzing..." : "Generate estimate"}
          </button>
          {error && <p className="statusMessage">{error}</p>}
          {result && (
            <div className="resultBox" aria-live="polite">
              <div>
                <span>Estimated cost</span>
                <b>{result.cost}</b>
              </div>
              <div>
                <span>Timeline</span>
                <b>{result.timeline}</b>
              </div>
              <div>
                <span>Suggested team</span>
                <b>{result.team}</b>
              </div>
              <div>
                <span>Recommended stack</span>
                <b>{result.stack}</b>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
