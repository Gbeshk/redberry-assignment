import NoEnrollmentIcon from "@/app/components/icons/NoEnrollmentIcon";

interface EmptyEnrollmentsProps {
  onBrowse: () => void;
}

export default function EmptyEnrollments({ onBrowse }: EmptyEnrollmentsProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-[274px] overflow-hidden">
      <NoEnrollmentIcon />
      <p className="mt-[4px] h-[29px] text-[#130E67] font-semibold text-[24px] leading-[100%] tracking-[0%]">
        No Enrolled Courses Yet
      </p>
      <p className="text-center text-[#130E67] h-[48px] mt-[8px] font-medium text-[14px] leading-[100%] tracking-[0%]">
        Your learning journey starts here! <br /> Browse courses to get started.
      </p>
      <div
        onClick={onBrowse}
        className="w-[175px] mt-[12px] h-[58px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out  font-medium text-[16px] leading-[24px] tracking-[0%] text-center flex items-center justify-center rounded-[8px] text-white cursor-pointer"
      >
        Browse Courses
      </div>
    </div>
  );
}