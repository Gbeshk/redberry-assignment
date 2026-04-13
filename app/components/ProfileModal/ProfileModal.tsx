"use client";
import { useEffect, useState } from "react";
import CloseSvg from "@/app/components/icons/CloseSvg";
import ProfileModalHeader from "./ProfileModalHeader";
import ProfileFormFields from "./ProfileFormFields";
import AvatarUploadBox from "./AvatarUploadBox";
import { useProfileModal } from "@/app/hooks/useProfileModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: ProfileModalProps) {
  const s = useProfileModal(isOpen, onClose, onProfileUpdated);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, s.profileComplete]);

  const handleClose = () => {
    if (!s.profileComplete) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[16px] relative"
        style={{ width: "460px", minHeight: "730px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="cursor-pointer absolute top-[21px] right-[12px]"
          onClick={handleClose}
        >
          <CloseSvg />
        </div>

        <div className="px-[50px] pb-[50px]">
          <p className="mt-[49px] items-center justify-center flex h-[39px] text-[#141414] font-semibold text-[32px] leading-[100%] tracking-[0%] text-center">
            Profile
          </p>

          <ProfileModalHeader
            avatar={s.avatar}
            username={s.username}
            profileComplete={s.profileComplete}
          />

          <ProfileFormFields
            fullName={s.fullName}
            email={s.email}
            mobileNumber={s.mobileNumber}
            age={s.age}
            isAgeOpen={s.isAgeOpen}
            errors={s.errors}
            onFullNameChange={s.setFullName}
            onMobileChange={s.setMobileNumber}
            onAgeChange={s.setAge}
            onAgeOpenChange={s.setIsAgeOpen}
            clearError={s.clearError}
            onBlurField={s.validateField}
          />

          <AvatarUploadBox
            avatarFile={s.avatarFile}
            avatarPreview={s.avatarPreview}
            onFileChange={s.handleAvatarChange}
          />

          {s.apiError && (
            <p className="mt-[8px] text-[12px] font-normal leading-normal text-[#F4161A]">
              {s.apiError}
            </p>
          )}

          <button
            type="button"
            onClick={s.handleUpdate}
            disabled={!s.isFormValid || s.isSubmitting}
            className="w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[16px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {s.isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ backgroundColor: "#00000060" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-[16px] p-[40px] w-[420px] flex flex-col items-center text-center">
            <p className="text-[#141414] font-semibold text-[20px] leading-[28px]">
              Your profile is incomplete
            </p>
            <p className="text-[#666666] font-medium text-[14px] leading-[22px] mt-[12px]">
              You won&apos;t be able to enroll in courses until you complete it. Close anyway?
            </p>
            <div className="flex gap-[12px] mt-[24px] w-full">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-[47px] border-[2px] border-[#958FEF] rounded-[10px] text-[#4F46E5] font-medium text-[16px] cursor-pointer hover:bg-[#281ED2] hover:text-white hover:border-[#281ED2] active:bg-[#1E169D] active:border-[#1E169D] transition-colors duration-300 ease-out focus-visible:outline-none"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => { setShowConfirm(false); onClose(); }}
                className="flex-1 h-[47px] bg-[#4F46E5] rounded-[10px] text-white font-medium text-[16px] cursor-pointer hover:bg-[#281ED2] active:bg-[#1E169D] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E169D]"
              >
                Close Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
