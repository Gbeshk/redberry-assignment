import { useState } from "react";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const BASE = "https://api.redclass.redberryinternship.ge/api";

export function useSignUpModal(onClose: () => void, onSuccess?: () => void) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const reset = () => {
    setStep(1);
    setEmail(""); setEmailError("");
    setPassword(""); setConfirmPassword(""); setPasswordError("");
    setShowPassword(false); setShowConfirmPassword(false);
    setUsername(""); setUsernameError("");
    setAvatar(null); setAvatarPreview(null); setAvatarError("");
    setIsSubmitting(false); setSubmitError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleNext = () => {
    if (!email.trim()) return setEmailError("Email is required.");
    if (!EMAIL_REGEX.test(email)) return setEmailError("Please enter a valid email address.");
    setEmailError("");
    setStep(2);
  };

  const handleNextPassword = () => {
    if (!password.trim()) return setPasswordError("Password is required.");
    if (password.length < 3) return setPasswordError("Password must be at least 3 characters.");
    if (password !== confirmPassword) return setPasswordError("Passwords do not match.");
    setPasswordError("");
    setStep(3);
  };

  const handleAvatarChange = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarError(
      allowed.includes(file.type) ? "" : "Only JPG, PNG, or WebP files are allowed."
    );
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setAvatarError("");
    const input = document.getElementById("avatarInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSignUp = async () => {
    if (!username.trim()) return setUsernameError("Username is required.");
    if (username.length < 3) return setUsernameError("The username field must be at least 3 characters.");
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

      const response = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      let data: { data?: { token?: string }; errors?: { email?: string[]; username?: string[] } } | null = null;
      try { data = JSON.parse(await response.text()); }
      catch { /* non-JSON */ }

      if (!response.ok) {
        if (response.status === 422 && data?.errors) {
          if (data.errors.email?.[0]) { setStep(1); setEmailError(data.errors.email[0]); }
          if (data.errors.username?.[0]) setUsernameError(data.errors.username[0]);
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
      setSubmitError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step, setStep,
    email, setEmail, emailError, setEmailError,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    passwordError, setPasswordError,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    isPasswordFocused, setIsPasswordFocused,
    isConfirmPasswordFocused, setIsConfirmPasswordFocused,
    username, setUsername, usernameError, setUsernameError,
    avatar, avatarPreview, avatarError,
    isSubmitting, submitError,
    handleClose, handleNext, handleNextPassword,
    handleSignUp, handleAvatarChange, handleAvatarRemove,
  };
}