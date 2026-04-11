import Image from "next/image";
import WeeeksIcon from "@/app/components/icons/WeeeksIcon";
import HoursIcon from "@/app/components/icons/HoursIcon";
import BigStarIcon from "@/app/components/icons/BigStarIcon";
import DevelopmentSvg from "@/app/components/icons/DevelopmentSvg";
import DesignSvg from "@/app/components/icons/DesignSvg";
import MarketingSvg from "@/app/components/icons/MarketingSvg";
import BusinessSvg from "@/app/components/icons/BusinessSvg";
import DataScienceSvg from "@/app/components/icons/DataScienceSvg";
import { Course } from "@/app/types/course";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  development: <DevelopmentSvg />,
  design: <DesignSvg />,
  marketing: <MarketingSvg />,
  business: <BusinessSvg />,
  "data-science": <DataScienceSvg />,
};

interface CourseDetailHeroProps {
  course: Course;
}

export default function CourseDetailHero({ course }: CourseDetailHeroProps) {
  return (
    <>
      <Image
        src={course.image}
        alt="courseImg"
        width={903}
        height={474}
        className="rounded-[10px] object-cover w-[903px] h-[474px]"
      />

      <div className="mt-[16px] h-[39px] flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <WeeeksIcon />
          <p className="flex items-center h-[17px] font-medium text-[14px] leading-none tracking-normal text-[#525252]">
            {course.durationWeeks} Weeks
          </p>
          <HoursIcon />
          <p className="flex items-center h-[17px] font-medium text-[14px] leading-none tracking-normal text-[#525252]">
            12 Weeks
          </p>
        </div>

        <div className="flex items-center">
          <BigStarIcon />
          <p className="ml-[4px] text-[#525252] font-medium text-[14px] leading-[150%] tracking-normal">
            {course.avgRating ? Number(course.avgRating).toFixed(1) : "0.0"}
          </p>
          <div className="py-[8px] h-[39px] bg-white ml-[16px] rounded-[12px] flex items-center gap-[8px] px-[12px]">
            <span className="text-[#525252]">
              {
                CATEGORY_ICONS[
                  course.category.name.toLowerCase().replace(" ", "-")
                ]
              }
            </span>
            <p className="text-[#525252] font-medium text-[14px]">
              {course.category.name}
            </p>
          </div>
        </div>
      </div>

      {course.instructor && (
        <div className="px-[12px] bg-white py-[8px] rounded-[12px] w-fit mt-[18px] flex items-center gap-[12px] cursor-pointer">
          {course.instructor.avatar && (
            <Image
              src={course.instructor.avatar}
              alt={course.instructor.name}
              width={60}
              height={60}
              className="w-[30px] h-[30px] object-cover rounded-[4px]"
            />
          )}
          <p className="font-medium text-[16px] text-[#666666] leading-[24px] tracking-normal">
            {course.instructor.name}
          </p>
        </div>
      )}
    </>
  );
}
