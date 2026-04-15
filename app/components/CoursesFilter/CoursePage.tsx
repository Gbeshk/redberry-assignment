"use client";
import { useRouter } from "next/navigation";
import CoursesList from "@/app/components/CoursesList/CoursesList";
import ArrowNavigation from "@/app/components/icons/ArrowNavigation";
import CoursesFilterPanel from "@/app/components/CoursesFilter/CoursesFilterPanel";
import { useFilters } from "@/app/hooks/useFilters";

export default function CoursesPage() {
  const router = useRouter();
  const {
    selectedCategories,
    selectedTopics,
    selectedInstructors,
    toggleCategory,
    toggleTopic,
    toggleInstructor,
    clearAllFilters,
    totalActiveFilters,
  } = useFilters();

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
          onToggleCategory={toggleCategory}
          onToggleTopic={toggleTopic}
          onToggleInstructor={toggleInstructor}
          onClearAll={clearAllFilters}
        />
        <CoursesList
          selectedCategories={selectedCategories}
          selectedTopics={selectedTopics}
          selectedInstructors={selectedInstructors}
        />
      </div>
    </div>
  );
}
