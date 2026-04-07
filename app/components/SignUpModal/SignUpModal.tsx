"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import CloseSvg from "../icons/CloseSvg";
import GoBackSvg from "../icons/GoBackSvg";
import UploadPhotoIcon from "../icons/UploadPhotoIcon";
import ShowPassSvg from "../icons/ShowPassSvg";
import HidePassSvg from "../icons/HidePassSvg";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSignInClick?: () => void;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSuccess,
  onSignInClick,
}: SignUpModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setEmailError("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUsername("");
    setUsernameError("");
    setAvatar(null);
    setAvatarPreview(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleNext = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setStep(2);
  };

  const handleSignUp = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required.");
      return;
    }
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      return;
    }
    setUsernameError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword);
      if (avatar) formData.append("avatar", avatar);

      const response = await fetch(
        "https://api.redclass.redberryinternship.ge/api/register",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        },
      );

      const rawText = await response.text();
      let data: { errors?: { email?: string[]; username?: string[] } } | null =
        null;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.warn("Response is not JSON");
      }

      if (!response.ok) {
        if (response.status === 422 && data?.errors) {
          if (data.errors.email?.[0]) {
            setStep(1);
            setEmailError(data.errors.email[0]);
          }
          if (data.errors.username?.[0]) {
            setUsernameError(data.errors.username[0]);
          }
        }
      } else {
        handleClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const bar1 = step === 1 ? "#B7B3F4" : "#4F46E5";
  const bar2 = step === 1 ? "#EEEDFC" : step === 2 ? "#B7B3F4" : "#4F46E5";
  const bar3 = step <= 2 ? "#EEEDFC" : step === 3 ? "#B7B3F4" : "#4F46E5";

  // Reusable input className builder
  const inputClass = (hasError: boolean) =>
    `w-full mt-[8px] border-[1.5px] h-[48px] rounded-[8px] pl-[13px] pr-[15px] py-[12px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] focus:outline-none focus:ring-0 caret-[#8A8A8A]
  ${
    hasError
      ? "border-[#F4161A] text-[#F4161A] placeholder:text-[#8A8A8A]"
      : "border-[#D1D1D1] text-[#3D3D3D] placeholder:text-[#8A8A8A] focus:border-[#8A8A8A]"
  }`;
  const labelClass = (hasError: boolean) =>
    `mt-[24px] text-sm font-medium h-[17px] flex items-center ${hasError ? "text-[#F4161A]" : ""}`;

  const errorMsg = (msg: string) => (
    <p className="error-message mt-[4px] text-[12px] font-normal leading-none tracking-normal h-[17px] flex items-center text-[#F4161A]">
      {msg}
    </p>
  );

  const iconColor = (hasError: boolean) => (hasError ? "#F4161A" : "#ADADAD");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .error-message { animation: errorIn 300ms ease-out; }
      `}</style>

      <div
        className="bg-white rounded-[16px] relative"
        style={{
          width: "460px",
          height: step === 1 ? "416px" : step === 2 ? "513px" : "623px",
          transition: "height 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step > 1 ? (
          <div
            className="cursor-pointer absolute top-[16.5px] left-[17px]"
            onClick={() => setStep((s) => s - 1)}
          >
            <GoBackSvg />
          </div>
        ) : (
          <div style={{ width: "16px" }} />
        )}
        <div
          className="cursor-pointer absolute right-[15px] top-[20.5px]"
          onClick={handleClose}
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

          <div className="flex items-center w-full justify-between mt-[24px]">
            {[bar1, bar2, bar3].map((color, i) => (
              <div
                key={i}
                className="w-[114px] h-[8px] rounded-[30px]"
                style={{
                  backgroundColor: color,
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div className="flex flex-col w-full">
                <label htmlFor="email" className={labelClass(!!emailError)}>
                  Email*
                </label>
                <input
                  type="text"
                  name="Email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={inputClass(!!emailError)}
                />
                {emailError && errorMsg(emailError)}
              </div>
              <div
                className="w-[360px] h-[47px] bg-[#4F46E5] rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[18px] cursor-pointer"
                onClick={handleNext}
              >
                Next
              </div>
              <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
                <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
                <span className="px-[8px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
                  or
                </span>
                <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
              </div>
              <div className="flex items-center justify-center mt-[8px] h-[17px]">
                <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
                  Already have an account?
                </p>
                <p
                  className="text-[#141414] ml-[8px]   decoration-skip-ink-auto font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
                  onClick={() => {
                    handleClose();
                    onSignInClick?.();
                  }}
                >
                  Log In
                </p>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="password"
                  className={labelClass(!!passwordError)}
                >
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className={`${inputClass(!!passwordError)} pr-[40px]`}
                  />
                  <div
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <ShowPassSvg color={iconColor(!!passwordError)} />
                    ) : (
                      <HidePassSvg color={iconColor(!!passwordError)} />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="confirmPassword"
                  className={labelClass(!!passwordError)}
                >
                  Confirm Password*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className={`${inputClass(!!passwordError)} pr-[40px]`}
                  />
                  <div
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
                      <ShowPassSvg color={iconColor(!!passwordError)} />
                    ) : (
                      <HidePassSvg color={iconColor(!!passwordError)} />
                    )}
                  </div>
                </div>
                {passwordError && errorMsg(passwordError)}
              </div>
              <div
                className="w-[360px] h-[47px] bg-[#4F46E5] rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[16px] cursor-pointer"
                onClick={() => {
                  if (!password.trim()) {
                    setPasswordError("Password is required.");
                    return;
                  }
                  if (password.length < 3) {
                    setPasswordError("Password must be at least 3 characters.");
                    return;
                  }
                  if (password !== confirmPassword) {
                    setPasswordError("Passwords do not match.");
                    return;
                  }
                  setPasswordError("");
                  setStep(3);
                }}
              >
                Next
              </div>
              <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
                <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
                <span className="px-[8px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
                  or
                </span>
                <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
              </div>
              <div className="flex items-center justify-center mt-[8px]">
                <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
                  Already have an account?
                </p>
                <p
                  className="text-[#141414] ml-[8px]   decoration-skip-ink-auto font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
                  onClick={() => {
                    handleClose();
                    onSignInClick?.();
                  }}
                >
                  Log In
                </p>
              </div>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="username"
                  className={labelClass(!!usernameError)}
                >
                  Username*
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  className={inputClass(!!usernameError)}
                />
                {usernameError && errorMsg(usernameError)}
              </div>
              <div className="flex flex-col w-full">
                <label className="mt-[24px] text-sm font-medium">
                  Upload Avatar
                </label>
                <div
                  className="mt-[8px] border-[1.5px] border-[#D1D1D1] rounded-[8px] flex items-center justify-center cursor-pointer overflow-hidden"
                  style={{ width: "360px", height: "140px" }}
                  onClick={() =>
                    document.getElementById("avatarInput")?.click()
                  }
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadPhotoIcon />
                      <p className="mt-[8px] text-[#666666] font-medium text-sm leading-none">
                        Drag and drop or{" "}
                        <span className="text-[#281ED2] underline decoration-solid underline-offset-[25%]">
                          Upload file
                        </span>
                      </p>
                      <p className="text-[#ADADAD] mt-[8px] font-normal text-xs leading-none">
                        JPG, PNG or WebP
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setAvatar(file);
                      if (file) setAvatarPreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>
              <div
                className="w-[360px] h-[47px] bg-[#4F46E5] rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[18px] cursor-pointer"
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  pointerEvents: isSubmitting ? "none" : "auto",
                }}
                onClick={handleSignUp}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </div>
              <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
                <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
                <span className="px-[8px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
                  or
                </span>
                <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
              </div>
              <div className="flex items-center justify-center mt-[8px]">
                <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
                  Already have an account?
                </p>
                <p
                  className="text-[#141414] ml-[8px]   decoration-skip-ink-auto font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
                  onClick={() => {
                    handleClose();
                    onSignInClick?.();
                  }}
                >
                  Log In
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
