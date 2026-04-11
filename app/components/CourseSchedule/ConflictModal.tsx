import { useEffect } from "react";
import ConflictSvg from "@/app/components/icons/ConflictSvg";
import { ConflictData } from "@/app/types/enrollment";
import { formatSchedule } from "@/app/utils/formatSchedule";

interface ConflictModalProps {
  conflictData: ConflictData;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConflictModal({
  conflictData,
  onCancel,
  onConfirm,
}: ConflictModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const { conflicts } = conflictData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
    >
      <div className="bg-white w-[476px] min-h-[455px] rounded-[16px] flex items-center flex-col p-[60px]">
        <ConflictSvg />

        <p className="text-[#3D3D3D] h-[39px] flex items-center font-semibold text-3xl leading-none tracking-normal text-center mt-[24px]">
          Enrollment Conflict
        </p>

        <div className="flex flex-col items-center mt-[24px]">
          <p className="font-medium text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
            You are already enrolled in
          </p>
          <p className="text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
            {conflicts.map((c, i) => (
              <span key={i}>
                <span className="font-semibold">
                  "{c.conflictingCourseName}"
                </span>
                {i < conflicts.length - 2 && (
                  <span className="font-medium">, </span>
                )}
                {i === conflicts.length - 2 && (
                  <span className="font-medium"> and </span>
                )}
                {i === conflicts.length - 1 && (
                  <span className="font-medium"> with</span>
                )}
              </span>
            ))}
          </p>
          <p className="font-medium text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
            the same schedule:
          </p>
          <p className="font-semibold text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
            {formatSchedule(conflicts[0].schedule)}
          </p>
        </div>

        <div className="flex mt-[40px] w-full gap-[8px] justify-between">
          <button
            onClick={onConfirm}
            className="w-full h-[58px] rounded-[8px] font-medium text-base leading-6 tracking-normal text-center border-[2px] border-[#958FEF] text-[#4F46E5] text-[16px] cursor-pointer"
          >
            Continue Anyway
          </button>
          <button
            onClick={onCancel}
            className="w-full h-[58px] rounded-[8px] font-medium text-base leading-6 tracking-normal text-center bg-[#4F46E5] text-white text-[16px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
