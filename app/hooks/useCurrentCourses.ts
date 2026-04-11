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

    fetch(`${BASE}/enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        const data: Enrollment[] = json.data ?? [];
        const sorted = [...data].sort((a, b) => b.progress - a.progress);
        setEnrollments(sorted.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnrollments();
    window.addEventListener("auth-updated", fetchEnrollments);
    return () => window.removeEventListener("auth-updated", fetchEnrollments);
  }, []);

  // Fill to always have 3 slots — null means placeholder
  const slots: (Enrollment | null)[] = isLoggedIn
    ? [...enrollments, ...Array(Math.max(0, 3 - enrollments.length)).fill(null)]
    : [null, null, null];

  return { isLoggedIn, enrollments, loading, slots };
}
