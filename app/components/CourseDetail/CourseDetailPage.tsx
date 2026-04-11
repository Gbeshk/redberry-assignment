"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseScedule from "@/app/components/CourseSchedule/CourseScedule";
import SignInModal from "@/app/components/SignInModal/SignInModal";
import SignUpModal from "@/app/components/SignUpModal/SignUpModal";
import ProfileModal from "@/app/components/ProfileModal/ProfileModal";
import CourseDetailBreadcrumb from "./CourseDetailBreadcrumb";
import CourseDetailHero from "./CourseDetailHero";
import CourseDetailDescription from "./CourseDetailDescription";
import { Course } from "@/app/types/course";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`https://api.redclass.redberryinternship.ge/api/courses/${id}`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => {
        const courseData = Array.isArray(data.data) ? data.data[0] : data.data;
        if (
          courseData &&
          Array.isArray(courseData.reviews) &&
          courseData.reviews.length > 0
        ) {
          const sum = courseData.reviews.reduce(
            (acc: number, r: { rating: number }) => acc + r.rating,
            0,
          );
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
      <CourseDetailBreadcrumb categoryName={course.category.name} />

      <h1 className="mt-[32px] text-[#141414] font-semibold text-[40px] leading-none tracking-normal">
        {course.title}
      </h1>

      <div className="w-full flex justify-between mt-[24px]">
        <div className="w-[903px]">
          <CourseDetailHero course={course} />
          <CourseDetailDescription description={course.description} />
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
        onSignUpClick={() => setSignUpModalOpen(true)}
      />
      <SignUpModal
        isOpen={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSuccess={() => setSignUpModalOpen(false)}
        onSignInClick={() => { setSignUpModalOpen(false); setSignInModalOpen(true); }}
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
