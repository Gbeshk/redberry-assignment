import Image from "next/image";
import { Instructor } from "@/app/types/filters";

interface InstructorChipProps {
  instructor: Instructor;
  active: boolean;
  onClick: () => void;
}

export default function InstructorChip({ instructor, active, onClick }: InstructorChipProps) {
  return (
    <div
      onClick={onClick}
      className={`
        px-[12px] py-[8px] rounded-[12px] flex items-center gap-[12px] cursor-pointer
        transition-all duration-300 ease-out border group
        ${active
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
        className={`font-medium text-[16px] leading-[24px] tracking-[0%] ${
          active
            ? "text-[#281ED2]"
            : "text-[#666666] group-hover:text-[#281ED2] ease-out duration-[300ms]"
        }`}
      >
        {instructor.name}
      </p>
    </div>
  );
}