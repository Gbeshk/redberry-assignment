"use client";
import ArrowNavigation from "@/app/components/icons/ArrowNavigation";
import { useRouter } from "next/navigation";

interface CourseDetailBreadcrumbProps {
  categoryName: string;
}

export default function CourseDetailBreadcrumb({
  categoryName,
}: CourseDetailBreadcrumbProps) {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <p
        onClick={() => router.push("/")}
        className="text-[#666666] cursor-pointer font-medium text-[18px] leading-[100%] tracking-[0%] h-[22px] flex items-center w-[51px] justify-center hover:text-[#4F46E5] transition-colors duration-300 ease-out"
      >
        Home
      </p>
      <ArrowNavigation />
      <p
        onClick={() => router.push("/courses")}
        className="flex items-center ml-[10px] cursor-pointer text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%] justify-center h-[24px] hover:text-[#4F46E5] transition-colors duration-300 ease-out"
      >
        Browse
      </p>
      <ArrowNavigation />
      <p className="flex items-center ml-[10px] text-[#736BEA] font-medium text-[18px] leading-[100%] tracking-[0%] justify-center h-[24px]">
        {categoryName}
      </p>
    </div>
  );
}
