"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";

type Course = {
  id: string;
  title: string;
  description: string;
  duration: string;
  priceCents: number;
  enrollment?: { id: string; status: string; progress: number };
};

export default function EnrollmentCards({ courses }: { courses: Course[] }) {
  const [working, setWorking] = useState<string>();
  const [error, setError] = useState("");

  async function enroll(course: Course) {
    setWorking(course.id);
    setError("");
    try {
      let enrollmentId = course.enrollment?.id;
      if (!enrollmentId) {
        const enrollmentResponse = await fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course.id }),
        });
        const enrollment = await enrollmentResponse.json();
        if (!enrollmentResponse.ok) throw new Error(enrollment.error);
        enrollmentId = enrollment.enrollmentId;
      }
      const paymentResponse = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId }),
      });
      const payment = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(payment.error);
      window.location.assign(payment.checkoutUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start enrollment.");
      setWorking(undefined);
    }
  }

  return (
    <>
      {error && <p className="portalAlert">{error}</p>}
      <div className="portalCardGrid">
        {courses.map((course) => (
          <article className="portalCard" key={course.id}>
            <span className={`statusPill ${course.enrollment?.status.toLowerCase() ?? "available"}`}>
              {course.enrollment?.status ?? "Available"}
            </span>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <dl>
              <div>
                <dt>Duration</dt>
                <dd>{course.duration}</dd>
              </div>
              <div>
                <dt>Tuition</dt>
                <dd>{formatCurrency(course.priceCents)}</dd>
              </div>
            </dl>
            {course.enrollment?.status === "ACTIVE" ? (
              <div className="progressTrack">
                <span style={{ width: `${course.enrollment.progress}%` }} />
              </div>
            ) : (
              <button
                className="primaryBtn"
                type="button"
                onClick={() => enroll(course)}
                disabled={working === course.id}
              >
                {working === course.id
                  ? "Starting..."
                  : course.enrollment
                    ? "Complete payment"
                    : "Enroll now"}
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
