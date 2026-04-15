"use client";
import { useSignUpModal } from "@/app/hooks/useSignUpModal";
import CloseSvg from "../icons/CloseSvg";
import GoBackSvg from "../icons/GoBackSvg";
import ProgressBars from "./ProgressBars";
import SignUpStep1 from "./SignUpStep1";
import SignUpStep2 from "./SignUpStep2";
import SignUpStep3 from "./SignUpStep3";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSignInClick?: () => void;
}

const MODAL_MIN_HEIGHTS: Record<number, string> = {
  1: "416px",
  2: "513px",
  3: "622px",
};

export default function SignUpModal({
  isOpen,
  onClose,
  onSuccess,
  onSignInClick,
}: SignUpModalProps) {
  const s = useSignUpModal(onClose, onSuccess);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={s.handleClose}
      onKeyDown={(e) => { if (e.key === "Escape") s.handleClose(); }}
    >
      <div
        className="bg-white rounded-[16px] relative pb-[50px]"
        style={{
          width: "460px",
          minHeight: MODAL_MIN_HEIGHTS[s.step],
          transition: "min-height 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {s.step > 1 ? (
          <div
            className="cursor-pointer absolute top-[16.5px] left-[17px]"
            onClick={() => s.setStep((prev) => prev - 1)}
          >
            <GoBackSvg />
          </div>
        ) : (
          <div style={{ width: "16px" }} />
        )}

        <div
          className="cursor-pointer absolute right-[15px] top-[20.5px]"
          onClick={s.handleClose}
        >
          <CloseSvg />
        </div>

        <div className="mt-[50px] flex flex-col items-center w-[360px] mx-auto">
          <p className="h-[39px] flex items-center text-center text-[#141414] font-semibold text-[32px] leading-[100%] tracking-[0%]">
            Create Account
          </p>
          <p className="text-[#666666] mt-[6px] h-[17px] flex items-center font-medium text-[14px] leading-[100%] tracking-[0%] text-center">
            Join and start learning today
          </p>

          <ProgressBars step={s.step} />

          {s.step === 1 && (
            <SignUpStep1
              email={s.email}
              emailError={s.emailError}
              onEmailChange={(v) => {
                s.setEmail(v);
                if (s.emailError) s.setEmailError("");
              }}
              onNext={s.handleNext}
              onSignInClick={() => {
                s.handleClose();
                onSignInClick?.();
              }}
            />
          )}

          {s.step === 2 && (
            <SignUpStep2
              password={s.password}
              confirmPassword={s.confirmPassword}
              passwordError={s.passwordError}
              showPassword={s.showPassword}
              showConfirmPassword={s.showConfirmPassword}
              isPasswordFocused={s.isPasswordFocused}
              isConfirmPasswordFocused={s.isConfirmPasswordFocused}
              onPasswordChange={(v) => {
                s.setPassword(v);
                if (s.passwordError) s.setPasswordError("");
              }}
              onConfirmPasswordChange={(v) => {
                s.setConfirmPassword(v);
                if (s.passwordError) s.setPasswordError("");
              }}
              onTogglePassword={() => s.setShowPassword((v) => !v)}
              onToggleConfirmPassword={() => s.setShowConfirmPassword((v) => !v)}
              onPasswordFocus={s.setIsPasswordFocused}
              onConfirmPasswordFocus={s.setIsConfirmPasswordFocused}
              onNext={s.handleNextPassword}
              onSignInClick={() => {
                s.handleClose();
                onSignInClick?.();
              }}
            />
          )}

          {s.step === 3 && (
            <SignUpStep3
              username={s.username}
              usernameError={s.usernameError}
              avatar={s.avatar}
              avatarPreview={s.avatarPreview}
              avatarError={s.avatarError}
              submitError={s.submitError}
              isSubmitting={s.isSubmitting}
              onUsernameChange={(v) => {
                s.setUsername(v);
                if (s.usernameError) s.setUsernameError("");
              }}
              onAvatarChange={s.handleAvatarChange}
              onSubmit={s.handleSignUp}
              onSignInClick={() => {
                s.handleClose();
                onSignInClick?.();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
