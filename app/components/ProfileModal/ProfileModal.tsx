"use client";
import { useEffect, useState } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
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
        className="bg-white rounded-[16px] "
        style={{ width: "460px", height: "730px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[21px] flex items-center justify-between px-[12px]">
          <div style={{ width: "16px" }} />
          <div className="cursor-pointer" onClick={onClose}>
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
          <p className="mt-[4px]  items-center justify-center flex h-[39px] text-[#141414] font-semibold text-[32px] leading-[100%] tracking-[0%] text-center">
            Profile
          </p>
          <div className="w-[360px] h-[56px] mt-[24px] flex items-center gap-[12px]  ">
            <div className="relative w-[56px] h-[56px]">
              <div className="rounded-full w-[56px] h-[56px] bg-[#EEEDFC] overflow-hidden">
                {avatar && (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div
                className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full"
                style={{
                  backgroundColor: "#F4A316",
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
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-[1.5px] h-[48px] border-[#D1D1D1] rounded-[8px] p-[12px] pr-[40px] text-[14px] font-medium leading-[100%] tracking-[0%] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-0"
              />
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.4898 5.99608L16.0169 8.52362M16.4388 5.56965C16.6051 5.73583 16.7371 5.93317 16.8272 6.1504C16.9172 6.36763 16.9635 6.60048 16.9635 6.83564C16.9635 7.07079 16.9172 7.30365 16.8272 7.52087C16.7371 7.7381 16.6051 7.93545 16.4388 8.10163L8.42225 16.1196L5.04688 16.9635L5.89072 13.6348L13.9106 5.57303C14.2267 5.25532 14.6507 5.06812 15.0984 5.04857C15.5461 5.02903 15.9848 5.17858 16.3274 5.46753L16.4388 5.56965Z"
                    stroke="#ADADAD"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {fullNameError && (
              <p className="mt-[6px] text-[12px] font-medium text-[#EF4444]">
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
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.0976 8.066L9.05794 15.3988C9.01707 15.4414 8.96855 15.4752 8.91514 15.4983C8.86172 15.5213 8.80447 15.5332 8.74665 15.5332C8.68883 15.5332 8.63158 15.5213 8.57816 15.4983C8.52475 15.4752 8.47623 15.4414 8.43536 15.3988L5.3555 12.1907C5.27294 12.1047 5.22656 11.9881 5.22656 11.8664C5.22656 11.7448 5.27294 11.6282 5.3555 11.5422C5.43806 11.4562 5.55003 11.4079 5.66679 11.4079C5.78354 11.4079 5.89552 11.4562 5.97807 11.5422L8.74665 14.4266L15.4751 7.41751C15.5576 7.33151 15.6696 7.2832 15.7863 7.2832C15.9031 7.2832 16.0151 7.33151 16.0976 7.41751C16.1802 7.50351 16.2266 7.62014 16.2266 7.74176C16.2266 7.86337 16.1802 7.98001 16.0976 8.066Z"
                    fill="#ADADAD"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-[8px] mt-[12px]">
            <div className="flex flex-col w-[267px]">
              <label className="text-sm font-medium">Mobile Number</label>
              <div className="relative mt-[8px] flex items-center border-[1.5px] border-[#D1D1D1] rounded-[8px] h-[48px] overflow-hidden">
                <span className="pl-[12px] pr-[4px] text-[14px] font-medium text-[#D1D1D1] h-full flex items-center shrink-0">
                  +995
                </span>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex-1 h-full  pr-[40px] text-[14px] font-medium leading-[100%] tracking-[0%] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-0"
                />
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4898 5.99608L16.0169 8.52362M16.4388 5.56965C16.6051 5.73583 16.7371 5.93317 16.8272 6.1504C16.9172 6.36763 16.9635 6.60048 16.9635 6.83564C16.9635 7.07079 16.9172 7.30365 16.8272 7.52087C16.7371 7.7381 16.6051 7.93545 16.4388 8.10163L8.42225 16.1196L5.04688 16.9635L5.89072 13.6348L13.9106 5.57303C14.2267 5.25532 14.6507 5.06812 15.0984 5.04857C15.5461 5.02903 15.9848 5.17858 16.3274 5.46753L16.4388 5.56965Z"
                      stroke="#ADADAD"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              {mobileError && (
                <p className="mt-[6px] text-[12px] font-medium text-[#EF4444]">
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
                  }}
                  onBlur={() => setIsAgeOpen(false)}
                  className="w-full border-[1.5px] border-[#D1D1D1] rounded-[8px] h-[48px] pl-[12px] pr-[36px] text-[14px] font-medium leading-[100%] tracking-[0%] text-[#8A8A8A] focus:outline-none focus:ring-0 appearance-none bg-white cursor-pointer"
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
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.55001 8.49262C5.49331 8.44392 5.4266 8.40584 5.35371 8.38057C5.28081 8.3553 5.20315 8.34332 5.12516 8.34533C5.04717 8.34733 4.97038 8.36328 4.89918 8.39226C4.82797 8.42124 4.76374 8.46268 4.71015 8.51421C4.65657 8.56575 4.61467 8.62638 4.58687 8.69263C4.55906 8.75889 4.54588 8.82947 4.54809 8.90035C4.5503 8.97123 4.56784 9.04102 4.59972 9.10574C4.63161 9.17046 4.6772 9.22884 4.73391 9.27754L10.0796 13.8661C10.1899 13.9609 10.3359 14.0137 10.4876 14.0137C10.6394 14.0137 10.7854 13.9609 10.8957 13.8661L16.2419 9.27754C16.2999 9.22916 16.3467 9.17079 16.3796 9.10584C16.4125 9.04088 16.4309 8.97063 16.4337 8.89915C16.4365 8.82768 16.4236 8.75642 16.3959 8.6895C16.3681 8.62259 16.326 8.56135 16.272 8.50936C16.2179 8.45736 16.1531 8.41564 16.0812 8.38661C16.0093 8.35759 15.9317 8.34184 15.8531 8.34028C15.7744 8.33873 15.6962 8.35139 15.6229 8.37754C15.5497 8.40369 15.4829 8.44281 15.4264 8.49262L10.4876 12.7314L5.55001 8.49262Z"
                      fill="#ADADAD"
                    />
                  </svg>
                </div>
              </div>
              {ageError && (
                <p className="mt-[6px] text-[12px] font-medium text-[#EF4444]">
                  {ageError}
                </p>
              )}
            </div>
          </div>

          {/* Upload Avatar */}
          <div className="flex flex-col mt-[12px]">
            <label className="text-sm font-medium">Upload Avatar</label>
            <div
              className="mt-[8px] border-[1.5px] border-[#D1D1D1] h-[140px] rounded-[8px] flex items-center justify-center cursor-pointer "
              style={{ width: "360px", height: "140px" }}
              onClick={() =>
                document.getElementById("profileAvatarInput")?.click()
              }
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.75 21.25V26.9167C29.75 27.6681 29.4515 28.3888 28.9201 28.9201C28.3888 29.4515 27.6681 29.75 26.9167 29.75H7.08333C6.33189 29.75 5.61122 29.4515 5.07986 28.9201C4.54851 28.3888 4.25 27.6681 4.25 26.9167V21.25"
                      stroke="#ADADAD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24.0837 11.3333L17.0003 4.25L9.91699 11.3333"
                      stroke="#ADADAD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 4.25V21.25"
                      stroke="#ADADAD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setAvatarFile(file);
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <div
            className="w-[360px] h-[47px] bg-[#4F46E5] rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[16px] cursor-pointer"
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              pointerEvents: isSubmitting ? "none" : "auto",
            }}
            onClick={handleUpdate}
          >
            {isSubmitting ? "Saving..." : "Update Profile"}
          </div>
        </div>
      </div>
    </div>
  );
}
