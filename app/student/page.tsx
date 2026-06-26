import type { Metadata } from "next";
import EnrollmentCards from "@/components/EnrollmentCards";
import PortalShell from "@/components/PortalShell";
import { requireUser } from "@/lib/auth";
import { ensureCourses } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Student Portal" };

export default async function StudentPage() {
  const user = await requireUser(["STUDENT"]);
  await ensureCourses();
  const courses = await prisma.course.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
    include: { enrollments: { where: { userId: user.id }, take: 1 } },
  });

  return (
    <PortalShell title="Learning dashboard" role="STUDENT" userName={user.name}>
      <section className="portalSection">
        <div className="portalSectionHeader">
          <div>
            <p className="eyebrow">Course enrollment</p>
            <h2>Choose your next technical track.</h2>
          </div>
        </div>
        <EnrollmentCards
          courses={courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            duration: course.duration,
            priceCents: course.priceCents,
            enrollment: course.enrollments[0]
              ? {
                  id: course.enrollments[0].id,
                  status: course.enrollments[0].status,
                  progress: course.enrollments[0].progress,
                }
              : undefined,
          }))}
        />
      </section>
    </PortalShell>
  );
}
