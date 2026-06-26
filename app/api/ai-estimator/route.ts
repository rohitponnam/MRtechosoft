const estimate = {
  cost: "$45,000 – $120,000",
  timeline: "10–20 weeks",
  team: "Product lead, designer, 3–5 engineers, QA",
  stack: "Next.js, TypeScript, PostgreSQL, AWS, applied AI",
  risks: [
    "Unclear integration requirements",
    "Security and compliance constraints",
    "Third-party API dependencies",
    "Scope expansion during delivery",
  ],
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const idea =
      typeof body === "object" && body !== null && "idea" in body
        ? (body as { idea?: unknown }).idea
        : undefined;

    if (typeof idea !== "string" || idea.trim().length < 10) {
      return Response.json(
        { error: "Describe the project in at least 10 characters." },
        { status: 400 },
      );
    }

    return Response.json(estimate);
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
}
