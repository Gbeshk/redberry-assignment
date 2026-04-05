"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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

  const COURSES_PER_PAGE = 9;

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

  // Reset to page 1 whenever filters change
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
            <p className="text-[#666666] font-medium text-[16px] leading-[24px] w-[166px]">
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
                  className={`px-[20px] py-[10px] text-[16px] font-medium leading-[24px] cursor-pointer hover:bg-[#F5F5F5] whitespace-nowrap ${
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
            className="w-[373px] h-[451px] bg-white rounded-[12px] p-[20px] flex flex-col"
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
            <h1 className="text-[#141414] mt-[12px] font-semibold text-[24px] leading-none h-[58px] flex items-center tracking-normal">
              {course.title}
            </h1>
            <div className="px-[12px] py-[8px] bg-[#F5F5F5] rounded-[12px] flex items-center gap-[10px] w-fit mt-[18px]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.47977 8.82659L2.67165 12L6.47977 15.1735C6.55763 15.2358 6.62227 15.313 6.66992 15.4006C6.71757 15.4882 6.74727 15.5845 6.75728 15.6837C6.76729 15.7829 6.75741 15.8831 6.72822 15.9785C6.69903 16.0739 6.65111 16.1624 6.58727 16.2391C6.52343 16.3157 6.44495 16.3788 6.35643 16.4247C6.2679 16.4706 6.17111 16.4984 6.07171 16.5065C5.9723 16.5146 5.87229 16.5027 5.77752 16.4717C5.68275 16.4406 5.59513 16.391 5.51977 16.3256L1.01978 12.5757C0.935337 12.5053 0.867403 12.4172 0.820784 12.3176C0.774165 12.2181 0.75 12.1095 0.75 11.9996C0.75 11.8896 0.774165 11.781 0.820784 11.6815C0.867403 11.5819 0.935337 11.4938 1.01978 11.4235L5.51977 7.67346C5.67269 7.54616 5.86991 7.48481 6.06805 7.50292C6.2662 7.52103 6.44903 7.61711 6.57634 7.77002C6.70364 7.92294 6.76499 8.12016 6.74688 8.3183C6.72877 8.51645 6.63269 8.69928 6.47977 8.82659ZM22.9798 11.4235L18.4798 7.67346C18.4041 7.61043 18.3167 7.56292 18.2226 7.53366C18.1285 7.5044 18.0296 7.49396 17.9315 7.50292C17.8334 7.51189 17.738 7.54009 17.6508 7.58592C17.5636 7.63175 17.4862 7.69431 17.4232 7.77002C17.2959 7.92294 17.2346 8.12016 17.2527 8.3183C17.2708 8.51645 17.3669 8.69928 17.5198 8.82659L21.3279 12L17.5198 15.1735C17.4419 15.2358 17.3773 15.313 17.3296 15.4006C17.282 15.4882 17.2523 15.5845 17.2423 15.6837C17.2323 15.7829 17.2421 15.8831 17.2713 15.9785C17.3005 16.0739 17.3484 16.1624 17.4123 16.2391C17.4761 16.3157 17.5546 16.3788 17.6431 16.4247C17.7316 16.4706 17.8284 16.4984 17.9278 16.5065C18.0272 16.5146 18.1273 16.5027 18.222 16.4717C18.3168 16.4406 18.4044 16.391 18.4798 16.3256L22.9798 12.5757C23.0642 12.5053 23.1321 12.4172 23.1788 12.3176C23.2254 12.2181 23.2495 12.1095 23.2495 11.9996C23.2495 11.8896 23.2254 11.781 23.1788 11.6815C23.1321 11.5819 23.0642 11.4938 22.9798 11.4235ZM15.2557 3.04502C15.1631 3.01141 15.0648 2.99636 14.9664 3.00074C14.868 3.00512 14.7715 3.02883 14.6822 3.07053C14.593 3.11223 14.5129 3.1711 14.4464 3.24377C14.3799 3.31645 14.3284 3.4015 14.2948 3.49409L8.29477 19.9941C8.26102 20.0867 8.24586 20.1851 8.25016 20.2836C8.25447 20.3821 8.27815 20.4788 8.31986 20.5681C8.36157 20.6575 8.42049 20.7377 8.49324 20.8043C8.56599 20.8708 8.65114 20.9224 8.74384 20.956C8.826 20.9852 8.91257 21.0001 8.99977 21C9.1538 21 9.30409 20.9526 9.43022 20.8642C9.55635 20.7758 9.65221 20.6507 9.70477 20.506L15.7048 4.00596C15.7384 3.91338 15.7534 3.81508 15.7491 3.71669C15.7447 3.61829 15.721 3.52172 15.6793 3.43249C15.6376 3.34325 15.5787 3.26311 15.506 3.19663C15.4334 3.13015 15.3483 3.07863 15.2557 3.04502Z"
                  fill="#525252"
                />
              </svg>
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
              <div className="w-[103px] h-[48px] flex items-center justify-center bg-[#4F46E5] text-white font-medium text-[16px] leading-[24px] tracking-normal rounded-[8px]">
                Details
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-[8px] mt-[40px]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-[16px] h-[40px] rounded-[10px] bg-white text-[#666666] font-medium text-[16px] disabled:opacity-40"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[40px] h-[40px] rounded-[10px] font-medium text-[16px] ${page === currentPage ? "bg-[#4F46E5] text-white" : "bg-white text-[#666666]"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-[16px] h-[40px] rounded-[10px] bg-white text-[#666666] font-medium text-[16px] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CoursesList;
