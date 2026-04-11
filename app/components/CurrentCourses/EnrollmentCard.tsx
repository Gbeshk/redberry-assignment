import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import StarIcon from "@/app/components/icons/StarIcon";
import def_img from "@/public/images/default-course-img.png";
import { Enrollment } from "@/app/hooks/useCurrentCourses";

const BLUR_CLASSES = ["blur-[20px]", "blur-[20px]", "blur-[10px]"];

interface EnrollmentCardProps {
  enrollment: Enrollment | null;
  index: number;
  isLoggedIn: boolean;
}

export default function EnrollmentCard({ enrollment, index, isLoggedIn }: EnrollmentCardProps) {
  const router = useRouter();

  const progress = enrollment?.progress ?? 65;
  const title = enrollment?.course.title ?? "Advanced React & TypeScript Development";
  const instructor = enrollment?.course.instructor.name ?? "Marilyn Mango";
  const rating = enrollment?.course.avgRating
    ? Math.round(enrollment.course.avgRating * 10) / 10
    : null;
  const image: string | StaticImageData = enrollment?.course.image ?? def_img;
  const progressWidth = (336 * progress) / 100;

  const handleNavigate = () => {
    if (enrollment) router.push(`/courses/${enrollment.course.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      tabIndex={enrollment ? 0 : -1}
      className={`w-[506px] h-full bg-white rounded-[12px] p-[20px] border-[1px] transition-all ease-out duration-300
        ${!isLoggedIn ? BLUR_CLASSES[index] : ""}
        ${enrollment
          ? "border-[#F5F5F5] cursor-pointer hover:border-[#B7B3F4] hover:shadow-[0px_0px_15px_0px_rgba(138,130,212,0.2)] focus:border-[#958FEF] focus:shadow-[0px_0px_45px_0px_rgba(138,130,212,0.15)] focus:outline-none"
          : "border-[#F5F5F5]"
        }`}
    >
      <div className="flex gap-[16px]">
        <Image
          src={image}
          width={140}
          height={123}
          alt="course"
          className="w-[140px] h-[123px] rounded-[12px] object-cover"
        />
        <div>
          <div className="w-[306px] h-[18px] flex items-center justify-between">
            <p className="text-[#8A8A8A] font-medium text-[14px] leading-[100%] tracking-[0%]">
              Lecturer <span className="text-[#666666]">{instructor}</span>
            </p>
            {rating && (
              <div className="flex items-center gap-[4px] h-[18px]">
                <StarIcon />
                <p className="text-[#525252] font-medium text-[14px] leading-[100%] tracking-[0%]">
                  {rating}
                </p>
              </div>
            )}
          </div>
          <h1 className="mt-[9px] text-[#141414] font-semibold text-[20px] leading-[24px] tracking-[0%]">
            {title}
          </h1>
        </div>
      </div>

      <div className="w-full h-[48px] flex items-center mt-[8px] justify-between">
        <div className="flex flex-col">
          <p className="text-[#141414] h-[16px] flex items-center font-medium text-[12px] leading-[100%] tracking-[0%]">
            {progress}% Complete
          </p>
          <div className="w-[336px] h-[15.13px] mt-[4px] bg-[#DDDBFA] rounded-[30px]">
            <div
              className="h-full bg-[#4F46E5] rounded-[30px]"
              style={{ width: `${progressWidth}px` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          className="cursor-pointer w-[90px] h-[48px] border-[2px] border-[#958FEF] rounded-[8px] flex items-center justify-center text-[#4F46E5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center hover:bg-[#281ED2] hover:text-white hover:border-[#281ED2] active:bg-[#1E169D] active:border-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:text-white focus-visible:border-[#1E169D] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out"
        >
          View
        </button>
      </div>
    </div>
  );
}