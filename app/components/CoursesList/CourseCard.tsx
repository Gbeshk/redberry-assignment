import Image from "next/image";
import { useRouter } from "next/navigation";
import StarIcon from "@/app/components/icons/StarIcon";
import DevelopmentSvg from "@/app/components/icons/DevelopmentSvg";
import DesignSvg from "@/app/components/icons/DesignSvg";
import MarketingSvg from "@/app/components/icons/MarketingSvg";
import BusinessSvg from "@/app/components/icons/BusinessSvg";
import DataScienceSvg from "@/app/components/icons/DataScienceSvg";
import { Course } from "@/app/hooks/useCoursesList";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  development: <DevelopmentSvg />,
  design: <DesignSvg />,
  marketing: <MarketingSvg />,
  business: <BusinessSvg />,
  "data-science": <DataScienceSvg />,
};

export default function CourseCard({ course }: { course: Course }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/courses/${course.id}`)}
      tabIndex={0}
      className="w-[373px] h-[451px] bg-white rounded-[12px] p-[20px] flex flex-col
        ease-out duration-300
        border-[1px] border-[#F5F5F5] transition-all cursor-pointer
        hover:border-[#B7B3F4] hover:shadow-[0px_0px_15px_0px_rgba(138,130,212,0.2)]
        focus:border-[#958FEF] focus:shadow-[0px_0px_45px_0px_rgba(138,130,212,0.15)]
        focus:outline-none"
    >
      <Image
        src={course.image}
        alt={course.title}
        className="w-[333px] h-[181px] object-cover rounded-[10px]"
        width={466}
        height={262}
      />

      <div className="flex items-center mt-[18px] justify-between h-[18px]">
        <p className="text-[#ADADAD] font-medium text-[14px] leading-none tracking-normal">
          {course.instructor.name} | {course.durationWeeks} weeks
        </p>
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
          {CATEGORY_ICONS[course.category.name.toLowerCase().replace(" ", "-")]}
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
  );
}
