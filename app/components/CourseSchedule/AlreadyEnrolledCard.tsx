"use client";
import { useState } from "react";
import Calendar from "../icons/Calendar";
import Location from "../icons/Location";
import Online from "../icons/Online";
import Hybrid from "../icons/Hybrid";
import InPerson from "../icons/InPerson";
import SmallTimeIcon from "../icons/SmallTimeIcon";

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
  onUnenroll,
}: {
  enrollment: EnrollmentDetail;
  onUnenroll: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(enrollment.progress >= 100);
  const [completing, setCompleting] = useState(false);
  const [retaking, setRetaking] = useState(false);

  const schedule = enrollment.schedule;
  const days = schedule?.weeklySchedule?.label ?? "—";
  const slot = schedule?.timeSlot;
  const timeDisplay = slot?.label ?? "—";
  const sessionName = schedule?.sessionType?.name ?? "—";
  const isOnline = sessionName.toLowerCase() === "online";
  const location =
    schedule?.location ?? schedule?.sessionType?.location ?? null;
  const progress = isCompleted ? 100 : (enrollment.progress ?? 0);

  const handleRetake = async () => {
    setRetaking(true);
    try {
      const token = localStorage.getItem("authToken");
      await fetch(
        `https://api.redclass.redberryinternship.ge/api/enrollments/${enrollment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      onUnenroll();
    } catch {
    } finally {
      setRetaking(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://api.redclass.redberryinternship.ge/api/enrollments/${enrollment.id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      if (res.ok) setIsCompleted(true);
    } catch {
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="w-[530px]">
      <div
        className="rounded-[100px] p-[16px] font-semibold text-xl leading-6 tracking-normal w-fit"
        style={{
          backgroundColor: isCompleted ? "#1DC31D1A" : "#736BEA1A",
          color: isCompleted ? "#1DC31D" : "#736BEA",
        }}
      >
        {isCompleted ? "Completed" : "Enrolled"}
      </div>

      <div>
        <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
          <Calendar />
          <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
            {days}
          </p>
        </span>
      </div>

      <div>
        <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
          <SmallTimeIcon />{" "}
          <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
            {timeDisplay}
          </p>
        </span>
      </div>

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

      <p className="mt-[48px] h-[30px] flex items-center font-semibold text-xl leading-6 tracking-normal align-middle text-[#666666]">
        {progress}% Complete
      </p>
      <div className="w-[473px] h-[23.45px] bg-[#DDDBFA] rounded-[30px]">
        <div
          className="h-full bg-[#4F46E5] rounded-[30px] mt-[12px] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isCompleted ? (
        <button
          type="button"
          onClick={handleRetake}
          disabled={retaking}
          className="w-[473px] mt-[40px] h-[58px] rounded-[8px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out flex items-center justify-center gap-[10px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <p className="font-medium text-xl leading-none tracking-normal text-center text-white">
            {retaking ? "Processing..." : "Retake Course"}
          </p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4995 5.24916V9.74916C22.4995 9.94807 22.4205 10.1388 22.2799 10.2795C22.1392 10.4201 21.9484 10.4992 21.7495 10.4992H17.2495C17.0506 10.4992 16.8598 10.4201 16.7192 10.2795C16.5785 10.1388 16.4995 9.94807 16.4995 9.74916C16.4995 9.55024 16.5785 9.35948 16.7192 9.21883C16.8598 9.07818 17.0506 8.99916 17.2495 8.99916H19.8183L17.3255 6.71541L17.302 6.69291C16.2596 5.65087 14.9332 4.93908 13.4886 4.64648C12.044 4.35388 10.5452 4.49342 9.17942 5.04769C7.81365 5.60195 6.64148 6.54636 5.80934 7.76293C4.97719 8.97951 4.52196 10.4143 4.50052 11.8881C4.47907 13.3619 4.89237 14.8093 5.68877 16.0496C6.48517 17.2899 7.62937 18.268 8.97843 18.8617C10.3275 19.4555 11.8216 19.6386 13.2741 19.3881C14.7266 19.1377 16.0731 18.4648 17.1455 17.4535C17.29 17.3168 17.483 17.2431 17.682 17.2486C17.8809 17.2541 18.0695 17.3385 18.2062 17.4831C18.343 17.6276 18.4167 17.8206 18.4112 18.0196C18.4056 18.2185 18.3213 18.4071 18.1767 18.5438C16.5093 20.1252 14.2975 21.0043 11.9995 20.9992H11.8758C10.4018 20.979 8.9553 20.597 7.66349 19.8869C6.37167 19.1768 5.27406 18.1602 4.46714 16.9265C3.66021 15.6929 3.16866 14.2799 3.03571 12.8117C2.90275 11.3436 3.13245 9.8653 3.70462 8.50674C4.27679 7.14818 5.17391 5.95096 6.31714 5.02031C7.46036 4.08966 8.81468 3.45407 10.2611 3.1694C11.7075 2.88474 13.2016 2.95971 14.6122 3.38774C16.0229 3.81576 17.3068 4.58374 18.3511 5.62416L20.9995 8.04291V5.24916C20.9995 5.05024 21.0785 4.85948 21.2192 4.71883C21.3598 4.57817 21.5506 4.49916 21.7495 4.49916C21.9484 4.49916 22.1392 4.57817 22.2799 4.71883C22.4205 4.85948 22.4995 5.05024 22.4995 5.24916Z" fill="white"/>
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleComplete}
          disabled={completing}
          className="w-[473px] mt-[40px] h-[58px] rounded-[8px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out flex items-center justify-center gap-[10px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <p className="font-medium text-xl leading-none tracking-normal text-center text-white">
            {completing ? "Completing..." : "Complete Course"}
          </p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21.5784 6.30087L8.63266 19.7856C8.55752 19.8639 8.46828 19.9261 8.37006 19.9685C8.27184 20.0109 8.16655 20.0328 8.06022 20.0328C7.95389 20.0328 7.8486 20.0109 7.75038 19.9685C7.65216 19.9261 7.56292 19.8639 7.48778 19.7856L1.82403 13.886C1.67221 13.7279 1.58691 13.5134 1.58691 13.2897C1.58691 13.0661 1.67221 12.8516 1.82403 12.6935C1.97585 12.5353 2.18176 12.4465 2.39647 12.4465C2.61118 12.4465 2.81709 12.5353 2.96891 12.6935L8.06022 17.9978L20.4335 5.10831C20.5853 4.95017 20.7912 4.86133 21.0059 4.86133C21.2206 4.86133 21.4266 4.95017 21.5784 5.10831C21.7302 5.26646 21.8155 5.48094 21.8155 5.70459C21.8155 5.92824 21.7302 6.14273 21.5784 6.30087Z"
              fill="white"
              stroke="#EEEDFC"
              strokeWidth="0.5"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
