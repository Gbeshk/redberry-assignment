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

const COURSES_PER_PAGE = 9;
const BASE = "https://api.redclass.redberryinternship.ge/api";

interface UseCoursesListParams {
  selectedCategories: number[];
  selectedTopics: number[];
  selectedInstructors: number[];
}

export function useCoursesList({
  selectedCategories,
  selectedTopics,
  selectedInstructors,
}: UseCoursesListParams) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      let page = 1;
      let collected: Course[] = [];
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(`${BASE}/courses?page=${page}`);
        const data = await res.json();
        const items: Course[] = data.data ?? data.courses ?? data;
        collected = [...collected, ...items];
        const total = data.total ?? data.meta?.total ?? 0;
        hasMore = collected.length < total && items.length > 0;
        page++;
      }
      setAllCourses(collected);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedTopics, selectedInstructors]);

  const filteredCourses = allCourses.filter((course) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category.id);
    const topicMatch =
      selectedTopics.length === 0 || selectedTopics.includes(course.topic.id);
    const instructorMatch =
      selectedInstructors.length === 0 ||
      selectedInstructors.includes(course.instructor.id);
    return categoryMatch && topicMatch && instructorMatch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return a.id - b.id;
      case "price_asc":
        return parseFloat(a.basePrice) - parseFloat(b.basePrice);
      case "price_desc":
        return parseFloat(b.basePrice) - parseFloat(a.basePrice);
      case "popular":
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      case "title_az":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const total = sortedCourses.length;
  const totalPages = Math.ceil(total / COURSES_PER_PAGE);
  const start = (currentPage - 1) * COURSES_PER_PAGE;
  const pagedCourses = sortedCourses.slice(start, start + COURSES_PER_PAGE);

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setCurrentPage(1);
  };

  return {
    pagedCourses,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    sortBy,
    handleSortChange,
    loading,
  };
}
