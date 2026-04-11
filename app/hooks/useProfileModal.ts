import { useState, useEffect } from "react";

const BASE = "https://api.redclass.redberryinternship.ge/api";

export interface ProfileFormErrors {
  fullName: string;
  mobile: string;
  age: string;
}

export function useProfileModal(
  isOpen: boolean,
  onClose: () => void,
  onProfileUpdated?: () => void,
) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgeOpen, setIsAgeOpen] = useState(false);
  const [errors, setErrors] = useState<ProfileFormErrors>({
    fullName: "",
    mobile: "",
    age: "",
  });

  // Fetch profile on open
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("authToken");
    fetch(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((json) => {
        const u = json.data?.user ?? json.data;
        setFullName(u.fullName ?? "");
        setEmail(u.email ?? "");
        setUsername(u.username ?? "");
        setMobileNumber(u.mobileNumber ?? "");
        setAge(u.age ? String(u.age) : "");
        setAvatar(u.avatar ?? null);
        setProfileComplete(u.profileComplete ?? false);
      })
      .catch(() => {});
  }, [isOpen]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const next: ProfileFormErrors = { fullName: "", mobile: "", age: "" };
    let valid = true;

    if (!fullName.trim()) {
      next.fullName = "Name is required";
      valid = false;
    } else if (fullName.trim().length < 3) {
      next.fullName = "Name must be at least 3 characters";
      valid = false;
    } else if (fullName.trim().length > 50) {
      next.fullName = "Name must not exceed 50 characters";
      valid = false;
    }

    const digits = mobileNumber.replace(/\s/g, "");
    if (!digits) {
      next.mobile = "Mobile number is required";
      valid = false;
    } else if (!digits.startsWith("5")) {
      next.mobile = "Georgian mobile numbers must start with 5";
      valid = false;
    } else if (digits.length !== 9) {
      next.mobile = "Mobile number must be exactly 9 digits";
      valid = false;
    }

    if (!age) {
      next.age = "Age is required";
      valid = false;
    } else if (Number(age) < 16) {
      next.age = "You must be at least 16 years old to enroll";
      valid = false;
    } else if (Number(age) > 120) {
      next.age = "Please enter a valid age";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const digits = mobileNumber.replace(/\s/g, "");
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("mobile_number", digits);
      formData.append("age", age);
      if (avatarFile) formData.append("avatar", avatarFile);
      formData.append("_method", "PUT");

      const res = await fetch(`${BASE}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const json = await res.json();

      if (res.ok) {
        const u = json.data;
        setFullName(u.fullName ?? "");
        setUsername(u.username ?? "");
        setMobileNumber(u.mobileNumber ?? "");
        setAge(u.age ? String(u.age) : "");
        setAvatar(u.avatar ?? null);
        setProfileComplete(u.profileComplete ?? false);
        setAvatarFile(null);
        setAvatarPreview(null);
        localStorage.setItem("userData", JSON.stringify(u));
        window.dispatchEvent(new Event("auth-updated"));
        onProfileUpdated?.();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const clearError = (field: keyof ProfileFormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  return {
    // fields
    fullName,
    setFullName,
    email,
    username,
    mobileNumber,
    setMobileNumber,
    age,
    setAge,
    avatar,
    profileComplete,
    avatarFile,
    avatarPreview,
    isSubmitting,
    isAgeOpen,
    setIsAgeOpen,
    errors,
    clearError,
    handleUpdate,
    handleAvatarChange,
  };
}
