export default function CourseCardSkeleton() {
  return (
    <div className="w-[373px] h-[451px] bg-white rounded-[12px] p-[20px] flex flex-col border-[1px] border-[#F5F5F5]">
      <div className="w-[333px] h-[181px] rounded-[10px] bg-[#E8E8E8] animate-pulse" />

      <div className="flex items-center mt-[18px] justify-between h-[18px]">
        <div className="h-[14px] w-[140px] rounded-[4px] bg-[#E8E8E8] animate-pulse" />
        <div className="h-[14px] w-[36px] rounded-[4px] bg-[#E8E8E8] animate-pulse" />
      </div>

      <div className="mt-[12px] flex flex-col gap-[8px]">
        <div className="h-[20px] w-full rounded-[4px] bg-[#E8E8E8] animate-pulse" />
        <div className="h-[20px] w-[70%] rounded-[4px] bg-[#E8E8E8] animate-pulse" />
      </div>

      <div className="mt-[18px] h-[40px] w-[130px] rounded-[12px] bg-[#E8E8E8] animate-pulse" />

      <div className="flex items-center justify-between h-[48px] w-full mt-[18px]">
        <div className="flex flex-col gap-[6px]">
          <div className="h-[12px] w-[70px] rounded-[4px] bg-[#E8E8E8] animate-pulse" />
          <div className="h-[24px] w-[50px] rounded-[4px] bg-[#E8E8E8] animate-pulse" />
        </div>
        <div className="w-[103px] h-[48px] rounded-[8px] bg-[#E8E8E8] animate-pulse" />
      </div>
    </div>
  );
}
