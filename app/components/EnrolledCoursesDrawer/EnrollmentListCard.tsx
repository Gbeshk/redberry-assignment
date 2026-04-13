import Image from "next/image";
import { useRouter } from "next/navigation";
import StarIcon from "@/app/components/icons/StarIcon";
import CalendarIcon from "@/app/components/icons/CalendarIcon";
import TimeIcon from "@/app/components/icons/TimeIcon";
import SessionTypeIcon from "@/app/components/icons/SessionTypeIcon";
import EnrolmentListLocationIcon from "@/app/components/icons/EnrolmentListLocationIcon";
import EnrollmentScheduleRow from "./EnrollmentScheduleRow";
import { FullEnrollment } from "@/app/types/enrollment";

export default function EnrollmentListCard({
  enrollment,
  onClose,
}: {
  enrollment: FullEnrollment;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div className="w-[623px] h-[295px] rounded-[12px] bg-white p-[20px]">
      <div className="flex items-center gap-[18px]">
        <Image
          src={enrollment.course.image}
          width={269}
          height={191}
          alt="courseImg"
          className="w-[269px] h-[191px] rounded-[10px] object-cover"
        />

        <div className="h-[186px] flex w-full flex-col">
          <div className="h-[18px] w-full flex items-center justify-between">
            <p className="text-[#8A8A8A] font-medium text-sm leading-none">
              Instructor{" "}
              <span className="text-[#8A8A8A]">
                {enrollment.course.instructor.name}
              </span>
            </p>
            {enrollment.course.avgRating ? (
              <div className="flex gap-[4px] items-center">
                <StarIcon />
                <p className="font-medium text-sm leading-none tracking-normal text-[#525252]">
                  {Math.round(enrollment.course.avgRating * 10) / 10}
                </p>
              </div>
            ) : null}
          </div>

          <p className="font-semibold text-[20px] leading-[24px] tracking-normal text-[#141414] w-[257px] mt-[8px] h-[48px] flex items-center">
            {enrollment.course.title}
          </p>

          <EnrollmentScheduleRow
            icon={<CalendarIcon />}
            label={enrollment.schedule.weeklySchedule.label}
          />
          <EnrollmentScheduleRow
            icon={<TimeIcon />}
            label={enrollment.schedule.timeSlot.label}
          />
          <EnrollmentScheduleRow
            icon={<SessionTypeIcon />}
            label={enrollment.schedule.sessionType.name}
          />
          {enrollment.schedule.sessionType.name.toLowerCase() !== "online" && (
            <EnrollmentScheduleRow
              icon={<EnrolmentListLocationIcon />}
              label={enrollment.schedule.location}
            />
          )}
        </div>
      </div>

      <div className="w-full h-[48px] mt-[16px] flex items-center justify-between">
        <div className="flex flex-col h-[39px] justify-center ml-[4px]">
          <p className="font-medium text-base leading-6 tracking-normal text-[#141414]">
            {enrollment.progress}% Complete
          </p>
          <div className="w-[442px] h-[15px] bg-[#DDDBFA] rounded-[30px]">
            <div
              className="h-full bg-[#4F46E5] rounded-[30px] transition-all duration-300"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => { router.push(`/courses/${enrollment.course.id}`); onClose(); }}
          className="w-[117px] h-[48px] flex items-center justify-center rounded-[8px] cursor-pointer border-[2px] border-[#958FEF] font-medium text-base leading-6 tracking-normal text-[#4F46E5] hover:bg-[#281ED2] hover:text-white hover:border-[#281ED2] active:bg-[#1E169D] active:text-white active:border-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:text-white focus-visible:border-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-[300ms] ease-out"
        >
          View
        </button>
      </div>
    </div>
  );
}
