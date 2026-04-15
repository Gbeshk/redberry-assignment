"use client";
import AlreadyEnrolledCard from "./AlreadyEnrolledCard";
import ConflictModal from "./ConflictModal";
import AuthWarningBanner from "./AuthWarningBanner";
import WeeklyScheduleSection from "./WeeklyScheduleSection";
import TimeSlotSection from "./TimeSlotSection";
import SessionTypeSection from "./SessionTypeSection";
import PriceSummary from "./PriceSummary";
import SuccessModal from "./SuccessModal";
import CompleteProfileModal from "./CompleteProfileModal";
import { useState, useEffect } from "react";
import { useCourseSchedule } from "@/app/hooks/useCourseSchedule";

interface CourseScheduleProps {
  courseId: string;
  courseTitle: string;
  basePrice: number;
  isRated: boolean;
  onSignInClick: () => void;
  onCompleteProfileClick: () => void;
  onRatingSubmitted?: (star: number) => void;
}

export default function CourseScedule({
  courseId,
  courseTitle,
  basePrice,
  isRated,
  onSignInClick,
  onCompleteProfileClick,
  onRatingSubmitted,
}: CourseScheduleProps) {
  const s = useCourseSchedule(courseId, onSignInClick);
  const [localRated, setLocalRated] = useState(false);
  const hasRated = isRated || localRated;

  useEffect(() => {
    if (!isRated) setLocalRated(false);
  }, [isRated]);

  if (!s.enrollmentChecked) return (
    <div className="w-[530px] space-y-[12px] animate-pulse">
      <div className="h-[64px] w-full rounded-[12px] bg-[#E8E8E8]" />
      <div className="h-[64px] w-full rounded-[12px] bg-[#E8E8E8]" />
      <div className="h-[64px] w-full rounded-[12px] bg-[#E8E8E8]" />
      <div className="mt-[24px] h-[80px] w-full rounded-[12px] bg-[#E8E8E8]" />
      <div className="h-[52px] w-full rounded-[12px] bg-[#E8E8E8]" />
    </div>
  );

  if (s.isEnrolled && s.enrollmentDetail) {
    return (
      <AlreadyEnrolledCard
        enrollment={s.enrollmentDetail}
        isRated={hasRated}
        courseTitle={courseTitle}
        onRated={(star) => { setLocalRated(true); onRatingSubmitted?.(star); }}
        onUnenroll={() => {
          s.setIsEnrolled(false);
          s.setEnrollmentDetail(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="w-[530px]">
        <WeeklyScheduleSection
          weeklySchedules={s.weeklySchedules}
          loading={s.weeklySchedulesLoading}
          selectedKey={s.selectedScheduleKey}
          isOpen={s.scheduleOpen}
          onToggle={s.handleToggleSchedule}
          onSelect={s.handleScheduleClick}
        />
        <TimeSlotSection
          selectedKey={s.selectedTimeSlotKey}
          selectedScheduleId={s.selectedScheduleId}
          isOpen={s.timeSlotOpen}
          hoveredKey={s.hoveredTimeSlotKey}
          isAvailable={s.isTimeSlotAvailable}
          onToggle={s.handleToggleTimeSlot}
          onClick={s.handleTimeSlotClick}
          onHover={s.setHoveredTimeSlotKey}
        />
        <SessionTypeSection
          loading={s.sessionTypesLoading}
          selectedKey={s.selectedSessionKey}
          selectedTimeSlotId={s.selectedTimeSlotId}
          isOpen={s.sessionOpen}
          hoveredKey={s.hoveredSessionKey}
          isAvailable={s.isSessionAvailable}
          matchSession={s.matchSession}
          onToggle={s.handleToggleSession}
          onClick={s.handleSessionClick}
          onHover={s.setHoveredSessionKey}
        />
        <PriceSummary
          basePrice={basePrice}
          sessionMod={s.sessionMod}
          selectedSessionKey={s.selectedSessionKey}
          isSessionAvailable={s.isSessionAvailable}
          enrolling={s.enrolling}
          onEnroll={s.handleEnrollClick}
        />
        {!s.isLoggedIn && (
          <AuthWarningBanner
            title="Authentication Required"
            description="You need sign in to your profile before enrolling in this course."
            buttonLabel="Sign In"
            buttonWidth="w-[91px]"
            onButtonClick={onSignInClick}
          />
        )}
        {s.isLoggedIn && s.profileChecked && !s.profileComplete && (
          <AuthWarningBanner
            title="Complete Your Profile"
            description="You need to fill in your profile details before enrolling in this course."
            buttonLabel="Complete"
            buttonWidth="w-[110px]"
            onButtonClick={onCompleteProfileClick}
          />
        )}
      </div>

      {s.conflictData && (
        <ConflictModal
          conflictData={s.conflictData}
          onCancel={() => s.setConflictData(null)}
          onConfirm={async () => {
            s.setConflictData(null);
            await s.handleEnroll(true);
          }}
        />
      )}
      {s.showSuccessModal && (
        <SuccessModal courseTitle={courseTitle} onDone={s.handleSuccessDone} />
      )}
      {s.showCompleteProfileModal && (
        <CompleteProfileModal
          onClose={() => s.closeCompleteProfileModal()}
          onComplete={() => {
            s.closeCompleteProfileModal();
            onCompleteProfileClick();
          }}
        />
      )}
    </>
  );
}
