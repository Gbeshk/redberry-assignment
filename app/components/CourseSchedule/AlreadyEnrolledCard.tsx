import Calendar from "../icons/Calendar";
import Location from "../icons/Location";
import Timee from "../icons/Timee";
import Online from "../icons/Online";
import Hybrid from "../icons/Hybrid";
import InPerson from "../icons/InPerson";
interface EnrollmentDetail {
  id: number;
  progress: number;
  course?: { id: number };
  schedule?: {
    weeklySchedule?: { label: string };
    timeSlot?: { label: string; startTime?: string; endTime?: string };
    sessionType?: { name: string; location?: string };
    location?: string;
  };
}

export default function AlreadyEnrolledCard({
  enrollment,
}: {
  enrollment: EnrollmentDetail;
}) {
  const schedule = enrollment.schedule;
  const days = schedule?.weeklySchedule?.label ?? "—";
  const slot = schedule?.timeSlot;
  const timeDisplay = slot?.label ?? "—";
  const sessionName = schedule?.sessionType?.name ?? "—";
  const isOnline = sessionName.toLowerCase() === "online";
  const location =
    schedule?.location ?? schedule?.sessionType?.location ?? null;
  const progress = enrollment.progress ?? 0;

  return (
    <div className="w-[530px]">
      <div className="rounded-[100px] p-[16px] font-semibold text-xl leading-6 tracking-normal text-[#736BEA] w-fit bg-[#736BEA1A]">
        Enrolled
      </div>

      <div>
        <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
          <Calendar />
          <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
            {days}
          </p>
        </span>
      </div>

      {/* Time */}
      <div>
        <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
          <Timee />
          <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
            {timeDisplay}
          </p>
        </span>
      </div>

      {/* Session type */}
      <div>
        <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
          {sessionName === "online" && <Online />}
          {sessionName === "in_person" && <InPerson />}
          {sessionName === "hybrid" && <Hybrid />}
          <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
            {sessionName === "in_person"
              ? "In Person"
              : sessionName.charAt(0).toUpperCase() + sessionName.slice(1)}
          </p>
        </span>
      </div>
      {/* Location — only shown for in-person/hybrid */}
      {!isOnline && location && (
        <div>
          <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
            <Location />
            <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
              {location}
            </p>
          </span>
        </div>
      )}

      {/* Progress */}
      <p className="mt-[48px] h-[30px] flex items-center font-semibold text-xl leading-6 tracking-normal align-middle text-[#666666]">
        {progress}% Complete
      </p>
      <div className="w-[473px] h-[23.45px] bg-[#DDDBFA] rounded-[30px]">
        <div
          className="h-full bg-[#4F46E5] rounded-[30px] mt-[12px] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* CTA */}
      <div className="w-[473px] mt-[40px] h-[58px] rounded-[8px] bg-[#4F46E5] flex items-center justify-center gap-[10px] cursor-pointer">
        <p className="font-medium text-xl leading-none tracking-normal text-center text-white">
          Complete Course
        </p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21.5784 6.30087L8.63266 19.7856C8.55752 19.8639 8.46828 19.9261 8.37006 19.9685C8.27184 20.0109 8.16655 20.0328 8.06022 20.0328C7.95389 20.0328 7.8486 20.0109 7.75038 19.9685C7.65216 19.9261 7.56292 19.8639 7.48778 19.7856L1.82403 13.886C1.67221 13.7279 1.58691 13.5134 1.58691 13.2897C1.58691 13.0661 1.67221 12.8516 1.82403 12.6935C1.97585 12.5353 2.18176 12.4465 2.39647 12.4465C2.61118 12.4465 2.81709 12.5353 2.96891 12.6935L8.06022 17.9978L20.4335 5.10831C20.5853 4.95017 20.7912 4.86133 21.0059 4.86133C21.2206 4.86133 21.4266 4.95017 21.5784 5.10831C21.7302 5.26646 21.8155 5.48094 21.8155 5.70459C21.8155 5.92824 21.7302 6.14273 21.5784 6.30087Z"
            fill="white"
            stroke="#EEEDFC"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
