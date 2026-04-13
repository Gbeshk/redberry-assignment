"use client";
import CourseCard from "./CourseCard";
import SortDropdown from "./SortDropdown";
import Pagination from "./Pagination";
import { useCoursesList } from "@/app/hooks/useCoursesList";
import Spinner from "@/app/components/ui/Spinner";

interface CoursesListProps {
  selectedCategories: number[];
  selectedTopics: number[];
  selectedInstructors: number[];
}

export default function CoursesList({
  selectedCategories,
  selectedTopics,
  selectedInstructors,
}: CoursesListProps) {
  const {
    pagedCourses,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    sortBy,
    handleSortChange,
    loading,
  } = useCoursesList({
    selectedCategories,
    selectedTopics,
    selectedInstructors,
  });

  return (
    <div className="w-[1167px]">
      <div className="w-full flex h-[49px] items-center justify-between">
        <p className="h-[24px] flex items-center justify-center text-[#666666] font-medium text-[16px] leading-[24px]">
          Showing {Math.min(currentPage * 9, total)} out of {total}
        </p>
        <SortDropdown sortBy={sortBy} onChange={handleSortChange} />
      </div>

      <div className="w-full mt-[32px] flex flex-wrap gap-[24px] min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <Spinner size={48} />
          </div>
        ) : (
          pagedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
