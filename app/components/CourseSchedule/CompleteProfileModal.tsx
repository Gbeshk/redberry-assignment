import CompleteProfIcon from "@/app/components/icons/CompleteProfIcon";

interface CompleteProfileModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function CompleteProfileModal({
  onClose,
  onComplete,
}: CompleteProfileModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-[476px] rounded-[16px] p-[60px] flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <CompleteProfIcon />
        <p className="text-[#3D3D3D] mt-[24px] h-[78px] flex items-center font-semibold text-3xl leading-none tracking-normal">
          Complete your profile <br /> to continue
        </p>
        <p className="mt-[24px] font-medium text-xl leading-none h-[48px] flex items-center tracking-normal text-[#3D3D3D]">
          You need to complete your profile before enrolling in this course.
        </p>
        <div className="flex gap-[8px] w-full mt-[40px]">
          <button
            type="button"
            onClick={onComplete}
            className="flex-1 h-[58px] rounded-[8px] border-[2px] border-[#958FEF] cursor-pointer flex items-center justify-center font-medium text-base leading-6 tracking-normal text-center text-[#4F46E5] hover:bg-[#281ED2] hover:text-white hover:border-[#281ED2] active:bg-[#1E169D] active:border-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:text-white focus-visible:border-[#1E169D] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out"
          >
            Complete Profile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[58px] rounded-[8px] bg-[#4F46E5] font-medium text-base leading-6 tracking-normal text-center text-white cursor-pointer hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
