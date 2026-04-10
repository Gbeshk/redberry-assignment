"use client";
import { useState, useEffect } from "react";
import Calendar from "../icons/Calendar";
import Location from "../icons/Location";
import Online from "../icons/Online";
import Hybrid from "../icons/Hybrid";
import InPerson from "../icons/InPerson";
import SmallTimeIcon from "../icons/SmallTimeIcon";
import CongratulateIcon from "../icons/CongratulateIcon";

interface EnrollmentDetail {
  id: number;
  progress: number;
  isRated?: boolean;
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
  isRated,
  courseTitle,
  onUnenroll,
}: {
  enrollment: EnrollmentDetail;
  isRated: boolean;
  courseTitle: string;
  onUnenroll: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(enrollment.progress >= 100);
  const [showCongrats, setShowCongrats] = useState(false);
  useEffect(() => {
    document.body.style.overflow = showCongrats ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCongrats]);
  const [completing, setCompleting] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(isRated);

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

  const handleRate = (star: number) => {
    if (ratingSubmitted) return;
    setRating(star);
  };

  const handleDone = async () => {
    if (rating !== null && !ratingSubmitted) {
      setIsRating(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `https://api.redclass.redberryinternship.ge/api/courses/${enrollment.course?.id}/reviews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({ rating }),
          },
        );
        if (res.ok || res.status === 409) {
          setRatingSubmitted(true);
        }
      } catch {
      } finally {
        setIsRating(false);
      }
    }
    setShowCongrats(false);
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
      if (res.ok) {
        setIsCompleted(true);
        setShowCongrats(true);
      }
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

      {isCompleted && (
        <div className="mt-[32px]">
          {ratingSubmitted ? (
            <p className="text-[#736BEA] font-medium text-[16px] leading-none tracking-normal">
              You've already rated this course
            </p>
          ) : (
            <>
              <p className="text-[#666666] font-medium text-[16px] leading-none tracking-normal mb-[12px]">
                Rate this course
              </p>
              <div className="flex gap-[8px]">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= (hoverRating ?? 0);
                  return (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform duration-150 cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:scale-110"
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill={filled ? "#F4A316" : "#D1D1D1"}
                          stroke={filled ? "#F4A316" : "#D1D1D1"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.4995 5.24916V9.74916C22.4995 9.94807 22.4205 10.1388 22.2799 10.2795C22.1392 10.4201 21.9484 10.4992 21.7495 10.4992H17.2495C17.0506 10.4992 16.8598 10.4201 16.7192 10.2795C16.5785 10.1388 16.4995 9.94807 16.4995 9.74916C16.4995 9.55024 16.5785 9.35948 16.7192 9.21883C16.8598 9.07818 17.0506 8.99916 17.2495 8.99916H19.8183L17.3255 6.71541L17.302 6.69291C16.2596 5.65087 14.9332 4.93908 13.4886 4.64648C12.044 4.35388 10.5452 4.49342 9.17942 5.04769C7.81365 5.60195 6.64148 6.54636 5.80934 7.76293C4.97719 8.97951 4.52196 10.4143 4.50052 11.8881C4.47907 13.3619 4.89237 14.8093 5.68877 16.0496C6.48517 17.2899 7.62937 18.268 8.97843 18.8617C10.3275 19.4555 11.8216 19.6386 13.2741 19.3881C14.7266 19.1377 16.0731 18.4648 17.1455 17.4535C17.29 17.3168 17.483 17.2431 17.682 17.2486C17.8809 17.2541 18.0695 17.3385 18.2062 17.4831C18.343 17.6276 18.4167 17.8206 18.4112 18.0196C18.4056 18.2185 18.3213 18.4071 18.1767 18.5438C16.5093 20.1252 14.2975 21.0043 11.9995 20.9992H11.8758C10.4018 20.979 8.9553 20.597 7.66349 19.8869C6.37167 19.1768 5.27406 18.1602 4.46714 16.9265C3.66021 15.6929 3.16866 14.2799 3.03571 12.8117C2.90275 11.3436 3.13245 9.8653 3.70462 8.50674C4.27679 7.14818 5.17391 5.95096 6.31714 5.02031C7.46036 4.08966 8.81468 3.45407 10.2611 3.1694C11.7075 2.88474 13.2016 2.95971 14.6122 3.38774C16.0229 3.81576 17.3068 4.58374 18.3511 5.62416L20.9995 8.04291V5.24916C20.9995 5.05024 21.0785 4.85948 21.2192 4.71883C21.3598 4.57817 21.5506 4.49916 21.7495 4.49916C21.9484 4.49916 22.1392 4.57817 22.2799 4.71883C22.4205 4.85948 22.4995 5.05024 22.4995 5.24916Z"
              fill="white"
            />
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
      {showCongrats && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#00000040" }}
          onClick={() => setShowCongrats(false)}
        >
          <div
            className="bg-white w-[460px] rounded-[16px] p-[50px] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CongratulateIcon />
            <p className=" font-semibold text-3xl leading-none tracking-normal h-[39px] flex items-center text-center text-[#3D3D3D] mt-[24px]">
              Congratulations!
            </p>
            <p className=" font-medium text-xl leading-none tracking-normal text-center text-[#3D3D3D] mt-[24px]">
              {"You've completed "}
              <span className="font-semibold">{`"${courseTitle}"`}</span>
              {" Course!"}
            </p>
            {ratingSubmitted ? (
              <p className="mt-[40px] font-medium text-[16px] leading-[24px] tracking-[0] text-center text-[#736BEA]">
                You've already rated this course
              </p>
            ) : (
              <>
                <p className="mt-[40px] font-medium text-[16px] leading-[24px] tracking-[0] text-center text-[#736BEA]">
                  Rate your experience
                </p>
                <div className="flex gap-[8px] mt-[16px]">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating ?? rating;
                    const full =
                      activeRating !== null ? star <= activeRating : star <= 2;
                    const half = activeRating === null && star === 3;
                    return (
                      <button
                        key={star}
                        type="button"
                        className="transition-transform duration-150 cursor-pointer hover:scale-110 focus-visible:outline-none"
                        onClick={() => handleRate(star)}
                        onMouseEnter={() =>
                          !ratingSubmitted && setHoverRating(star)
                        }
                        onMouseLeave={() =>
                          !ratingSubmitted && setHoverRating(null)
                        }
                      >
                        {full ? (
                          <svg
                            width="46"
                            height="46"
                            viewBox="0 0 46 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M29.8807 14.6595C30.0224 14.9614 30.3053 15.1728 30.6349 15.2231L44.0762 17.2764C44.8808 17.3993 45.2093 18.3807 44.6409 18.9633L34.8524 28.9962C34.6308 29.2233 34.5302 29.5422 34.5813 29.8555L36.8833 43.9676C37.0177 44.7914 36.1431 45.4076 35.4126 45.0037L23.4838 38.41C23.1827 38.2436 22.8173 38.2436 22.5162 38.41L10.5874 45.0037C9.85685 45.4076 8.9823 44.7914 9.1167 43.9676L11.4187 29.8555C11.4698 29.5422 11.3692 29.2233 11.1476 28.9962L1.35906 18.9633C0.790657 18.3807 1.11922 17.3993 1.92382 17.2764L15.3651 15.2231C15.6947 15.1728 15.9776 14.9614 16.1193 14.6595L22.0948 1.92862C22.4547 1.16181 23.5453 1.16181 23.9052 1.92862L29.8807 14.6595Z"
                              fill="#F4A316"
                            />
                          </svg>
                        ) : half ? (
                          <svg
                            width="46"
                            height="46"
                            viewBox="0 0 46 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22.0947 1.92862C22.4546 1.16182 23.5453 1.16181 23.9052 1.92862L29.8806 14.6592C30.0223 14.9611 30.3052 15.1725 30.6348 15.2229L44.0762 17.2765C44.8808 17.3994 45.2093 18.3808 44.6409 18.9634L34.8524 28.9958C34.6308 29.223 34.5301 29.5419 34.5812 29.8552L36.8832 43.9675C37.0176 44.7914 36.143 45.4076 35.4125 45.0037L23.4838 38.4097C23.1827 38.2433 22.8172 38.2433 22.5162 38.4097L10.5875 45.0037C9.85689 45.4076 8.98233 44.7914 9.11671 43.9675L11.4187 29.8552C11.4698 29.5419 11.3692 29.223 11.1475 28.9958L1.35904 18.9634C0.79063 18.3808 1.11917 17.3994 1.92376 17.2765L15.3651 15.2229C15.6947 15.1725 15.9776 14.9611 16.1193 14.6592L22.0947 1.92862Z"
                              fill="#F4A316"
                              fillOpacity="0.4"
                            />
                            <mask
                              id="path-2-outside-1_8515_276"
                              maskUnits="userSpaceOnUse"
                              x="0.073761"
                              y="0.111328"
                              width="46"
                              height="46"
                              fill="black"
                            >
                              <rect
                                fill="white"
                                x="0.073761"
                                y="0.111328"
                                width="46"
                                height="46"
                              />
                              <path d="M22.0948 1.68643C22.4547 0.919628 23.5453 0.919627 23.9052 1.68643L29.8807 14.417C30.0224 14.7189 30.3052 14.9303 30.6349 14.9807L44.0762 17.0343C44.8808 17.1573 45.2093 18.1386 44.6409 18.7212L34.8524 28.7536C34.6308 28.9808 34.5301 29.2997 34.5812 29.613L36.8832 43.7254C37.0176 44.5492 36.1431 45.1654 35.4125 44.7615L23.4838 38.1675C23.1827 38.0011 22.8173 38.0011 22.5162 38.1675L10.5875 44.7615C9.85692 45.1654 8.98236 44.5492 9.11674 43.7254L11.4187 29.613C11.4698 29.2997 11.3692 28.9808 11.1475 28.7536L1.35907 18.7212C0.790661 18.1386 1.1192 17.1573 1.92379 17.0343L15.3651 14.9807C15.6948 14.9303 15.9776 14.7189 16.1193 14.417L22.0948 1.68643Z" />
                            </mask>
                            <path
                              d="M22.0948 1.68643C22.4547 0.919628 23.5453 0.919627 23.9052 1.68643L29.8807 14.417C30.0224 14.7189 30.3052 14.9303 30.6349 14.9807L44.0762 17.0343C44.8808 17.1573 45.2093 18.1386 44.6409 18.7212L34.8524 28.7536C34.6308 28.9808 34.5301 29.2997 34.5812 29.613L36.8832 43.7254C37.0176 44.5492 36.1431 45.1654 35.4125 44.7615L23.4838 38.1675C23.1827 38.0011 22.8173 38.0011 22.5162 38.1675L10.5875 44.7615C9.85692 45.1654 8.98236 44.5492 9.11674 43.7254L11.4187 29.613C11.4698 29.2997 11.3692 28.9808 11.1475 28.7536L1.35907 18.7212C0.790661 18.1386 1.1192 17.1573 1.92379 17.0343L15.3651 14.9807C15.6948 14.9303 15.9776 14.7189 16.1193 14.417L22.0948 1.68643Z"
                              fill="#F5F5F5"
                            />
                            <path
                              d="M10.5875 44.7614L22.5162 38.1674C22.6624 38.0866 22.8237 38.045 22.9855 38.0427V1.11133C22.6277 1.11636 22.2723 1.30803 22.0948 1.68633L16.1193 14.4169C15.9776 14.7188 15.6948 14.9302 15.3651 14.9806L1.92379 17.0342C1.1192 17.1572 0.790661 18.1385 1.35907 18.7211L11.1475 28.7535C11.3692 28.9807 11.4698 29.2996 11.4187 29.6129L9.11674 43.7253C8.98236 44.5491 9.85692 45.1653 10.5875 44.7614Z"
                              fill="#F4A316"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="46"
                            height="46"
                            viewBox="0 0 46 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id={`empty-star-${star}`}
                              maskUnits="userSpaceOnUse"
                              x="0.0737305"
                              y="0.353516"
                              width="46"
                              height="46"
                              fill="black"
                            >
                              <rect
                                fill="white"
                                x="0.0737305"
                                y="0.353516"
                                width="46"
                                height="46"
                              />
                              <path d="M22.0947 1.92862C22.4546 1.16182 23.5453 1.16181 23.9052 1.92862L29.8806 14.6592C30.0223 14.9611 30.3052 15.1725 30.6348 15.2229L44.0762 17.2765C44.8808 17.3994 45.2093 18.3808 44.6409 18.9634L34.8524 28.9958C34.6308 29.223 34.5301 29.5419 34.5812 29.8552L36.8832 43.9675C37.0176 44.7914 36.143 45.4076 35.4125 45.0037L23.4838 38.4097C23.1827 38.2433 22.8172 38.2433 22.5162 38.4097L10.5875 45.0037C9.85689 45.4076 8.98233 44.7914 9.11671 43.9675L11.4187 29.8552C11.4698 29.5419 11.3692 29.223 11.1475 28.9958L1.35904 18.9634C0.79063 18.3808 1.11917 17.3994 1.92376 17.2765L15.3651 15.2229C15.6947 15.1725 15.9776 14.9611 16.1193 14.6592L22.0947 1.92862Z" />
                            </mask>
                            <path
                              d="M22.0947 1.92862C22.4546 1.16182 23.5453 1.16181 23.9052 1.92862L29.8806 14.6592C30.0223 14.9611 30.3052 15.1725 30.6348 15.2229L44.0762 17.2765C44.8808 17.3994 45.2093 18.3808 44.6409 18.9634L34.8524 28.9958C34.6308 29.223 34.5301 29.5419 34.5812 29.8552L36.8832 43.9675C37.0176 44.7914 36.143 45.4076 35.4125 45.0037L23.4838 38.4097C23.1827 38.2433 22.8172 38.2433 22.5162 38.4097L10.5875 45.0037C9.85689 45.4076 8.98233 44.7914 9.11671 43.9675L11.4187 29.8552C11.4698 29.5419 11.3692 29.223 11.1475 28.9958L1.35904 18.9634C0.79063 18.3808 1.11917 17.3994 1.92376 17.2765L15.3651 15.2229C15.6947 15.1725 15.9776 14.9611 16.1193 14.6592L22.0947 1.92862Z"
                              fill="#F5F5F5"
                            />
                            <path
                              d="M15.3651 15.2229L15.4406 15.7171L15.3651 15.2229ZM1.92376 17.2765L1.84825 16.7822L1.92376 17.2765ZM11.1475 28.9958L11.5054 28.6466L11.1475 28.9958ZM10.5875 45.0037L10.3456 44.5661L10.5875 45.0037ZM9.11671 43.9675L8.62324 43.8871L9.11671 43.9675ZM23.4838 38.4097L23.7256 37.9721L23.4838 38.4097ZM22.5162 38.4097L22.2743 37.9721L22.5162 38.4097ZM36.8832 43.9675L36.3897 44.048L36.8832 43.9675ZM35.4125 45.0037L35.1706 45.4413L35.4125 45.0037ZM34.8524 28.9958L35.2103 29.345L34.8524 28.9958ZM34.5812 29.8552L35.0747 29.7747L34.5812 29.8552ZM44.0762 17.2765L44.0006 17.7708L44.0762 17.2765ZM44.6409 18.9634L44.283 18.6142L44.6409 18.9634ZM30.6348 15.2229L30.5593 15.7171L30.6348 15.2229ZM22.0947 1.92862L21.6421 1.71617L22.0947 1.92862ZM23.9052 1.92862L23.4526 2.14107L29.428 14.8717L29.8806 14.6592L30.3333 14.4468L24.3578 1.71617L23.9052 1.92862ZM30.6348 15.2229L30.5593 15.7171L44.0006 17.7708L44.0762 17.2765L44.1517 16.7822L30.7104 14.7286L30.6348 15.2229ZM44.6409 18.9634L44.283 18.6142L34.4945 28.6466L34.8524 28.9958L35.2103 29.345L44.9988 19.3126L44.6409 18.9634ZM34.5812 29.8552L34.0877 29.9356L36.3897 44.048L36.8832 43.9675L37.3767 43.8871L35.0747 29.7747L34.5812 29.8552ZM35.4125 45.0037L35.6544 44.5661L23.7256 37.9721L23.4838 38.4097L23.2419 38.8473L35.1706 45.4413L35.4125 45.0037ZM22.5162 38.4097L22.2743 37.9721L10.3456 44.5661L10.5875 45.0037L10.8294 45.4413L22.7581 38.8473L22.5162 38.4097ZM9.11671 43.9675L9.61019 44.048L11.9122 29.9356L11.4187 29.8552L10.9252 29.7747L8.62324 43.8871L9.11671 43.9675ZM11.1475 28.9958L11.5054 28.6466L1.71692 18.6142L1.35904 18.9634L1.00116 19.3126L10.7896 29.345L11.1475 28.9958ZM1.92376 17.2765L1.99928 17.7708L15.4406 15.7171L15.3651 15.2229L15.2896 14.7286L1.84825 16.7822L1.92376 17.2765ZM16.1193 14.6592L16.5719 14.8717L22.5473 2.14107L22.0947 1.92862L21.6421 1.71617L15.6667 14.4468L16.1193 14.6592ZM15.3651 15.2229L15.4406 15.7171C15.9351 15.6416 16.3594 15.3245 16.5719 14.8717L16.1193 14.6592L15.6667 14.4468C15.5958 14.5977 15.4544 14.7034 15.2896 14.7286L15.3651 15.2229ZM1.35904 18.9634L1.71692 18.6142C1.43271 18.3229 1.59698 17.8322 1.99928 17.7708L1.92376 17.2765L1.84825 16.7822C0.641352 16.9666 0.148546 18.4387 1.00116 19.3126L1.35904 18.9634ZM11.4187 29.8552L11.9122 29.9356C11.9888 29.4658 11.8379 28.9874 11.5054 28.6466L11.1475 28.9958L10.7896 29.345C10.9005 29.4586 10.9508 29.618 10.9252 29.7747L11.4187 29.8552ZM10.5875 45.0037L10.3456 44.5661C9.98028 44.7681 9.543 44.46 9.61019 44.048L9.11671 43.9675L8.62324 43.8871C8.42165 45.1229 9.7335 46.0471 10.8294 45.4413L10.5875 45.0037ZM23.4838 38.4097L23.7256 37.9721C23.2741 37.7225 22.7259 37.7225 22.2743 37.9721L22.5162 38.4097L22.7581 38.8473C22.9086 38.7641 23.0913 38.7641 23.2419 38.8473L23.4838 38.4097ZM36.8832 43.9675L36.3897 44.048C36.4569 44.46 36.0196 44.7681 35.6544 44.5661L35.4125 45.0037L35.1706 45.4413C36.2664 46.0471 37.5783 45.1229 37.3767 43.8871L36.8832 43.9675ZM34.8524 28.9958L34.4945 28.6466C34.1621 28.9874 34.0111 29.4658 34.0877 29.9356L34.5812 29.8552L35.0747 29.7747C35.0491 29.618 35.0995 29.4586 35.2103 29.345L34.8524 28.9958ZM44.0762 17.2765L44.0006 17.7708C44.4029 17.8322 44.5672 18.3229 44.283 18.6142L44.6409 18.9634L44.9988 19.3126C45.8514 18.4387 45.3586 16.9666 44.1517 16.7822L44.0762 17.2765ZM29.8806 14.6592L29.428 14.8717C29.6406 15.3245 30.0648 15.6416 30.5593 15.7171L30.6348 15.2229L30.7104 14.7286C30.5455 14.7034 30.4041 14.5977 30.3333 14.4468L29.8806 14.6592ZM23.9052 1.92862L24.3578 1.71617C23.8179 0.565964 22.182 0.565965 21.6421 1.71617L22.0947 1.92862L22.5473 2.14107C22.7273 1.75767 23.2726 1.75767 23.4526 2.14107L23.9052 1.92862Z"
                              fill="#D1D1D1"
                              mask={`url(#empty-star-${star})`}
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <button
              type="button"
              onClick={handleDone}
              className="w-full h-[47px] mt-[32px] rounded-[10px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out text-white font-medium text-[16px] leading-[24px] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
