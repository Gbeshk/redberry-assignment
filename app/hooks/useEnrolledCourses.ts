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
      .then((json) => {
        const sorted = (json.data ?? []).sort(
          (a: FullEnrollment, b: FullEnrollment) => b.progress - a.progress,
        );
        setEnrollments(sorted);
      })
      .catch(() => setError("Failed to load enrollments."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  return { enrollments, loading, error };
}