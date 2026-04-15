import { useState, useEffect } from "react";

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: string;
  durationWeeks: number;
  isFeatured: boolean;
  avgRating: number | null;
  reviewCount: number;
  category: { id: number; name: string };
  topic: { id: number; name: string };
  instructor: { id: number; name: string; avatar: string };
}

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "title_az";

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest First",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  popular: "Most Popular",
  title_az: "Title: A-Z",
};

const API_SORT: Record<SortOption, string> = {
  newest: "newest",
  price_asc: "price_asc",
  price_desc: "price_desc",
  popular: "popular",
  title_az: "title_asc",
};

const UI_PAGE_SIZE = 9;
const API_PAGE_SIZE = 10;
const BASE = "https://api.redclass.redberryinternship.ge/api";

interface UseCoursesListParams {
  selectedCategories: number[];
  selectedTopics: number[];
  selectedInstructors: number[];
  sortBy: SortOption;
  currentPage: number;
}

export function useCoursesList({
  selectedCategories,
  selectedTopics,
  selectedInstructors,
  sortBy,
  currentPage,
}: UseCoursesListParams) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const firstIdx = (currentPage - 1) * UI_PAGE_SIZE;
    const lastIdx = currentPage * UI_PAGE_SIZE - 1;

    const firstApiPage = Math.floor(firstIdx / API_PAGE_SIZE) + 1;
    const lastApiPage = Math.floor(lastIdx / API_PAGE_SIZE) + 1;

    const buildParams = (apiPage: number) => {
      const p = new URLSearchParams();
      p.set("sort", API_SORT[sortBy]);
      p.set("page", String(apiPage));
      selectedCategories.forEach((id) => p.append("categories[]", String(id)));
      selectedTopics.forEach((id) => p.append("topics[]", String(id)));
      selectedInstructors.forEach((id) => p.append("instructors[]", String(id)));
      return p.toString();
    };

    const pagesToFetch = Array.from(
      { length: lastApiPage - firstApiPage + 1 },
      (_, i) => firstApiPage + i,
    );

    Promise.all(
      pagesToFetch.map((p) =>
        fetch(`${BASE}/courses?${buildParams(p)}`, { signal: controller.signal }).then((r) => r.json()),
      ),
    )
      .then((results) => {
        const apiTotal: number = results[0]?.total ?? results[0]?.meta?.total ?? 0;
        const combined: Course[] = results.flatMap((d) => d.data ?? []);
        const offset = firstIdx - (firstApiPage - 1) * API_PAGE_SIZE;

        setCourses(combined.slice(offset, offset + UI_PAGE_SIZE));
        setTotal(apiTotal);
        setTotalPages(Math.ceil(apiTotal / UI_PAGE_SIZE));
      })
      .catch((err) => { if (err.name !== "AbortError") setCourses([]); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [sortBy, currentPage, selectedCategories, selectedTopics, selectedInstructors]);

  return { pagedCourses: courses, total, totalPages, loading };
}
