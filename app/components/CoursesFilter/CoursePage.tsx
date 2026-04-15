"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CoursesList from "@/app/components/CoursesList/CoursesList";
import ArrowNavigation from "@/app/components/icons/ArrowNavigation";
import CoursesFilterPanel from "@/app/components/CoursesFilter/CoursesFilterPanel";
import { SortOption } from "@/app/hooks/useCoursesList";

function CoursesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.getAll("categories").map(Number).filter(Boolean);
  const selectedTopics = searchParams.getAll("topics").map(Number).filter(Boolean);
  const selectedInstructors = searchParams.getAll("instructors").map(Number).filter(Boolean);
  const sortBy = (searchParams.get("sort") ?? "newest") as SortOption;
  const currentPage = Number(searchParams.get("page") ?? "1");

  const updateURL = (updates: {
    categories?: number[];
    topics?: number[];
    instructors?: number[];
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if ("categories" in updates) {
      params.delete("categories");
      updates.categories!.forEach((id) => params.append("categories", String(id)));
    }
    if ("topics" in updates) {
      params.delete("topics");
      updates.topics!.forEach((id) => params.append("topics", String(id)));
    }
    if ("instructors" in updates) {
      params.delete("instructors");
      updates.instructors!.forEach((id) => params.append("instructors", String(id)));
    }
    if ("sort" in updates) {
      updates.sort !== "newest" ? params.set("sort", updates.sort!) : params.delete("sort");
    }
    if ("page" in updates) {
      updates.page !== 1 ? params.set("page", String(updates.page)) : params.delete("page");
    }

    router.push(`/courses?${params.toString()}`, { scroll: false });
  };

  const toggle = (
    key: "categories" | "topics" | "instructors",
    current: number[],
    id: number,
  ) => {
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    updateURL({ [key]: next, page: 1 });
  };

  const totalActiveFilters =
    selectedCategories.length + selectedTopics.length + selectedInstructors.length;

  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <div className="flex items-center">
        <p
          onClick={() => router.push("/")}
          className="text-[#666666] hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer font-medium text-[18px] leading-[100%] tracking-[0%] h-[22px] flex items-center w-[51px] justify-center"
        >
          Home
        </p>
        <ArrowNavigation />
        <p className="flex items-center ml-[10px] text-[#736BEA] font-medium text-[18px] leading-[100%] tracking-[0%] justify-center w-[64px] h-[24px]">
          Browse
        </p>
      </div>

      <div className="w-full flex justify-between mt-[34px]">
        <CoursesFilterPanel
          selectedCategories={selectedCategories}
          selectedTopics={selectedTopics}
          selectedInstructors={selectedInstructors}
          totalActiveFilters={totalActiveFilters}
          onToggleCategory={(id) => toggle("categories", selectedCategories, id)}
          onToggleTopic={(id) => toggle("topics", selectedTopics, id)}
          onToggleInstructor={(id) => toggle("instructors", selectedInstructors, id)}
          onClearAll={() => updateURL({ categories: [], topics: [], instructors: [], page: 1 })}
        />
        <CoursesList
          selectedCategories={selectedCategories}
          selectedTopics={selectedTopics}
          selectedInstructors={selectedInstructors}
          sortBy={sortBy}
          currentPage={currentPage}
          onSortChange={(sort) => updateURL({ sort, page: 1 })}
          onPageChange={(page) => updateURL({ page })}
        />
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesPageInner />
    </Suspense>
  );
}
