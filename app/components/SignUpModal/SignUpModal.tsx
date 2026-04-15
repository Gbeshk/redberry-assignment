"use client";
import { useState, useEffect } from "react";
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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

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
  const [submitError, setSubmitError] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

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
    setSubmitError("");
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

  const handleAvatarChange = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setAvatarError("Only JPG, PNG, or WebP files are allowed.");
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      return;
    }
    setAvatarError("");
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX = 800;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
          setAvatar(compressed);
          setAvatarPreview(URL.createObjectURL(compressed));
        },
        "image/jpeg",
        0.8,
      );
    };
    img.src = objectUrl;
  };



  const handleSignUp = async () => {
    if (!username.trim()) return setUsernameError("Username is required.");
    if (username.length < 3)
      return setUsernameError(
        "The username field must be at least 3 characters.",
      );
    setUsernameError("");
    if (avatarError) return;
    setIsSubmitting(true);
    setSubmitError("");

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
      let data: {
        data?: { token?: string };
        errors?: { email?: string[]; username?: string[] };
      } | null = null;
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
          if (!data.errors.email && !data.errors.username)
            setSubmitError("Please check your details and try again.");
        } else {
          setSubmitError("Something went wrong. Please try again.");
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
    } catch {
      setSubmitError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

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
            <SignUpStep1
              email={email}
              emailError={emailError}
              onEmailChange={(v) => {
                setEmail(v);
                if (emailError) setEmailError("");
              }}
              onNext={handleNext}
              onSignInClick={() => {
                handleClose();
                onSignInClick?.();
              }}
            />
          )}

          {step === 2 && (
            <SignUpStep2
              password={password}
              confirmPassword={confirmPassword}
              passwordError={passwordError}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              isPasswordFocused={isPasswordFocused}
              isConfirmPasswordFocused={isConfirmPasswordFocused}
              onPasswordChange={(v) => {
                setPassword(v);
                if (passwordError) setPasswordError("");
              }}
              onConfirmPasswordChange={(v) => {
                setConfirmPassword(v);
                if (passwordError) setPasswordError("");
              }}
              onTogglePassword={() => setShowPassword((v) => !v)}
              onToggleConfirmPassword={() => setShowConfirmPassword((v) => !v)}
              onPasswordFocus={setIsPasswordFocused}
              onConfirmPasswordFocus={setIsConfirmPasswordFocused}
              onNext={handleNextPassword}
              onSignInClick={() => {
                handleClose();
                onSignInClick?.();
              }}
            />
          )}

          {step === 3 && (
            <SignUpStep3
              username={username}
              usernameError={usernameError}
              avatar={avatar}
              avatarPreview={avatarPreview}
              avatarError={avatarError}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onUsernameChange={(v) => {
                setUsername(v);
                if (usernameError) setUsernameError("");
              }}
              onAvatarChange={handleAvatarChange}
              onSubmit={handleSignUp}
              onSignInClick={() => {
                handleClose();
                onSignInClick?.();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
