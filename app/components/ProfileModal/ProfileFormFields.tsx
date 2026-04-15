import EditNameIcon from "@/app/components/icons/EditNameIcon";
import DoneIcon from "@/app/components/icons/DoneIcon";
import ArrowDownIcon from "@/app/components/icons/ArrowDownIcon";
import { ProfileFormErrors } from "@/app/hooks/useProfileModal";

interface ProfileFormFieldsProps {
  fullName: string;
  email: string;
  mobileNumber: string;
  age: string;
  isAgeOpen: boolean;
  errors: ProfileFormErrors;
  onFullNameChange: (v: string) => void;
  onMobileChange: (v: string) => void;
  onAgeChange: (v: string) => void;
  onAgeOpenChange: (v: boolean) => void;
  clearError: (field: keyof ProfileFormErrors) => void;
  onBlurField: (field: "fullName" | "mobile" | "age") => void;
}

const ERROR_TEXT =
  "mt-[4px] text-[10px] font-normal leading-none tracking-[0%] text-[#F4161A] whitespace-nowrap";
const INPUT_BASE =
  "w-full border-[1.5px] h-[48px] rounded-[8px] p-[12px] pr-[40px] text-[14px] font-medium leading-[100%] tracking-[0%] caret-[#8A8A8A] placeholder:text-[#8A8A8A] placeholder:font-medium hover:placeholder:text-[#D1D1D1] focus:placeholder:text-[#F5F5F5] focus:outline-none focus:ring-0 transition-colors duration-200";

export default function ProfileFormFields({
  fullName,
  email,
  mobileNumber,
  age,
  isAgeOpen,
  errors,
  onFullNameChange,
  onMobileChange,
  onAgeChange,
  onAgeOpenChange,
  clearError,
  onBlurField,
}: ProfileFormFieldsProps) {
  return (
    <>
      <div className="flex flex-col mt-[24px]">
        <label className="text-sm font-medium">Full Name</label>
        <div className="relative mt-[8px]">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Zა-ჰ\s]/g, "");
              onFullNameChange(value);
              if (errors.fullName) clearError("fullName");
            }}
            onBlur={() => onBlurField("fullName")}
            className={`${INPUT_BASE} ${errors.fullName ? "border-[#F4161A] text-[#F4161A]" : "border-[#D1D1D1] text-[#3D3D3D] hover:border-[#ADADAD] focus:border-[#8A8A8A]"}`}
          />
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
            <EditNameIcon />
          </div>
        </div>
        {errors.fullName && <p className={ERROR_TEXT}>{errors.fullName}</p>}
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
          <div
            className={`group relative mt-[8px] flex items-center border-[1.5px] rounded-[8px] h-[48px] overflow-hidden transition-colors duration-200 ${errors.mobile ? "border-[#F4161A]" : "border-[#D1D1D1] hover:border-[#ADADAD] focus-within:border-[#8A8A8A]"}`}
          >
            <span
              className={`pl-[12px] pr-[4px] text-[14px] font-medium shrink-0 leading-none transition-colors duration-200 ${errors.mobile ? "text-[#F4161A]" : "text-[#8A8A8A] group-hover:text-[#ADADAD] group-focus-within:text-[#525252]"}`}
            >
              +995
            </span>
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                onMobileChange(value);
                if (value) clearError("mobile");
              }}
              onBlur={() => onBlurField("mobile")}
              className={`flex-1 pr-[40px] text-[14px] font-medium leading-none tracking-[0%] caret-[#8A8A8A] placeholder:text-[#8A8A8A] placeholder:font-medium hover:placeholder:text-[#D1D1D1] focus:placeholder:text-[#F5F5F5] focus:outline-none focus:ring-0 bg-transparent ${errors.mobile ? "text-[#F4161A]" : "text-[#3D3D3D]"}`}
            />
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
              <EditNameIcon />
            </div>
          </div>
          {errors.mobile && <p className={ERROR_TEXT}>{errors.mobile}</p>}
        </div>

        <div className="flex flex-col w-[85px]">
          <label className="text-sm font-medium leading-normal">Age</label>
          <div className="relative mt-[8px]">
            <select
              value={age}
              onMouseDown={() => onAgeOpenChange(!isAgeOpen)}
              onChange={(e) => {
                onAgeChange(e.target.value);
                onAgeOpenChange(false);
              }}
              onBlur={() => {
                onAgeOpenChange(false);
                onBlurField("age");
              }}
              className={`w-full border-[1.5px] rounded-[8px] h-[48px] pl-[12px] pr-[36px] text-[14px] font-medium leading-[100%] tracking-[0%] focus:outline-none focus:ring-0 appearance-none bg-white cursor-pointer transition-colors duration-200 ${errors.age ? "border-[#F4161A] text-[#F4161A]" : "border-[#D1D1D1] hover:border-[#ADADAD] focus:border-[#8A8A8A] text-[#8A8A8A]"}`}
            >
              <option value="" disabled>
                Age
              </option>
              {Array.from({ length: 85 }, (_, i) => i + 16).map((n) => (
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
          {errors.age && <p className={ERROR_TEXT}>{errors.age}</p>}
        </div>
      </div>
    </>
  );
}
