"use client";
import CourseCard from "./CourseCard";
import SortDropdown from "./SortDropdown";
import Pagination from "./Pagination";
import CourseCardSkeleton from "./CourseCardSkeleton";
import { useCoursesList, SortOption } from "@/app/hooks/useCoursesList";

interface CoursesListProps {
  selectedCategories: number[];
  selectedTopics: number[];
  selectedInstructors: number[];
  sortBy: SortOption;
  currentPage: number;
  onSortChange: (sort: SortOption) => void;
  onPageChange: (page: number) => void;
}

export default function CoursesList({
  selectedCategories,
  selectedTopics,
  selectedInstructors,
  sortBy,
  currentPage,
  onSortChange,
  onPageChange,
}: CoursesListProps) {
  const { pagedCourses, total, totalPages, loading } = useCoursesList({
    selectedCategories,
    selectedTopics,
    selectedInstructors,
    sortBy,
    currentPage,
  });

  return (
    <div className="w-[1167px]">
      <div className="w-full flex h-[49px] items-center justify-between">
        <p className="h-[24px] flex items-center justify-center text-[#666666] font-medium text-[16px] leading-[24px]">
          {total > 0 && `Showing ${Math.min(currentPage * 9, total)} out of ${total}`}
        </p>
        <SortDropdown sortBy={sortBy} onChange={onSortChange} />
      </div>

      <div className="w-full mt-[32px] flex flex-wrap gap-[24px] min-h-[400px]">
        {loading ? (
          Array.from({ length: 9 }).map((_, i) => <CourseCardSkeleton key={i} />)
        ) : pagedCourses.length === 0 ? (
          <div className="w-full flex items-center justify-center min-h-[400px]">
            <p className="text-[#666666] font-medium text-[16px] leading-[24px]">No courses found</p>
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
        onPageChange={onPageChange}
      />
    </div>
  );
}
