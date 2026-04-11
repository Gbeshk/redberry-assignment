import Image from "next/image";
import { useRouter } from "next/navigation";
import StarIcon from "@/app/components/icons/StarIcon";
import { CourseBase } from "@/app/types/course";

export default function FeaturedCourseCard({ course }: { course: CourseBase }) {
  const router = useRouter();

  return (
    <div
      tabIndex={0}
      onClick={() => router.push(`/courses/${course.id}`)}
      className="w-[506px] h-[576px] bg-white rounded-[12px] p-[20px] flex flex-col relative
        border-[1px] border-[#F5F5F5] transition-all ease-out duration-300
        hover:border-[#B7B3F4] hover:shadow-[0px_0px_15px_0px_rgba(138,130,212,0.2)]
        focus:border-[#958FEF] focus:shadow-[0px_0px_45px_0px_rgba(138,130,212,0.15)]
        focus:outline-none cursor-pointer"
    >
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

      <h1 className="text-[#141414] mt-[12px] font-semibold text-[24px] leading-[120%] tracking-normal flex items-center h-[58px]">
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
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/courses/${course.id}`);
          }}
          className="w-[116px] h-[58px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out flex items-center justify-center rounded-[8px] font-medium text-[20px] leading-none tracking-normal text-white cursor-pointer"
        >
          Details
        </button>
      </div>
    </div>
  );
}
