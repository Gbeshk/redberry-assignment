"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Topic = {
  id: number;
  name: string;
};

type Instructor = {
  id: number;
  name: string;
  avatar: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: string;
  durationWeeks: number;
  isFeatured: boolean;
  avgRating: number | null;
  reviewCount: number;
  category: Category;
  topic: Topic;
  instructor: Instructor;
};

type ApiResponse = {
  data: Course[];
};

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="w-[506px] h-[576px] bg-white rounded-[12px] p-[20px] flex flex-col">
      <Image
        src={course.image}
        alt={course.title}
        className="w-[466px] h-[262px] object-cover rounded-[10px]"
        width={466}
        height={262}
      />
      <div className="flex items-center mt-[18px] justify-between">
        <div className="flex items-center">
          <p className="text-[#8A8A8A] font-medium text-[14px] leading-none tracking-normal">
            Lecturer
          </p>
          <p className="text-[#666666] font-medium text-[14px] leading-none tracking-normal ml-[6px]">
            {course.instructor.name}
          </p>
        </div>
        <div className="flex items-center gap-[6px]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.57416 3.63283C9.71586 3.93472 9.99872 4.1461 10.3284 4.19646L13.6173 4.69892C14.4219 4.82184 14.7504 5.80322 14.182 6.3858L11.7402 8.88844C11.5186 9.11561 11.418 9.43451 11.469 9.74776L12.0368 13.2292C12.1712 14.053 11.2967 14.6692 10.5662 14.2654L7.71728 12.6909C7.41623 12.5245 7.0508 12.5245 6.74977 12.6909L3.90194 14.2651C3.17138 14.669 2.29682 14.0529 2.43119 13.229L2.99894 9.74783C3.05004 9.43454 2.94936 9.1156 2.72766 8.88843L0.285393 6.38588C-0.283136 5.80332 0.0454 4.82183 0.850072 4.69892L4.13951 4.19646C4.46923 4.1461 4.75213 3.93466 4.89381 3.6327L6.32838 0.57523C6.68822 -0.191682 7.77897 -0.191761 8.13892 0.575099L9.57416 3.63283Z"
              fill="#F4A316"
            />
          </svg>
          <p>{course.avgRating}</p>
        </div>
      </div>
      <h1 className="text-[#141414] mt-[12px] font-semibold text-[24px]/none tracking-normal w-[240px] line-clamp-2">
        {course.title}
      </h1>
      <p className="text-[#666666] font-medium text-[16px] leading-[24px] tracking-normal mt-[16px] line-clamp-3">
        {course.description}
      </p>
      <div className="mt-auto h-[58px] w-[466px] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <p className="text-[#8A8A8A] font-medium text-[12px] leading-none tracking-normal">
            Starting from
          </p>
          <p className="text-[#141414] font-semibold text-[32px] leading-none tracking-normal">
            ${course.basePrice}
          </p>
        </div>
        <div className="w-[116px] h-[58px] bg-[#4F46E5] flex items-center justify-center rounded-[8px] font-medium text-[20px] leading-none tracking-normal text-white">
          Details
        </div>
      </div>
    </div>
  );
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(
          "https://api.redclass.redberryinternship.ge/api/courses/featured",
        );

        const data: ApiResponse = await res.json();

        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <h1 className="text-[#0A0A0A] font-semibold text-[40px] leading-none">
        Start Learning Today
      </h1>

      <p className="text-[#3D3D3D] font-medium text-[18px] leading-none mt-[8px]">
        Choose from our most popular courses and begin your journey
      </p>

      <div className="flex items-center justify-between mt-[32px]">
        {courses.slice(0, 3).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
