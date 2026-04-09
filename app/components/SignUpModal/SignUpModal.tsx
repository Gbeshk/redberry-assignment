"use client";
import Image from "next/image";
import { useState } from "react";
import CloseSvg from "../icons/CloseSvg";
import GoBackSvg from "../icons/GoBackSvg";
import UploadPhotoIcon from "../icons/UploadPhotoIcon";
import ShowPassSvg from "../icons/ShowPassSvg";
import HidePassSvg from "../icons/HidePassSvg";
import { formatFileSize } from "../../utils/formatFileSize";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = (hasError: boolean) =>
  `w-full mt-[8px] h-[48px] rounded-[8px] pl-[13px] pr-[15px] py-[12px] 
   text-[14px] font-inter font-medium leading-[100%] tracking-[0%] 
   focus:outline-none focus:ring-0 caret-[#8A8A8A]
   placeholder:text-[#8A8A8A] placeholder:font-medium placeholder:text-[14px]
   hover:placeholder:text-[#D1D1D1]
   focus:placeholder:text-[#F5F5F5]
   ${
     hasError
       ? "border-[1.5px] border-[#F4161A] text-[#F4161A]"
       : "border-[1.5px] border-[#D1D1D1] text-[#3D3D3D] hover:border-[#ADADAD] focus:border-[#8A8A8A]"
   }`;
const labelClass = (hasError: boolean) =>
  `mt-[24px] text-sm font-medium h-[17px] flex items-center${hasError ? " text-[#F4161A]" : ""}`;

const iconColor = (hasError: boolean) => (hasError ? "#F4161A" : "#ADADAD");


function ErrorMessage({ msg }: { msg: string }) {
  return (
    <p className="error-message mt-[4px] text-[12px] font-normal leading-none tracking-normal h-[17px] flex items-center text-[#F4161A]">
      {msg}
    </p>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
      <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
      <span className="px-[8px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
        or
      </span>
      <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
    </div>
  );
}

function LogInRow({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center justify-center mt-[8px]">
      <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
        Already have an account?
      </p>
      <p
        className="text-[#141414] ml-[8px] decoration-skip-ink-auto font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
        onClick={onClick}
      >
        Log In
      </p>
    </div>
  );
}

function ProgressBars({ step }: { step: number }) {
  const colors = [
    step === 1 ? "#B7B3F4" : "#4F46E5",
    step === 1 ? "#EEEDFC" : step === 2 ? "#B7B3F4" : "#4F46E5",
    step <= 2 ? "#EEEDFC" : step === 3 ? "#B7B3F4" : "#4F46E5",
  ];

  return (
    <div className="flex items-center w-full justify-between mt-[24px]">
      {colors.map((color, i) => (
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
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
  const [avatarError, setAvatarError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const iconColor = (hasError: boolean, isFocused: boolean) => {
    if (hasError) return "#F4161A";
    if (isFocused) return "#8A8A8A";
    return "#ADADAD";
  };

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
    setAvatarError("");
    setIsSubmitting(false);
    onClose();
  };

  const handleNext = () => {
    if (!email.trim()) return setEmailError("Email is required.");
    if (!EMAIL_REGEX.test(email))
      return setEmailError("Please enter a valid email address.");
    setEmailError("");
    setStep(2);
  };

  const handleNextPassword = () => {
    if (!password.trim()) return setPasswordError("Password is required.");
    if (password.length < 3)
      return setPasswordError("Password must be at least 3 characters.");
    if (password !== confirmPassword)
      return setPasswordError("Passwords do not match.");
    setPasswordError("");
    setStep(3);
  };

  const handleSignUp = async () => {
    if (!username.trim()) return setUsernameError("Username is required.");
    if (username.length < 3)
      return setUsernameError(
        "The username field must be at least 3 characters.",
      );
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
      let data: { data?: { token?: string }; errors?: { email?: string[]; username?: string[] } } | null =
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
          if (data.errors.username?.[0])
            setUsernameError(data.errors.username[0]);
        }
      } else {
        const token = data?.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          window.dispatchEvent(new Event("auth-updated"));
        }
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

  const hasAvatar = !!(avatarPreview && avatar);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[16px] relative pb-[50px]"
        style={{
          width: "460px",
          minHeight: MODAL_MIN_HEIGHTS[step],
          transition: "min-height 0.3s ease",
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

          <ProgressBars step={step} />

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
                {emailError && <ErrorMessage msg={emailError} />}
              </div>
              <button
                type="button"
                className="w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[18px] cursor-pointer"
                onClick={handleNext}
              >
                Next
              </button>
              <OrDivider />
              <div className="flex items-center justify-center mt-[8px] h-[17px]">
                <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
                  Already have an account?
                </p>
                <p
                  className="text-[#141414] ml-[8px] decoration-skip-ink-auto font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
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

          {step === 2 && (
            <>
              {/* Password */}
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
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <div
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer mt-[4px]"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <ShowPassSvg
                        color={iconColor(!!passwordError, isPasswordFocused)}
                      />
                    ) : (
                      <HidePassSvg
                        color={iconColor(!!passwordError, isPasswordFocused)}
                      />
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
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                  />
                  <div
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer mt-[4px]"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
                      <ShowPassSvg
                        color={iconColor(
                          !!passwordError,
                          isConfirmPasswordFocused,
                        )}
                      />
                    ) : (
                      <HidePassSvg
                        color={iconColor(
                          !!passwordError,
                          isConfirmPasswordFocused,
                        )}
                      />
                    )}
                  </div>
                </div>
                {passwordError && <ErrorMessage msg={passwordError} />}
              </div>

              <button
                type="button"
                className="w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[16px] cursor-pointer"
                onClick={handleNextPassword}
              >
                Next
              </button>
              <OrDivider />
              <LogInRow
                onClick={() => {
                  handleClose();
                  onSignInClick?.();
                }}
              />
            </>
          )}

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
                {usernameError && <ErrorMessage msg={usernameError} />}
              </div>

              <div className="flex flex-col w-full">
                <label className="mt-[24px] text-sm font-medium">
                  Upload Avatar
                </label>
                <div
                  className="avatar-upload-box mt-[8px] rounded-[8px] flex items-center justify-center cursor-pointer overflow-hidden"
                  style={{
                    width: "360px",
                    height: "140px",
                    border: hasAvatar
                      ? "1.5px solid #DDDBFA"
                      : "1.5px solid #D1D1D1",
                    backgroundColor: hasAvatar ? "#EEEDFC" : "transparent",
                  }}
                  onClick={() =>
                    document.getElementById("avatarInput")?.click()
                  }
                >
                  {hasAvatar ? (
                    <div className="w-[240px] h-[54px] flex items-center gap-[10px]">
                      <Image
                        src={avatarPreview!}
                        alt="Avatar preview"
                        className="w-[54px] h-[54px] rounded-[40px] object-cover flex-shrink-0"
                        width={54}
                        height={54}
                      />
                      <div className="h-[41px] min-w-0 flex-1">
                        <p className="text-[#525252] h-[15px] flex items-center font-normal text-xs leading-none tracking-normal overflow-hidden">
                          <span className="truncate block max-w-[140px]">
                            {avatar!.name}
                          </span>
                        </p>
                        <p className="text-[#ADADAD] font-normal text-[10px] leading-none tracking-normal h-[12px] flex items-center">
                          Size — {formatFileSize(avatar!.size)}
                        </p>
                        <p
                          className="h-[12px] flex items-center mt-[2px] text-[#4F46E5] font-medium text-[10px] leading-none tracking-normal underline decoration-solid underline-offset-[25%] decoration-[0px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("avatarInput")?.click();
                          }}
                        >
                          Change
                        </p>
                      </div>
                    </div>
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
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const allowed = ["image/jpeg", "image/png", "image/webp"];
                      if (!allowed.includes(file.type)) {
                        setAvatarError("Only JPG, PNG, or WebP files are allowed.");
                        e.target.value = "";
                        return;
                      }
                      setAvatarError("");
                      setAvatar(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
                {avatarError && <ErrorMessage msg={avatarError} />}
              </div>

              <button
                type="button"
                className="w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[18px] cursor-pointer"
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  pointerEvents: isSubmitting ? "none" : "auto",
                }}
                onClick={handleSignUp}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
              <OrDivider />
              <LogInRow
                onClick={() => {
                  handleClose();
                  onSignInClick?.();
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
