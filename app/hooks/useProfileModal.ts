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
  const [apiError, setApiError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [errors, setErrors] = useState<ProfileFormErrors>({
    fullName: "",
    mobile: "",
    age: "",
  });
  const handleClose = () => {
    setFullName("");
    setEmail("");
    setUsername("");
    setMobileNumber("");
    setAge("");
    setAvatar(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    setErrors({ fullName: "", mobile: "", age: "" });
    setApiError("");
    setAvatarError("");
    setIsAgeOpen(false);
    onClose();
  };

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

  const isFormValid = (() => {
    if (
      !fullName.trim() ||
      fullName.trim().length < 3 ||
      fullName.trim().length > 50
    )
      return false;
    const digits = mobileNumber.replace(/\s/g, "");
    if (!digits || !digits.startsWith("5") || digits.length !== 9) return false;
    if (!age || Number(age) < 16 || Number(age) > 100) return false;
    return true;
  })();

  const validateField = (field: "fullName" | "mobile" | "age") => {
    const next = { ...errors };

    if (field === "fullName") {
      if (!fullName.trim()) next.fullName = "Name is required";
      else if (fullName.trim().length < 3)
        next.fullName = "Name must be at least 3 characters";
      else if (fullName.trim().length > 50)
        next.fullName = "Name must not exceed 50 characters";
      else next.fullName = "";
    }

    if (field === "mobile") {
      const digits = mobileNumber.replace(/\s/g, "");
      if (!digits) next.mobile = "Mobile number is required";
      else if (!digits.startsWith("5"))
        next.mobile = "Georgian mobile numbers must start with 5";
      else if (digits.length !== 9)
        next.mobile = "Mobile number must be exactly 9 digits";
      else next.mobile = "";
    }

    if (field === "age") {
      if (!age) next.age = "Age is required";
      else if (Number(age) < 16)
        next.age = "You must be at least 16 years old to enroll";
      else if (Number(age) > 100) next.age = "Please enter a valid age";
      else next.age = "";
    }

    setErrors(next);
  };

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
    } else if (Number(age) > 100) {
      next.age = "Please enter a valid age";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    if (avatarError) return;

    setIsSubmitting(true);
    setApiError("");
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
        window.dispatchEvent(new Event("profile-updated"));
        onProfileUpdated?.();
        onClose();
      } else {
        const msg =
          json?.message ??
          Object.values(json?.errors ?? {})
            .flat()
            .join(" ") ??
          "Something went wrong. Please try again.";
        setApiError(String(msg));
      }
    } catch (e) {
      setApiError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 2MB.");
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setAvatarError("Only JPG, PNG, or WebP files are allowed.");
      setAvatarFile(file);
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
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg" },
          );
          setAvatarFile(compressed);
          setAvatarPreview(URL.createObjectURL(compressed));
        },
        "image/jpeg",
        0.8,
      );
    };
    img.src = objectUrl;
  };

  const handleAgeChange = (value: string) => {
    setAge(value);
    let msg = "";
    if (!value) msg = "Age is required";
    else if (Number(value) < 16)
      msg = "You must be at least 16 years old to enroll";
    else if (Number(value) > 100) msg = "Please enter a valid age";
    setErrors((prev) => ({ ...prev, age: msg }));
  };

  const clearError = (field: keyof ProfileFormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  return {
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
    apiError,
    avatarError,
    isFormValid,
    clearError,
    validateField,
    handleAgeChange,
    handleUpdate,
    handleAvatarChange,
    handleClose,
  };
}
