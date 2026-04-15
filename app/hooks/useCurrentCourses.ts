import { useState, useEffect } from "react";

export interface Enrollment {
  id: number;
  progress: number;
  course: {
    id: number;
    title: string;
    image: string;
    avgRating: number | null;
    instructor: { id: number; name: string; avatar: string };
  };
}

const BASE = "https://api.redclass.redberryinternship.ge/api";

export function useCurrentCourses() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setLoading(true);

    fetch(`${BASE}/courses/in-progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then(async (json) => {
        const data: Enrollment[] = json.data ?? json ?? [];
        const sorted = [...data].sort((a, b) => b.progress - a.progress).slice(0, 3);
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
                : null;
            } catch {}
          })
        );
        setEnrollments(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEnrollments([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
    window.addEventListener("auth-updated", fetchEnrollments);
    window.addEventListener("auth-updated-logout", handleLogout);
    return () => {
      window.removeEventListener("auth-updated", fetchEnrollments);
      window.removeEventListener("auth-updated-logout", handleLogout);
    };
  }, []);

  const slots: (Enrollment | null)[] = isLoggedIn
    ? [...enrollments, ...Array(Math.max(0, 3 - enrollments.length)).fill(null)]
    : [null, null, null];

  return { isLoggedIn, enrollments, loading, slots };
}
