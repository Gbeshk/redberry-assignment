import { useState, useEffect } from "react";
import { CourseBase } from "@/app/types/course";

const BASE = "https://api.redclass.redberryinternship.ge/api";

export function useFeaturedCourses() {
  const [courses, setCourses] = useState<CourseBase[]>([]);

  useEffect(() => {
    fetch(`${BASE}/courses/featured`)
      .then((res) => res.json())
      .then((data) => setCourses(data.data ?? []))
      .catch((err) => console.error("Error fetching featured courses:", err));
  }, []);

  return { courses };
}
