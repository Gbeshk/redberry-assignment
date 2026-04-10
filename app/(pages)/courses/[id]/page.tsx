"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import CourseScedule from "@/app/components/CourseSchedule/CourseScedule";
import DevelopmentSvg from "@/app/components/icons/DevelopmentSvg";
import DesignSvg from "@/app/components/icons/DesignSvg";
import MarketingSvg from "@/app/components/icons/MarketingSvg";
import BusinessSvg from "@/app/components/icons/BusinessSvg";
import DataScienceSvg from "@/app/components/icons/DataScienceSvg";
import ArrowNavigation from "@/app/components/icons/ArrowNavigation";
import { useRouter } from "next/navigation";
import WeeeksIcon from "@/app/components/icons/WeeeksIcon";
import HoursIcon from "@/app/components/icons/HoursIcon";
import BigStarIcon from "@/app/components/icons/BigStarIcon";
import SignInModal from "@/app/components/SignInModal/SignInModal";
import ProfileModal from "@/app/components/ProfileModal/ProfileModal";

interface Category {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: number;
  durationWeeks: number;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  isRated: boolean;
  reviews?: { userId: number; rating: number }[];
  category: Category;
  topic: Topic;
  instructor: Instructor;
}

export default function CourseDetailPage() {
  const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    development: <DevelopmentSvg />,
    design: <DesignSvg />,

    marketing: <MarketingSvg />,
    business: <BusinessSvg />,

    "data-science": <DataScienceSvg />,
  };
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch(`https://api.redclass.redberryinternship.ge/api/courses/${id}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const courseData = Array.isArray(data.data) ? data.data[0] : data.data;
        if (courseData && Array.isArray(courseData.reviews) && courseData.reviews.length > 0) {
          const sum = courseData.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0);
          courseData.avgRating = sum / courseData.reviews.length;
          courseData.reviewCount = courseData.reviews.length;
        } else if (courseData) {
          courseData.avgRating = 0;
          courseData.reviewCount = 0;
        }
        setCourse(courseData);
      });
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <div className="flex items-center">
        <p
          onClick={() => router.push("/")}
          className="text-[#666666] cursor-pointer font-medium text-[18px] leading-[100%] tracking-[0%] h-[22px] flex items-center w-[51px] justify-center hover:text-[#4F46E5] transition-colors duration-300 ease-out"
        >
          Home
        </p>
        <ArrowNavigation />
        <p
          onClick={() => router.push("/courses")}
          className="flex items-center ml-[10px] cursor-pointer text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%] justify-center h-[24px] hover:text-[#4F46E5] transition-colors duration-300 ease-out"
        >
          Browse
        </p>
        <ArrowNavigation />
        <p className="flex items-center ml-[10px] text-[#736BEA] font-medium text-[18px] leading-[100%] tracking-[0%] justify-center h-[24px]">
          {course.category.name}
        </p>
      </div>
      <h1 className="mt-[32px] text-[#141414]  font-semibold text-[40px] leading-none tracking-normaal">
        {course.title}
      </h1>

      <div className="w-full flex justify-between mt-[24px]">
        <div className="w-[903px] ">
          <Image
            src={course.image}
            alt="courseImg"
            width={903}
            height={474}
            className="rounded-[10px] object-cover w-[903px] h-[474px]"
          />
          <div className="mt-[16px] h-[39px]  flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <WeeeksIcon />
              <p className="flex items-center h-[17px] font-medium text-[14px] leading-none tracking-normal text-[#525252]">
                {course.durationWeeks} Weeks
              </p>
              <HoursIcon />

              <p className="flex items-center h-[17px] font-medium text-[14px] leading-none tracking-normal text-[#525252]">
                12 Weeks
              </p>
            </div>
            <div className="flex items-center">
              <BigStarIcon />

              <p className="ml-[4px] text-[#525252] font-medium text-[14px] leading-[150%] tracking-normal">
                {course.avgRating ? Number(course.avgRating).toFixed(1) : "0.0"}
              </p>
              <div className="py-[8px] h-[39px] bg-white ml-[16px] rounded-[12px] flex items-center gap-[8px] px-[12px]">
                <span className="text-[#525252]">
                  {
                    CATEGORY_ICONS[
                      course.category.name.toLowerCase().replace(" ", "-")
                    ]
                  }
                </span>
                <p className="text-[#525252] font-medium text-[14px]">
                  {course.category.name}
                </p>
              </div>
            </div>
          </div>

          {course?.instructor && (
            <div className="px-[12px] bg-white py-[8px] rounded-[12px] w-fit mt-[18px] flex items-center gap-[12px] cursor-pointer ">
              {course.instructor.avatar && (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={60}
                  height={60}
                  className="w-[30px] h-[30px] object-cover rounded-[4px]"
                />
              )}

              <p className="font-medium text-[16px] text-[#666666] leading-[24px] tracking-normal">
                {course.instructor.name}
              </p>
            </div>
          )}
          <p className="mt-[16px] text-[#8A8A8A] font-semibold text-[20px] leading-[24px] tracking-normal h-[24px] flex items-center">
            Course Description
          </p>
          <p className="text-[#8A8A8A] mt-[24px]  font-medium text-[16px] leading-[24px] tracking-normal">
            {course.description}
          </p>
        </div>
        <CourseScedule
          courseId={id as string}
          courseTitle={course.title}
          isRated={course.isRated}
          basePrice={Number(course.basePrice)}
          onSignInClick={() => setSignInModalOpen(true)}
          onCompleteProfileClick={() => setProfileModalOpen(true)}
        />
      </div>
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSuccess={() => setSignInModalOpen(false)}
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
