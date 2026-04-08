"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CoursesList from "@/app/components/CoursesList/CoursesList";
import DevelopmentSvg from "@/app/components/icons/DevelopmentSvg";
import DesignSvg from "@/app/components/icons/DesignSvg";
import MarketingSvg from "@/app/components/icons/MarketingSvg";
import BusinessSvg from "@/app/components/icons/BusinessSvg";
import DataScienceSvg from "@/app/components/icons/DataScienceSvg";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Topic {
  id: number;
  categoryId: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
  avatar: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  development: <DevelopmentSvg />,
  design: <DesignSvg />,
  marketing: <MarketingSvg />,
  business: <BusinessSvg />,
  "data-science": <DataScienceSvg />,
};
function Courses() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<number[]>([]);
  const router = useRouter();
  const totalActiveFilters =
    selectedCategories.length +
    selectedTopics.length +
    selectedInstructors.length;

  useEffect(() => {
    const fetchFilters = async () => {
      const [catRes, topicRes, instructorRes] = await Promise.all([
        fetch("https://api.redclass.redberryinternship.ge/api/categories"),
        fetch("https://api.redclass.redberryinternship.ge/api/topics"),
        fetch("https://api.redclass.redberryinternship.ge/api/instructors"),
      ]);
      const [catData, topicData, instructorData] = await Promise.all([
        catRes.json(),
        topicRes.json(),
        instructorRes.json(),
      ]);
      setCategories(catData.data ?? []);
      setTopics(topicData.data ?? []);
      setInstructors(instructorData.data ?? []);
    };
    fetchFilters();
  }, []);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleTopic = (id: number) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const toggleInstructor = (id: number) => {
    setSelectedInstructors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSelectedInstructors([]);
  };

  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <div className="flex items-center">
        <p
          onClick={() => {
            router.push("/");
          }}
          className="text-[#666666] cursor-pointer font-medium text-[18px] leading-[100%] tracking-[0%] h-[22px] flex items-center w-[51px] justify-center"
        >
          Home
        </p>
        <svg
          className="ml-[4px]"
          width="12"
          height="24"
          viewBox="0 0 12 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.45199 6.58023L3.51299 5.52024L9.29199 11.2972C9.38514 11.3898 9.45907 11.4999 9.50952 11.6211C9.55997 11.7424 9.58594 11.8724 9.58594 12.0037C9.58594 12.1351 9.55997 12.2651 9.50952 12.3863C9.45907 12.5076 9.38514 12.6177 9.29199 12.7102L3.51299 18.4902L2.45299 17.4302L7.87699 12.0052L2.45199 6.58023Z"
            fill="#666666"
          />
        </svg>
        <p className="flex items-center ml-[10px] text-[#736BEA] font-medium text-[18px] leading-[100%] tracking-[0%] justify-center w-[64px] h-[24px]">
          Browse
        </p>
      </div>

      <div className="w-full flex justify-between mt-[34px]">
        <div>
          <div className="flex items-center gap-[55px]">
            <p className="text-[#0A0A0A] font-semibold text-[40px] leading-[100%] tracking-[0%] flex w-[121px] h-[48px] justify-center items-center">
              Filters
            </p>
            <div
              className="flex items-center h-[24px] gap-[6px] group cursor-pointer"
              onClick={clearAllFilters}
            >
              <p className="flex items-center justify-center group-hover:text-[#4F46E5] w-[116px] text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-[0%]">
                Clear All Filters
              </p>
              <svg
                className="group-hover:stroke-[#4F46E5]"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.75 5.75L0.75 0.75M5.75 5.75L10.75 10.75M5.75 5.75L10.75 0.75M5.75 5.75L0.75 10.75"
                  className="stroke-[#8A8A8A] group-hover:stroke-[#4F46E5]"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="w-[309px] mt-[32px]">
            <p className="h-[22px] flex items-center text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%]">
              Categories
            </p>
            <div className="flex items-center w-full mt-[24px] flex-wrap gap-[8px]">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`
    px-[12px] py-[8px] rounded-[12px] flex items-center gap-[10px] cursor-pointer
    transition-all duration-300 ease-out border  group
    ${
      active
        ? "bg-[#EEEDFC] border-[#281ED2]"
        : "bg-white border-transparent hover:bg-[#DDDBFA] focus:bg-[#EEEDFC] focus:border-[#281ED2]"
    }
  `}
                  >
                    <span
                      className={`transition-colors ${
                        active
                          ? "text-[#281ED2]"
                          : "text-[#666666] group-hover:text-[#281ED2] focus:text-[#281ED2] ease-out duration-[300ms]"
                      }`}
                    >
                      {CATEGORY_ICONS[cat.icon]}
                    </span>
                    <p
                      className={`font-medium text-[16px] leading-[24px] tracking-[0%] transition-colors ${
                        active
                          ? "text-[#281ED2]"
                          : "text-[#666666] group-hover:text-[#281ED2] focus:text-[#281ED2] ease-out duration-[300ms]"
                      }`}
                    >
                      {cat.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-[309px] mt-[56px]">
            <p className="h-[22px] flex items-center text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%]">
              Topics
            </p>
            <div className="flex items-center w-full mt-[24px] flex-wrap gap-[8px]">
              {topics.map((topic) => {
                const active = selectedTopics.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`
        px-[12px] py-[8px] rounded-[12px] flex items-center gap-[10px] cursor-pointer
        transition-all duration-300 ease-out border group
        ${
          active
            ? "bg-[#EEEDFC] border-[#281ED2]"
            : "bg-white border-transparent hover:bg-[#DDDBFA] ease-out duration-[300ms]"
        }
      `}
                  >
                    <p
                      className={`
          font-medium text-[16px] leading-[24px] tracking-[0%]
          ${active ? "text-[#281ED2]" : "text-[#666666] group-hover:text-[#281ED2]"}
        `}
                    >
                      {topic.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-[309px] mt-[56px]">
            <p className="h-[22px] flex items-center text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%]">
              Instructor
            </p>
            <div className="flex items-center w-full mt-[24px] flex-wrap gap-[8px]">
              {instructors.map((instructor) => {
                const active = selectedInstructors.includes(instructor.id);
                return (
                  <div
                    key={instructor.id}
                    onClick={() => toggleInstructor(instructor.id)}
                    className={`
    px-[12px] py-[8px] rounded-[12px] flex items-center gap-[12px] cursor-pointer
    transition-all duration-300 ease-out border group
    ${
      active
        ? "bg-[#EEEDFC] border-[#281ED2]"
        : "bg-white border-transparent hover:bg-[#DDDBFA]"
    }
  `}
                  >
                    <Image
                      src={instructor.avatar}
                      alt={instructor.name}
                      width={60}
                      height={60}
                      className="w-[30px] h-[30px] object-cover rounded-[4px]"
                    />

                    <p
                      className={`
      font-medium text-[16px] leading-[24px] tracking-[0%]F
      ${active ? "text-[#281ED2]" : "text-[#666666] group-hover:text-[#281ED2] ease-out duration-[300ms]"}
    `}
                    >
                      {instructor.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-[309px] h-[36px] mt-[24px] border-t-[1px] border-t-[#ADADAD]">
            <p className="text-[#8A8A8A] flex h-[17px] items-center font-medium text-[14px] leading-[100%] tracking-[0%] mt-[16px]">
              {totalActiveFilters} Filter{totalActiveFilters !== 1 ? "s" : ""}{" "}
              Active
            </p>
          </div>
        </div>

        <CoursesList
          selectedCategories={selectedCategories}
          selectedTopics={selectedTopics}
          selectedInstructors={selectedInstructors}
        />
      </div>
    </div>
  );
}

export default Courses;
