"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SortingArrow from "../icons/SortingArrow";
import DevelopmentSvg from "../icons/DevelopmentSvg";
import DesignSvg from "../icons/DesignSvg";
import MarketingSvg from "../icons/MarketingSvg";
import BusinessSvg from "../icons/BusinessSvg";
import DataScienceSvg from "../icons/DataScienceSvg";
import StarIcon from "../icons/StarIcon";

interface Course {
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

type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "title_az";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest First",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  popular: "Most Popular",
  title_az: "Title: A-Z",
};

interface CoursesListProps {
  selectedCategories: number[];
  selectedTopics: number[];
  selectedInstructors: number[];
}

function CoursesList({
  selectedCategories,
  selectedTopics,
  selectedInstructors,
}: CoursesListProps) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const COURSES_PER_PAGE = 9;
  const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    development: <DevelopmentSvg />,
    design: <DesignSvg />,

    marketing: <MarketingSvg />,
    business: <BusinessSvg />,

    "data-science": <DataScienceSvg />,
  };
  useEffect(() => {
    const fetchAll = async () => {
      let page = 1;
      let collected: Course[] = [];
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(
          `https://api.redclass.redberryinternship.ge/api/courses?page=${page}`,
        );
        const data = await res.json();
        const items: Course[] = data.data ?? data.courses ?? data;
        collected = [...collected, ...items];
        const total = data.total ?? data.meta?.total ?? 0;
        hasMore = collected.length < total && items.length > 0;
        page++;
      }
      setAllCourses(collected);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedTopics, selectedInstructors]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".sort-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        return b.id - a.id;
      case "price_asc":
        return parseFloat(a.basePrice) - parseFloat(b.basePrice);
      case "price_desc":
        return parseFloat(b.basePrice) - parseFloat(a.basePrice);
      case "popular":
        return (b.avgRating ?? 0) - (a.avgRating ?? 0);
      case "title_az":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const total = sortedCourses.length;
  const totalPages = Math.ceil(total / COURSES_PER_PAGE);
  const start = (currentPage - 1) * COURSES_PER_PAGE;
  const courses = sortedCourses.slice(start, start + COURSES_PER_PAGE);

  return (
    <div className="w-[1167px]">
      <div className="w-full flex h-[49px] items-center justify-between">
        <p className="h-[24px] flex items-center justify-center text-[#666666] font-medium text-[16px] leading-[24px]">
          Showing {courses.length} out of {total}
        </p>

        <div className="relative sort-dropdown">
          <div
            className="px-[20px] py-[7px] rounded-[10px] bg-white h-[49px] flex items-center cursor-pointer select-none"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <p className="text-[#666666] font-medium text-[16px] leading-[24px]">
              Sort By:
              <span className="text-[#4F46E5]"> {SORT_LABELS[sortBy]}</span>
            </p>
            <svg
              className="ml-[8px]"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.4448 7.50122L11.1506 12.7952C11.0287 12.9171 10.884 13.0138 10.7248 13.0798C10.5655 13.1457 10.3948 13.1797 10.2224 13.1797C10.0501 13.1797 9.87939 13.1457 9.72015 13.0798C9.5609 13.0138 9.4162 12.9171 9.29432 12.7952L4.00032 7.50097"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-[54px] w-full bg-white rounded-[10px] shadow-lg z-10 py-[8px]">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSortBy(option);
                    setDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`px-[20px] py-[10px] text-[16px] font-medium leading-[24px] cursor-pointer  hover:bg-[#DDDBFA] ease-out duration-300 whitespace-nowrap ${
                    sortBy === option ? "text-[#4F46E5]" : "text-[#666666]"
                  }`}
                >
                  {SORT_LABELS[option]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-[32px] flex flex-wrap gap-[24px]">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-[373px] h-[451px] bg-white rounded-[12px] p-[20px] flex flex-col 
  ease-out duration-300        
  border-[1px] border-[#F5F5F5] transition-all cursor-pointer 
  hover:border-[#B7B3F4] hover:shadow-[0px_0px_15px_0px_rgba(138,130,212,0.2)]
  focus:border-[#958FEF] focus:shadow-[0px_0px_45px_0px_rgba(138,130,212,0.15)]
  focus:outline-none"
            tabIndex={0}
          >
            <Image
              src={course.image}
              alt={course.title}
              className="w-[333px] h-[181px] object-cover rounded-[10px]"
              width={466}
              height={262}
            />
            <div className="flex items-center mt-[18px] justify-between h-[18px]">
              <div className="flex items-center">
                <p className="text-[#ADADAD] font-medium text-[14px] leading-none tracking-normal ">
                  {course.instructor.name} | {course.durationWeeks} weeks
                </p>
              </div>
              <div className="flex items-center gap-[6px]">
                <StarIcon />
                <p className="font-medium text-sm leading-none tracking-normal text-[#525252]">
                  {course.avgRating}
                </p>
              </div>
            </div>
            <h1 className="text-[#141414] mt-[12px] font-semibold text-[24px] leading-none h-[58px] flex items-center tracking-normal">
              {course.title}
            </h1>
            <div className="px-[12px] py-[8px] bg-[#F5F5F5] rounded-[12px] flex items-center gap-[10px] w-fit mt-[18px]">
              <span className="text-[#666666]">
                {
                  CATEGORY_ICONS[
                    course.category.name.toLowerCase().replace(" ", "-")
                  ]
                }
              </span>
              <p className="font-medium text-[16px] leading-[24px] tracking-[0%] text-[#666666]">
                {course.category.name}
              </p>
            </div>
            <div className="flex items-center justify-between h-[48px] w-full mt-[18px]">
              <div className="flex flex-col justify-center">
                <p className="text-[#ADADAD] h-[15px] flex items-center font-medium text-[12px] leading-none tracking-normal">
                  Starting from
                </p>
                <p className="text-[#3D3D3D] font-semibold text-[24px] leading-none tracking-normal h-[29px] flex items-center">
                  ${course.basePrice}
                </p>
              </div>
              <div className="w-[103px] h-[48px] flex items-center cursor-pointer justify-center bg-[#4F46E5] text-white font-medium text-[16px] leading-[24px] tracking-normal rounded-[8px]">
                Details
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-[8px] mt-[32px] justify-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`w-[40px] h-[40px] rounded-[4px] flex items-center justify-center transition-colors border
    ${
      currentPage === 1
        ? "bg-white border-[#D1D1D1] cursor-default opacity-100"
        : "bg-white border-[#D1D1D1] cursor-pointer hover:bg-[#DDDBFA] hover:border-[#B7B3F4]"
    }`}
          >
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.30113 0.000709453L6.32386 1.01207L2.77272 4.56321L11.6932 4.56321L11.6932 6.04048L2.77272 6.04048L6.32386 9.58594L5.30113 10.603L-4.5935e-06 5.30185L5.30113 0.000709453Z"
                fill={currentPage === 1 ? "#D1D1D1" : "#4F46E5"}
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[40px] h-[40px] rounded-[4px] font-medium text-[14px] transition-colors cursor-pointer border
  ${
    page === currentPage
      ? "bg-[#281ED2] text-white border-[#4F46E5]"
      : "bg-white text-[#4F46E5] border-[#D1D1D1] hover:bg-[#DDDBFA] hover:text-[#4F46E5] hover:border-[#B7B3F4]"
  }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`w-[40px] h-[40px] rounded-[4px] flex items-center justify-center transition-colors border
    ${
      currentPage === totalPages
        ? "bg-white border-[#D1D1D1] cursor-default opacity-100"
        : "bg-white border-[#D1D1D1] cursor-pointer hover:bg-[#DDDBFA] hover:border-[#B7B3F4]"
    }`}
          >
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                transform="scale(-1,1) translate(-12,0)"
                d="M5.30113 0.000709453L6.32386 1.01207L2.77272 4.56321L11.6932 4.56321L11.6932 6.04048L2.77272 6.04048L6.32386 9.58594L5.30113 10.603L-4.5935e-06 5.30185L5.30113 0.000709453Z"
                fill={currentPage === totalPages ? "#D1D1D1" : "#4F46E5"}
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default CoursesList;
