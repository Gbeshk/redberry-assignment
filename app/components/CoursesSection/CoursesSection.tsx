"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import StarIcon from "../icons/StarIcon";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <div className="w-[506px] h-[576px] bg-white rounded-[12px] p-[20px] flex flex-col relative">
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
        {course.avgRating && (
          <div className="flex items-center gap-[6px] h-[18px]">
            <StarIcon />
            <p className="text-[#525252] font-medium text-[14px] leading-[100%] tracking-normal">
              {course.avgRating}
            </p>
          </div>
        )}
      </div>
      <h1 className="text-[#141414] mt-[12px] font-semibold text-[24px]  leading-[120%]  tracking-normal flex items-center  h-[58px]">
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
        <div
          onClick={() => {
            router.push(`/courses/${course.id}`);
          }}
          className="w-[116px] h-[58px] bg-[#4F46E5] cursor-pointer flex items-center justify-center rounded-[8px] font-medium text-[20px] leading-none tracking-normal text-white"
        >
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
      <h1 className="text-[#0A0A0A] font-semibold text-[40px] leading-[40px] tracking-[0px]">
        Start Learning Today
      </h1>

      <p className="text-[#3D3D3D] font-medium text-[18px] leading-[18px] tracking-[0px] mt-[8px]">
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
