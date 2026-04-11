"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EnrollmentListCard from "./EnrollmentListCard";
import EmptyEnrollments from "./EmptyEnrollments";
import { useEnrolledCourses } from "@/app/hooks/useEnrolledCourses";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrolledCoursesDrawer({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { enrollments, loading, error } = useEnrolledCourses(isOpen);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "#00000040" }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 z-50 h-full w-[794px] bg-[#F5F5F5] items-center flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center w-[646px] h-[48px] justify-between mt-[60px]">
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

        <div className="mt-[36px] gap-[12px] overflow-y-auto flex flex-col">
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
            <EmptyEnrollments
              onBrowse={() => {
                router.push("/courses");
                onClose();
              }}
            />
          )}

          {!loading &&
            enrollments.map((enrollment) => (
              <EnrollmentListCard key={enrollment.id} enrollment={enrollment} />
            ))}
        </div>
      </div>
    </>
  );
}
