"use client";
import { useEffect, useRef, useState } from "react";
import { SortOption, SORT_LABELS } from "@/app/hooks/useCoursesList";

interface SortDropdownProps {
  sortBy: SortOption;
  onChange: (option: SortOption) => void;
}

export default function SortDropdown({ sortBy, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="px-[20px] py-[7px] rounded-[10px] bg-white h-[49px] flex items-center cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
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

      {isOpen && (
        <div className="absolute right-0 top-[54px] w-full bg-white rounded-[10px] shadow-lg z-10 py-[8px]">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-[20px] py-[10px] text-[16px] font-medium leading-[24px] cursor-pointer hover:bg-[#DDDBFA] ease-out duration-300 whitespace-nowrap ${
                sortBy === option ? "text-[#4F46E5]" : "text-[#666666]"
              }`}
            >
              {SORT_LABELS[option]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
