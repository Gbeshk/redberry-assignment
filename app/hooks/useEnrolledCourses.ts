import { useState, useEffect } from "react";
import { FullEnrollment } from "@/app/types/enrollment";

const BASE = "https://api.redclass.redberryinternship.ge/api";

export function useEnrolledCourses(isOpen: boolean) {
  const [enrollments, setEnrollments] = useState<FullEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    fetch(`${BASE}/enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then(async (json) => {
        const sorted: FullEnrollment[] = (json.data ?? []).sort(
          (a: FullEnrollment, b: FullEnrollment) => b.progress - a.progress,
        );
        await Promise.all(
          sorted.map(async (e) => {
            try {
              const res = await fetch(`${BASE}/courses/${e.course.id}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
              });
              const courseJson = await res.json();
              const course = Array.isArray(courseJson.data) ? courseJson.data[0] : courseJson.data;
              const reviews: { rating: number }[] = course?.reviews ?? [];
              e.course.avgRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
            } catch {}
          })
        );
        setEnrollments(sorted);
      })
      .catch(() => setError("Failed to load enrollments."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  return { enrollments, loading, error };
}