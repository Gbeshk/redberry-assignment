interface PriceSummaryProps {
  basePrice: number;
  sessionMod: number;
  selectedSessionKey: string | null;
  isSessionAvailable: (key: string) => boolean;
  enrolling: boolean;
  onEnroll: () => void;
}

export default function PriceSummary({
  basePrice,
  sessionMod,
  selectedSessionKey,
  isSessionAvailable,
  enrolling,
  onEnroll,
}: PriceSummaryProps) {
  const totalPrice = basePrice + sessionMod;
  const canEnroll =
    !!selectedSessionKey &&
    isSessionAvailable(selectedSessionKey) &&
    !enrolling;

  return (
    <div className="w-[530px] h-[306px] bg-white rounded-[12px] mt-[32px] flex items-center flex-col p-[40px]">
      <div className="w-[450px] h-[39px] flex items-center justify-between">
        <p className="text-[#8A8A8A] font-semibold text-[20px] leading-[24px] tracking-normal">
          Total Price
        </p>
        <p className="text-[#292929] font-semibold text-[32px] leading-none tracking-normal text-right">
          ${totalPrice}
        </p>
      </div>
      <div className="h-[24px] flex items-center justify-between w-[450px] mt-[32px]">
        <p className="text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-normal">
          Base Price
        </p>
        <p className="text-[#292929] font-medium text-[16px] leading-[24px] tracking-normal flex items-center justify-end gap-[4px]">
          <span className="translate-y-[-1px]">+</span>
          <span>$0</span>
        </p>
      </div>
      <div className="h-[24px] flex items-center justify-between w-[450px] mt-[12px]">
        <p className="text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-normal">
          Session Type
        </p>
        <p className="text-[#292929] font-medium text-[16px] leading-[24px] tracking-normal flex items-center justify-end gap-[4px]">
          <span className="translate-y-[-1px]">+</span>
          <span>${sessionMod.toFixed(0)}</span>
        </p>
      </div>
      <button
        type="button"
        disabled={!canEnroll}
        onClick={onEnroll}
        className="w-[450px] h-[63px] rounded-[12px] mt-[32px] font-semibold text-[20px] leading-[24px] tracking-normal flex items-center justify-center transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] disabled:cursor-not-allowed"
        style={
          canEnroll
            ? {
                backgroundColor: "#736BEA",
                color: "#ffffff",
                cursor: "pointer",
              }
            : {
                backgroundColor: "#EEEDFC",
                color: "#B7B3F4",
                cursor: "default",
              }
        }
      >
        {enrolling ? "Enrolling..." : "Enroll Now"}
      </button>
    </div>
  );
}
