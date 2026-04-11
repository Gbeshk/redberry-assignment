interface ActiveFiltersBarProps {
  total: number;
}

export default function ActiveFiltersBar({ total }: ActiveFiltersBarProps) {
  return (
    <div className="w-[309px] h-[36px] mt-[24px] border-t-[1px] border-t-[#ADADAD]">
      <p className="text-[#8A8A8A] flex h-[17px] items-center font-medium text-[14px] leading-[100%] tracking-[0%] mt-[16px]">
        {total} Filter{total !== 1 ? "s" : ""} Active
      </p>
    </div>
  );
}