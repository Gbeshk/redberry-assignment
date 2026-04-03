"use client";
import { useEffect, useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
  onSuccess?: () => void; 
}

export default function SignInModal({
  isOpen,
  onClose,
  onSignUpClick,
  onSuccess,
}: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    setEmail("");
    setEmailError("");
    setPassword("");
    setPasswordError("");
    setShowPassword(false);
    onClose();
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address.");
        hasError = true;
      } else {
        setEmailError("");
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://api.redclass.redberryinternship.ge/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const rawText = await response.text();
      let data: unknown = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.warn("Response is not JSON");
      }

      if (!response.ok) {
        if (response.status === 422 || response.status === 401) {
          setEmailError("Invalid email or password.");
        }
        console.error(
          "Login failed — status:",
          response.status,
          "body:",
          data ?? rawText,
        );
      } else {
        console.log("Login success:", data);
        handleClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
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
        className="bg-white rounded-[16px]"
        style={{ width: "460px", height: "481px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[21px] flex items-center justify-between px-[16px]">
          <div style={{ width: "16px" }} />
          <div className="cursor-pointer" onClick={handleClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3002 5.71022C18.2077 5.61752 18.0978 5.54397 17.9768 5.49379C17.8559 5.44361 17.7262 5.41778 17.5952 5.41778C17.4643 5.41778 17.3346 5.44361 17.2136 5.49379C17.0926 5.54397 16.9827 5.61752 16.8902 5.71022L12.0002 10.5902L7.11022 5.70022C7.01764 5.60764 6.90773 5.5342 6.78677 5.4841C6.6658 5.43399 6.53615 5.4082 6.40522 5.4082C6.27429 5.4082 6.14464 5.43399 6.02368 5.4841C5.90272 5.5342 5.79281 5.60764 5.70022 5.70022C5.60764 5.79281 5.5342 5.90272 5.4841 6.02368C5.43399 6.14464 5.4082 6.27429 5.4082 6.40522C5.4082 6.53615 5.43399 6.6658 5.4841 6.78677C5.5342 6.90773 5.60764 7.01764 5.70022 7.11022L10.5902 12.0002L5.70022 16.8902C5.60764 16.9828 5.5342 17.0927 5.4841 17.2137C5.43399 17.3346 5.4082 17.4643 5.4082 17.5952C5.4082 17.7262 5.43399 17.8558 5.4841 17.9768C5.5342 18.0977 5.60764 18.2076 5.70022 18.3002C5.79281 18.3928 5.90272 18.4662 6.02368 18.5163C6.14464 18.5665 6.27429 18.5922 6.40522 18.5922C6.53615 18.5922 6.6658 18.5665 6.78677 18.5163C6.90773 18.4662 7.01764 18.3928 7.11022 18.3002L12.0002 13.4102L16.8902 18.3002C16.9828 18.3928 17.0927 18.4662 17.2137 18.5163C17.3346 18.5665 17.4643 18.5922 17.5952 18.5922C17.7262 18.5922 17.8558 18.5665 17.9768 18.5163C18.0977 18.4662 18.2076 18.3928 18.3002 18.3002C18.3928 18.2076 18.4662 18.0977 18.5163 17.9768C18.5665 17.8558 18.5922 17.7262 18.5922 17.5952C18.5922 17.4643 18.5665 17.3346 18.5163 17.2137C18.4662 17.0927 18.3928 16.9828 18.3002 16.8902L13.4102 12.0002L18.3002 7.11022C18.6802 6.73022 18.6802 6.09022 18.3002 5.71022Z"
                fill="#8A8A8A"
              />
            </svg>
          </div>
        </div>

        <div className="px-[50px]">
          <p className="mt-[6px] text-center text-[#141414] font-semibold text-[32px] leading-[100%] tracking-[0%]">
            Welcome Back
          </p>
          <p className="text-[#666666] mt-[12px] font-medium text-[14px] leading-[100%] tracking-[0%] text-center">
            Log in to continue your learning
          </p>

          <div className="flex flex-col">
            <label
              htmlFor="signin-email"
              className="mt-[24px] text-sm font-medium"
            >
              Email*
            </label>
            <input
              type="text"
              name="email"
              id="signin-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              className="mt-[8px] border-[1.5px] border-[#D1D1D1] rounded-[8px] p-[12px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] placeholder:text-[#8A8A8A] placeholder:align-middle focus:outline-none focus:ring-0"
              style={{ borderColor: emailError ? "#EF4444" : undefined }}
            />
            {emailError && (
              <p className="mt-[6px] text-[12px] font-medium text-[#EF4444]">
                {emailError}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="signin-password"
              className="text-sm font-medium"
              style={{ marginTop: emailError ? "12px" : "24px" }} 
            >
              Password*
            </label>
            <div className="relative mt-[8px]">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="signin-password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className="w-full border-[1.5px] border-[#D1D1D1] rounded-[8px] p-[12px] pr-[40px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] placeholder:text-[#8A8A8A] placeholder:align-middle focus:outline-none focus:ring-0"
                style={{ borderColor: passwordError ? "#EF4444" : undefined }}
              />
              <div
                className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.05938 11.348C0.980208 11.1235 0.980208 10.8765 1.05938 10.652C1.83045 8.68365 3.13931 7.00069 4.82002 5.81644C6.50073 4.6322 8.47759 4 10.5 4C12.5224 4 14.4993 4.6322 16.18 5.81644C17.8607 7.00069 19.1695 8.68365 19.9406 10.652C20.0198 10.8765 20.0198 11.1235 19.9406 11.348C19.1695 13.3163 17.8607 14.9993 16.18 16.1836C14.4993 17.3678 12.5224 18 10.5 18C8.47759 18 6.50073 17.3678 4.82002 16.1836C3.13931 14.9993 1.83045 13.3163 1.05938 11.348Z"
                      stroke="#ADADAD"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5002 14.0005C12.0742 14.0005 13.3501 12.6573 13.3501 11.0003C13.3501 9.34326 12.0742 8 10.5002 8C8.92631 8 7.65039 9.34326 7.65039 11.0003C7.65039 12.6573 8.92631 14.0005 10.5002 14.0005Z"
                      stroke="#ADADAD"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 9C2.85907 9.9609 3.87049 10.7965 5 11.4785M5 11.4785C6.2165 12.2111 7.57462 12.7204 9 12.9785C10.3213 13.2128 11.6787 13.2128 13 12.9785C14.4254 12.7204 15.7835 12.2111 17 11.4785M5 11.4785L3.5 13.1538M20 9C19.1409 9.9609 18.1295 10.7965 17 11.4785M17 11.4785L18.5 13.1538M9 12.9775L8.5 15M13 12.9775L13.5 15"
                      stroke="#ADADAD"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            {passwordError && (
              <p className="mt-[6px] text-[12px] font-medium text-[#EF4444]">
                {passwordError}
              </p>
            )}
          </div>
          <div
            className="w-[360px] h-[47px] bg-[#4F46E5] rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white cursor-pointer"
            style={{
              marginTop: passwordError ? "10px" : "18px",
              opacity: isSubmitting ? 0.7 : 1,
              pointerEvents: isSubmitting ? "none" : "auto",
            }}
            onClick={handleSignIn}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </div>

          <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
            <div className="flex-1 h-[1px] bg-[#D1D1D1]"></div>
            <span className="px-[8px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
              or
            </span>
            <div className="flex-1 h-[1px] bg-[#D1D1D1]"></div>
          </div>

          <div className="flex items-center justify-center mt-[8px]">
            <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
              Don&apos;t have an account?
            </p>
            <p
              className="text-[#141414] ml-[8px] font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
              onClick={() => {
                handleClose();
                onSignUpClick?.();
              }}
            >
              Sign Up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
