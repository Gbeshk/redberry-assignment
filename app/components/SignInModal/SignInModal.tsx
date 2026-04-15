"use client";
import { useEffect } from "react";
import CloseIcon from "@/app/components/icons/CloseIcon";
import EyeOpenIcon from "@/app/components/icons/EyeOpenIcon";
import EyeClosedIcon from "@/app/components/icons/EyeClosedIcon";
import { useSignInModal } from "@/app/hooks/useSignInModal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
  onSuccess?: () => void | Promise<void>;
}

// --- Shared style helpers ---
const inputClass = (hasError: boolean) =>
  `w-full mt-[8px] h-[48px] rounded-[8px] pl-[13px] pr-[15px] py-[12px]
   text-[14px] font-medium leading-[100%] tracking-[0%]
   focus:outline-none focus:ring-0 caret-[#8A8A8A]
   placeholder:text-[#8A8A8A] placeholder:font-medium placeholder:text-[14px]
   hover:placeholder:text-[#D1D1D1] focus:placeholder:text-[#F5F5F5]
   ${
     hasError
       ? "border-[1.5px] border-[#F4161A] text-[#F4161A]"
       : "border-[1.5px] border-[#D1D1D1] text-[#3D3D3D] hover:border-[#ADADAD] focus:border-[#8A8A8A]"
   }`;

const labelClass = (hasError: boolean) =>
  `mt-[24px] text-sm font-medium h-[17px] flex items-center${hasError ? " text-[#F4161A]" : ""}`;

const eyeColor = (hasError: boolean, isFocused: boolean) => {
  if (hasError) return "#F4161A";
  if (isFocused) return "#8A8A8A";
  return "#ADADAD";
};

function ErrorMessage({ msg }: { msg: string }) {
  return (
    <p className="error-message mt-[4px] text-[12px] font-normal leading-[100%] tracking-[0%] h-[17px] flex items-center text-[#F4161A]">
      {msg}
    </p>
  );
}

export default function SignInModal({
  isOpen,
  onClose,
  onSignUpClick,
  onSuccess,
}: SignInModalProps) {
  const s = useSignInModal(onClose, onSuccess);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") s.handleClose(); };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const passwordHasError = !!(s.passwordError || s.credentialsError);
  const emailHasError = !!(s.emailError || s.credentialsError);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={s.handleClose}
    >
      <style>{`
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .error-message { animation: errorIn 300ms ease-out; }
      `}</style>

      <div
        className="bg-white rounded-[16px] pb-[50px]"
        style={{ width: "460px", minHeight: "481px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mt-[21px] flex items-center justify-between px-[16px]">
          <div style={{ width: "16px" }} />
          <div className="cursor-pointer" onClick={s.handleClose}>
            <CloseIcon />
          </div>
        </div>

        <div className="px-[50px]">
          <p className="mt-[6px] text-center text-[#141414] font-semibold text-[32px] leading-[100%] tracking-[0%]">
            Welcome Back
          </p>
          <p className="text-[#666666] mt-[12px] font-medium text-[14px] leading-[100%] tracking-[0%] text-center">
            Log in to continue your learning
          </p>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="signin-email" className={labelClass(emailHasError)}>
              Email*
            </label>
            <input
              type="text"
              id="signin-email"
              name="email"
              placeholder="you@example.com"
              value={s.email}
              onChange={(e) => {
                s.setEmail(e.target.value);
                s.clearEmailError();
              }}
              className={inputClass(emailHasError)}
            />
            {s.emailError && <ErrorMessage msg={s.emailError} />}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="signin-password"
              className={labelClass(passwordHasError)}
            >
              Password*
            </label>
            <div className="relative">
              <input
                type={s.showPassword ? "text" : "password"}
                id="signin-password"
                name="password"
                placeholder="Password"
                value={s.password}
                onChange={(e) => {
                  s.setPassword(e.target.value);
                  s.clearPasswordError();
                }}
                onFocus={() => s.setIsPasswordFocused(true)}
                onBlur={() => s.setIsPasswordFocused(false)}
                className={`${inputClass(passwordHasError)} pr-[40px]`}
              />
              <div
                className="absolute right-[12px] top-[8px] bottom-0 flex items-center cursor-pointer"
                onClick={() => s.setShowPassword((v) => !v)}
              >
                {s.showPassword ? (
                  <EyeOpenIcon
                    color={eyeColor(passwordHasError, s.isPasswordFocused)}
                  />
                ) : (
                  <EyeClosedIcon
                    color={eyeColor(passwordHasError, s.isPasswordFocused)}
                  />
                )}
              </div>
            </div>
            {s.passwordError && <ErrorMessage msg={s.passwordError} />}
            {s.credentialsError && <ErrorMessage msg={s.credentialsError} />}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={s.handleSignIn}
            disabled={s.isSubmitting}
            className="w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[18px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {s.isSubmitting ? "Logging In..." : "Log In"}
          </button>

          {/* Divider */}
          <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
            <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
            <span className="px-[8px] text-[14px] font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
              or
            </span>
            <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
          </div>

          {/* Sign up link */}
          <div className="flex items-center justify-center mt-[8px]">
            <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
              Don&apos;t have an account?
            </p>
            <p
              onClick={() => {
                s.handleClose();
                onSignUpClick?.();
              }}
              className="text-[#141414] ml-[8px] font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
            >
              Sign Up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
