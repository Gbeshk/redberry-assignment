import { useState } from "react";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const BASE = "https://api.redclass.redberryinternship.ge/api";

export function useSignInModal(
  onClose: () => void,
  onSuccess?: () => void | Promise<void>,
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [credentialsError, setCredentialsError] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setEmailError("");
    setPasswordError("");
    setCredentialsError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = (): boolean => {
    let valid = true;
    setCredentialsError("");

    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 3) {
      setPasswordError("Password must be at least 3 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data: unknown = null;
      try {
        data = JSON.parse(await response.text());
      } catch {
      }

      if (!response.ok) {
        if (response.status === 422 || response.status === 401) {
          setCredentialsError(
            (data as { message?: string })?.message ?? "Something went wrong.",
          );
        }
      } else {
        const token = (data as { data?: { token?: string } })?.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          window.dispatchEvent(new Event("auth-updated"));
        }
        handleClose();
        onSuccess?.();
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearEmailError = () => {
    if (emailError) setEmailError("");
    if (credentialsError) setCredentialsError("");
  };
  const clearPasswordError = () => {
    if (passwordError) setPasswordError("");
    if (credentialsError) setCredentialsError("");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isPasswordFocused,
    setIsPasswordFocused,
    isSubmitting,
    emailError,
    passwordError,
    credentialsError,
    clearEmailError,
    clearPasswordError,
    handleClose,
    handleSignIn,
  };
}
