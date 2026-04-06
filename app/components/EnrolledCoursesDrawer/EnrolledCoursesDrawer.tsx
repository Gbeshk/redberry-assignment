"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import StarIcon from "../icons/StarIcon";
import CalendarIcon from "../icons/CalendarIcon";
import TimeIcon from "../icons/TimeIcon";
import SessionIcon from "../icons/SessionIcon";
import SessionTypeIcon from "../icons/SessionTypeIcon";
import LocationIcon from "../icons/LocationIcon";
import EnrolmentListLocationIcon from "../icons/EnrolmentListLocationIcon";

interface Enrollment {
  id: number;
  totalPrice: number;
  progress: number;
  completedAt: string | null;
  course: {
    id: number;
    title: string;
    description: string;
    image: string;
    basePrice: number;
    durationWeeks: number;
    avgRating: number;
    reviewCount: number;
    instructor: { id: number; name: string; avatar: string };
    category: { id: number; name: string; icon: string };
  };
  schedule: {
    weeklySchedule: { id: number; label: string; days: string[] };
    timeSlot: { id: number; label: string; startTime: string; endTime: string };
    sessionType: {
      id: number;
      name: string;
      priceModifier: number;
      availableSeats: number;
      location: string;
    };
    location: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrolledCoursesDrawer({ isOpen, onClose }: Props) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    fetch("https://api.redclass.redberryinternship.ge/api/enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => setEnrollments(json.data ?? []))
      .catch(() => setError("Failed to load enrollments."))
      .finally(() => setLoading(false));
    console.log(enrollments);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      )}

      <div
        className="fixed top-0 right-0 z-50 h-full w-[794px] bg-[#F5F5F5] items-center  flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center w-[646px] h-[48px] justify-between mt-[60px] ">
          <p className="text-[#0A0A0A] font-semibold text-[40px] leading-none tracking-normal">
            Enrolled Courses
          </p>
          <p className="font-medium text-[16px] leading-[24px] tracking-normal text-[#0A0A0A]">
            Total Enrollments{" "}
            <span className="font-semibold text-[16px] leading-none tracking-normal">
              {enrollments.length}
            </span>
          </p>
        </div>

        <div className="mt-[36px]  gap-[12px] overflow-y-auto flex flex-col ">
          {loading && (
            <p className="text-[#8A8A8A] text-[16px] text-center mt-[60px]">
              Loading...
            </p>
          )}

          {error && (
            <p className="text-red-500 text-[16px] text-center mt-[60px]">
              {error}
            </p>
          )}

          {!loading && !error && enrollments.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-[100px] gap-[16px]">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#EEEDFC" />
                <path
                  d="M20 44V22a2 2 0 012-2h20a2 2 0 012 2v22l-12-6-12 6z"
                  stroke="#736BEA"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-[#8A8A8A] font-medium text-[18px]">
                No enrolled courses yet
              </p>
            </div>
          )}
          {!loading &&
            enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="w-[623px] h-[295px] rounded-[12px] bg-white p-[20px]"
              >
                <div className="flex items-center gap-[18px]">
                  <Image
                    src={enrollment.course.image}
                    width={269}
                    height={191}
                    alt="courseImg"
                    className="w-[269px] h-[191px] rounded-[10px] object-cover"
                  ></Image>
                  <div className="h-[186px] flex w-full flex-col">
                    <div className="h-[18px] w-full flex items-center justify-between">
                      <p className="text-[#8A8A8A] font-inter font-medium text-sm leading-none">
                        Instructor{" "}
                        <span className="text-[#8A8A8A]">
                          {enrollment.course.instructor.name}
                        </span>
                      </p>
                      <div className="flex gap-[4px] items-center">
                        <StarIcon />
                        <p className="font-medium text-sm leading-none tracking-normal text-[#525252]">
                          {enrollment.course.avgRating}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-[20px] leading-[24px] tracking-normal text-[#141414] w-[257px] mt-[8px] h-[48px] flex items-center">
                      {enrollment.course.title}
                    </p>
                    <div className="flex items-center h-[26px] gap-[8px] mt-[8px]">
                      <CalendarIcon />
                      <p className="text-[#666666] font-normal text-sm leading-[26px] tracking-normal]">
                        {enrollment.schedule.weeklySchedule.label}
                      </p>
                    </div>
                    <div className="flex items-center h-[26px] gap-[8px] ">
                      <TimeIcon />
                      <p className="text-[#666666] font-normal text-sm leading-[26px] tracking-normal]">
                        {enrollment.schedule.timeSlot.label}
                      </p>
                    </div>
                    <div className="flex items-center h-[26px] gap-[8px] ">
                      <SessionTypeIcon />
                      <p className="text-[#666666] font-normal text-sm leading-[26px] tracking-normal]">
                        {enrollment.schedule.sessionType.name}
                      </p>
                    </div>
                    <div className="flex items-center h-[26px] gap-[8px] ">
                      <EnrolmentListLocationIcon />
                      <p className="text-[#666666] font-normal text-sm leading-[26px] tracking-normal]">
                        {enrollment.schedule.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[48px] mt-[16px] flex items-center justify-between">
                  <div className="flex flex-col h-[39px] justify-center ml-[4px]">
                    <p className=" font-medium text-base leading-6 tracking-normal text-[#141414]">
                      {enrollment.progress}% Complete
                    </p>
                    <div className="w-[442px] h-[15px] bg-[#DDDBFA] rounded-[30px]">
                      <div
                        className="h-full bg-[#4F46E5] rounded-[30px] transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-[117px] h-[48px]  flex items-center justify-center rounded-[8px] border-[2px] border-[#958FEF]  font-medium text-base leading-6 tracking-normal text-[#4F46E5]">
                    View
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
