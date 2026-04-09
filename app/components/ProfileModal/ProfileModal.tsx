"use client";
import { useEffect, useState } from "react";
import CloseSvg from "../icons/CloseSvg";
import Image from "next/image";
import ProfileSvg from "../icons/ProfileSvg";
import EditNameIcon from "../icons/EditNameIcon";
import DoneIcon from "../icons/DoneIcon";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import UploadPhotoIcon from "../icons/UploadPhotoIcon";
import { formatFileSize } from "../../utils/formatFileSize";


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: ProfileModalProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  const [isAgeOpen, setIsAgeOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [ageError, setAgeError] = useState("");
  const handleUpdate = async () => {
    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError("Name is required");
      hasError = true;
    } else if (fullName.trim().length < 3) {
      setFullNameError("Name must be at least 3 characters");
      hasError = true;
    } else if (fullName.trim().length > 50) {
      setFullNameError("Name must not exceed 50 characters");
      hasError = true;
    } else {
      setFullNameError("");
    }

    const digits = mobileNumber.replace(/\s/g, "");
    if (!digits) {
      setMobileError("Mobile number is required");
      hasError = true;
    } else if (!digits.startsWith("5")) {
      setMobileError("Georgian mobile numbers must start with 5");
      hasError = true;
    } else if (digits.length !== 9) {
      setMobileError("Mobile number must be exactly 9 digits");
      hasError = true;
    } else {
      setMobileError("");
    }

    if (!age) {
      setAgeError("Age is required");
      hasError = true;
    } else if (Number(age) < 16) {
      setAgeError("You must be at least 16 years old to enroll");
      hasError = true;
    } else if (Number(age) > 120) {
      setAgeError("Please enter a valid age");
      hasError = true;
    } else {
      setAgeError("");
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("mobile_number", digits);
      formData.append("age", age);
      if (avatarFile) formData.append("avatar", avatarFile);
      formData.append("_method", "PUT");

      const res = await fetch(
        "https://api.redclass.redberryinternship.ge/api/profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        },
      );
      const json = await res.json();
      console.log("update response:", json);
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
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("authToken");
    fetch("https://api.redclass.redberryinternship.ge/api/me", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((json) => {
        console.log("me response:", json);
        const u = json.data.user ?? json.data;
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

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[16px] relative"
        style={{ width: "460px", minHeight: "730px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="cursor-pointer absolute top-[21px] right-[12px]"
          onClick={onClose}
        >
          <CloseSvg />
        </div>

        <div className="px-[50px] pb-[50px]">
          <p className="mt-[49px]  items-center justify-center flex h-[39px] text-[#141414] font-semibold text-[32px] leading-[100%] tracking-[0%] text-center">
            Profile
          </p>

          <div className="w-[360px] h-[56px] mt-[24px] flex items-center gap-[12px]  ">
            <div className="relative w-[56px] h-[56px]">
              <div className="rounded-full flex items-center justify-center w-[56px] h-[56px] bg-[#EEEDFC] overflow-hidden">
                {avatar ? (
                  <Image
                    width={100}
                    height={100}
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ProfileSvg />
                )}
              </div>
              <div
                className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full"
                style={{
                  backgroundColor: profileComplete ? "#1DC31D" : "#F4A316",
                  border: "2px solid white",
                }}
              />
            </div>

            <div>
              <p className="text-[#0A0A0A] font-semibold text-[20px] leading-[24px] tracking-[0%]">
                {username}
              </p>
              <p
                className={`font-normal text-[10px] leading-[100%] tracking-[0%] mt-[4px] ${profileComplete ? "text-[#22C55E]" : "text-[#F4A316]"}`}
              >
                {profileComplete ? "Complete profile" : "Incomplete profile"}
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col mt-[24px]">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative mt-[8px]">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); if (fullNameError) setFullNameError(""); }}
                className={`w-full border-[1.5px] h-[48px] rounded-[8px] p-[12px] pr-[40px] text-[14px] font-medium leading-[100%] tracking-[0%] caret-[#8A8A8A] placeholder:text-[#8A8A8A] placeholder:font-medium hover:placeholder:text-[#D1D1D1] focus:placeholder:text-[#F5F5F5] focus:outline-none focus:ring-0 transition-colors duration-200 ${fullNameError ? "border-[#F4161A] text-[#F4161A]" : "border-[#D1D1D1] text-[#3D3D3D] hover:border-[#ADADAD] focus:border-[#8A8A8A]"}`}
              />
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                <EditNameIcon />
              </div>
            </div>
            {fullNameError && (
              <p className="mt-[4px] text-[12px] font-normal leading-none tracking-normal text-[#F4161A] truncate">
                {fullNameError}
              </p>
            )}
          </div>

          <div className="flex flex-col mt-[12px]">
            <label className="text-sm font-medium">Email</label>
            <div className="relative mt-[8px]">
              <input
                type="text"
                disabled
                value={email}
                placeholder="Email"
                className="w-full border-[1.5px] h-[48px] border-[#ADADAD] bg-[#F5F5F5] rounded-[8px] p-[12px] pr-[40px] text-[14px] font-medium leading-[100%] tracking-[0%] text-[#ADADAD] focus:outline-none focus:ring-0"
              />
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                <DoneIcon />
              </div>
            </div>
          </div>

          <div className="flex gap-[8px] mt-[12px]">
            <div className="flex flex-col w-[267px]">
              <label className="text-sm font-medium">Mobile Number</label>
              <div className={`group relative mt-[8px] flex items-center border-[1.5px] rounded-[8px] h-[48px] overflow-hidden transition-colors duration-200 ${mobileError ? "border-[#F4161A]" : "border-[#D1D1D1] hover:border-[#ADADAD] focus-within:border-[#8A8A8A]"}`}>
                <span className={`pl-[12px] pr-[8px] mr-[8px] text-[14px] font-medium h-full flex items-center shrink-0 border-r transition-colors duration-200 ${mobileError ? "text-[#F4161A] border-[#F4161A]" : "text-[#8A8A8A] border-[#D1D1D1] group-hover:text-[#ADADAD] group-hover:border-[#ADADAD] group-focus-within:text-[#525252] group-focus-within:border-[#8A8A8A]"}`}>
                  +995
                </span>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => { setMobileNumber(e.target.value); if (mobileError) setMobileError(""); }}
                  className={`flex-1 h-full pr-[40px] text-[14px] font-medium leading-[100%] tracking-[0%] caret-[#8A8A8A] placeholder:text-[#8A8A8A] placeholder:font-medium hover:placeholder:text-[#D1D1D1] focus:placeholder:text-[#F5F5F5] focus:outline-none focus:ring-0 ${mobileError ? "text-[#F4161A]" : "text-[#3D3D3D]"}`}
                />
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                  <EditNameIcon />
                </div>
              </div>
              {mobileError && (
                <p className="mt-[4px] text-[12px] font-normal leading-none tracking-normal text-[#F4161A] truncate">
                  {mobileError}
                </p>
              )}
            </div>
            <div className="flex flex-col w-[85px]">
              <label className="text-sm font-medium">Age</label>
              <div className="relative mt-[8px]">
                <select
                  value={age}
                  onMouseDown={() => setIsAgeOpen((v) => !v)}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setIsAgeOpen(false);
                    if (ageError) setAgeError("");
                  }}
                  onBlur={() => setIsAgeOpen(false)}
                  className="w-full border-[1.5px] border-[#D1D1D1] hover:border-[#ADADAD] focus:border-[#8A8A8A] rounded-[8px] h-[48px] pl-[12px] pr-[36px] text-[14px] font-medium leading-[100%] tracking-[0%] text-[#8A8A8A] focus:outline-none focus:ring-0 appearance-none bg-white cursor-pointer transition-colors duration-200"
                >
                  <option value="" disabled>
                    Age
                  </option>
                  {Array.from({ length: 83 }, (_, i) => i + 18).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div
                  className="absolute right-[8px] top-0 bottom-0 flex items-center pointer-events-none transition-transform duration-200"
                  style={{
                    transform: isAgeOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ArrowDownIcon />
                </div>
              </div>
              {ageError && (
                <p className="mt-[4px] text-[12px] font-normal leading-none tracking-normal text-[#F4161A] truncate">
                  {ageError}
                </p>
              )}
            </div>
          </div>

          {/* Upload Avatar */}
          <div className="flex flex-col mt-[12px]">
            <label className="text-sm font-medium">Upload Avatar</label>
            <div
              className="avatar-upload-box mt-[8px] rounded-[8px] flex items-center justify-center cursor-pointer overflow-hidden"
              tabIndex={0}
              style={{
                width: "360px",
                height: "140px",
                border: avatarPreview && avatarFile ? "1.5px solid #DDDBFA" : "1.5px solid #D1D1D1",
                backgroundColor: avatarPreview && avatarFile ? "#EEEDFC" : "transparent",
              }}
              onClick={() => document.getElementById("profileAvatarInput")?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.getElementById("profileAvatarInput")?.click(); } }}
            >
              {avatarPreview && avatarFile ? (
                <div className="w-[240px] h-[54px] flex items-center gap-[10px]">
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-[54px] h-[54px] rounded-[40px] object-cover flex-shrink-0"
                    width={54}
                    height={54}
                  />
                  <div className="h-[41px] min-w-0 flex-1">
                    <p className="text-[#525252] h-[15px] flex items-center font-normal text-xs leading-none tracking-normal overflow-hidden">
                      <span className="truncate block max-w-[140px]">{avatarFile.name}</span>
                    </p>
                    <p className="text-[#ADADAD] font-normal text-[10px] leading-none tracking-normal h-[12px] flex items-center">
                      Size — {formatFileSize(avatarFile.size)}
                    </p>
                    <p
                      className="h-[12px] flex items-center mt-[2px] text-[#4F46E5] font-medium text-[10px] leading-none tracking-normal underline decoration-solid underline-offset-[25%] decoration-[0px] cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); document.getElementById("profileAvatarInput")?.click(); }}
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
                id="profileAvatarInput"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (!file) return;
                  const allowed = ["image/jpeg", "image/png", "image/webp"];
                  if (!allowed.includes(file.type)) {
                    e.target.value = "";
                    return;
                  }
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <button
            type="button"
            className="w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[16px] cursor-pointer"
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              pointerEvents: isSubmitting ? "none" : "auto",
            }}
            onClick={handleUpdate}
          >
            {isSubmitting ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
