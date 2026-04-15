"use client";
import EnrollmentCard from "./EnrollmentCard";
import SignInPromptOverlay from "./SignInPromptOverlay";
import { useCurrentCourses } from "@/app/hooks/useCurrentCourses";
import Spinner from "@/app/components/ui/Spinner";

interface CurrentCoursesProps {
  onSignInClick?: () => void;
  onSeeAllClick?: () => void;
}

export default function CurrentCourses({
  onSignInClick,
  onSeeAllClick,
}: CurrentCoursesProps) {
  const { isLoggedIn, enrollments, loading, slots } = useCurrentCourses();

  if (isLoggedIn && !loading && enrollments.length === 0) return null;

  return (
    <div className="w-[1566px] mx-auto mt-[64px]">
      <h1 className="text-[#0A0A0A] font-semibold text-[40px] leading-[100%] tracking-[0%] h-[48px] flex items-center">
        Continue Learning
      </h1>

      <div className="flex items-center h-[22px] mt-[6px] justify-between">
        <p className="text-[#3D3D3D] font-medium text-[18px] leading-[100%] tracking-[0%]">
          Pick up where you left
        </p>
        <p
          onClick={isLoggedIn ? onSeeAllClick : onSignInClick}
          className="text-[#4F46E5] font-medium text-[20px] leading-[100%] tracking-[0%] underline decoration-solid underline-offset-[3px] decoration-0 cursor-pointer"
        >
          See All
        </p>
      </div>

      <div className="w-full mt-[32px] h-[219px] flex items-center gap-[24px] relative">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <Spinner size={48} />
          </div>
        ) : (
          <>
            {!isLoggedIn && <SignInPromptOverlay onSignInClick={onSignInClick} />}
            {(isLoggedIn ? enrollments : slots).map((enrollment, i) => (
              <EnrollmentCard
                key={i}
                enrollment={enrollment}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
