"use client";
import FeaturedCourseCard from "./FeaturedCourseCard";
import { useFeaturedCourses } from "@/app/hooks/useFeaturedCourses";

export default function CoursesSection() {
  const { courses } = useFeaturedCourses();

  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <h1 className="text-[#0A0A0A] font-semibold text-[40px] leading-[40px] tracking-[0px]">
        Start Learning Today
      </h1>
      <p className="text-[#3D3D3D] font-medium text-[18px] leading-[18px] tracking-[0px] mt-[8px]">
        Choose from our most popular courses and begin your journey
      </p>
      <div className="flex items-center justify-between mt-[32px]">
        {courses.slice(0, 3).map((course) => (
          <FeaturedCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
