"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import def_img from "../../../public/images/default-course-img.png";
import { useRouter } from "next/navigation";
import StarIcon from "../icons/StarIcon";

interface Enrollment {
  id: number;
  progress: number;
  course: {
    id: number;
    title: string;
    image: string;
    avgRating: number | null;
    instructor: { id: number; name: string; avatar: string };
  };
}

export default function CurrentCourses() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsLoggedIn(true);

    fetch("https://api.redclass.redberryinternship.ge/api/enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        setEnrollments((json.data ?? []).slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const slots = isLoggedIn
    ? [
        ...enrollments,
        ...Array(Math.max(0, 3 - enrollments.length)).fill(null),
      ].slice(0, 3)
    : [null, null, null];

  const blurClasses = ["blur-[20px]", "blur-[20px]", "blur-[10px]"];
  const router = useRouter();
  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <h1 className="text-[#0A0A0A] font-semibold text-[40px] leading-[100%] tracking-[0%] h-[48px] flex items-center">
        Continue Learning
      </h1>
      <div className="flex items-center h-[22px] mt-[6px] justify-between">
        <p className="text-[#3D3D3D] font-medium text-[18px] leading-[100%] tracking-[0%]">
          Pick up where you left
        </p>
        <p className="text-[#4F46E5] font-medium text-[20px] leading-[100%] tracking-[0%] underline decoration-solid underline-offset-[3px] decoration-0">
          See All
        </p>
      </div>

      <div className="w-full mt-[32px] h-[219px] flex items-center justify-between relative">
        {!isLoggedIn && (
          <div className="absolute w-[418px] h-[233px] bg-white rounded-[12px] border-[1px] border-[#ADADAD] left-1/2 -translate-x-[calc(50%+27px)] z-10 flex items-center flex-col">
            <div className="w-[74px] h-[77px] rounded-full flex items-center justify-center bg-[#DDDBFA] mt-[26px]">
              <svg
                width="34"
                height="37"
                viewBox="0 0 34 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.8889 17H6.11111C4.39289 17 3 18.4652 3 20.2727V31.7273C3 33.5347 4.39289 35 6.11111 35H27.8889C29.6071 35 31 33.5347 31 31.7273V20.2727C31 18.4652 29.6071 17 27.8889 17Z"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 17V10.3333C9 8.1232 9.84285 6.00358 11.3431 4.44078C12.8434 2.87797 14.8783 2 17 2C19.1217 2 21.1566 2.87797 22.6569 4.44078C24.1571 6.00358 25 8.1232 25 10.3333V17"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="17" cy="25" r="2" fill="#4F46E5" />
              </svg>
            </div>
            <p className="h-[24px] flex items-center text-[#0A0836] mt-[12px] font-medium text-[16px] leading-[24px] tracking-[0%]">
              Sign in to track your learning progress
            </p>
            <div className="w-[83px] h-[42px] rounded-[8px] bg-[#4F46E5] mt-[24px] text-[#F5F5F5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center flex items-center justify-center">
              Log In
            </div>
          </div>
        )}

        {slots.map((enrollment, i) => {
          const progress = enrollment?.progress ?? 65;
          const title =
            enrollment?.course.title ??
            "Advanced React & TypeScript Development";
          const instructor =
            enrollment?.course.instructor.name ?? "Marilyn Mango";
          const rating = enrollment?.course.avgRating ?? 4.9;
          const image = enrollment?.course.image ?? def_img;
          const progressWidth = (336 * progress) / 100;

          return (
            <div
              key={i}
              className={`w-[506px] h-full bg-white rounded-[12px] p-[20px] ${!isLoggedIn ? blurClasses[i] : ""}`}
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
                      Lecturer{" "}
                      <span className="text-[#666666]">{instructor}</span>
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
                <div className="flex flex-col ">
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
                <div
                  onClick={() => {
                    router.push(`/courses/${enrollment.course.id}`);
                  }}
                  className=" cursor-pointer w-[90px] h-[48px] border-[2px] border-[#958FEF] rounded-[8px] flex items-center justify-center text-[#4F46E5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center"
                >
                  View
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
