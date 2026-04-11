interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <>
      <p className="mt-[48px] h-[30px] flex items-center font-semibold text-xl leading-6 tracking-normal align-middle text-[#666666]">
        {progress}% Complete
      </p>
      <div className="w-[473px] h-[23.45px] bg-[#DDDBFA] rounded-[30px]">
        <div
          className="h-full bg-[#4F46E5] rounded-[30px] mt-[12px] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}