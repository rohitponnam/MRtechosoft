import { getCurrentUser } from "@/lib/auth";
import { ensureCourses } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return Response.json({ error: "Student login required." }, { status: 401 });
  }

  await ensureCourses();
  const body = (await request.json()) as { courseId?: string };
  if (!body.courseId) {
    return Response.json({ error: "Course is required." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: body.courseId } });
  if (!course?.active) {
    return Response.json({ error: "Course is not available." }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: {},
    create: { userId: user.id, courseId: course.id },
  });

  return Response.json({ success: true, enrollmentId: enrollment.id });
}
