import ConfirmedEnrollmentIcon from "@/app/components/icons/ConfirmedEnrollmentIcon";

interface SuccessModalProps {
  courseTitle: string;
  onDone: () => void;
}

export default function SuccessModal({
  courseTitle,
  onDone,
}: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={onDone}
    >
      <div
        className="bg-white w-[476px] rounded-[16px] p-[60px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ConfirmedEnrollmentIcon />
        <p className="font-semibold h-[39px] flex items-center text-3xl leading-none tracking-normal text-center text-[#3D3D3D] mt-[24px]">
          Enrollment Confirmed!
        </p>
        <p className="font-medium text-xl leading-none tracking-normal mt-[24px] text-center text-[#3D3D3D]">
          You've successfully enrolled to the{" "}
          <span className="font-semibold">"{courseTitle}"</span> Course!
        </p>
        <button
          type="button"
          onClick={onDone}
          className="w-full h-[58px] mt-[40px] rounded-[10px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out text-white text-[16px] cursor-pointer font-medium text-base leading-6 tracking-normal text-center"
        >
          Done
        </button>
      </div>
    </div>
  );
}
