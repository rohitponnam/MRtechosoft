export const defaultCourses = [
  {
    slug: "java-full-stack",
    title: "Java Full Stack Development",
    description: "Production Java, Spring Boot, React, databases, and deployment.",
    duration: "16 weeks",
    priceCents: 249900,
  },
  {
    slug: "react-nextjs",
    title: "React & Next.js Engineering",
    description: "Modern React, Next.js, TypeScript, testing, and cloud delivery.",
    duration: "12 weeks",
    priceCents: 189900,
  },
  {
    slug: "ai-engineering",
    title: "Applied AI Engineering",
    description: "LLM applications, retrieval, agents, evaluation, and production safety.",
    duration: "14 weeks",
    priceCents: 279900,
  },
];

export async function ensureCourses() {
  const { prisma } = await import("@/lib/prisma");
  await Promise.all(
    defaultCourses.map((course) =>
      prisma.course.upsert({
        where: { slug: course.slug },
        update: course,
        create: course,
      }),
    ),
  );
}
