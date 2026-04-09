import TriangleIcon from "../icons/TriangleIcon";
import SignInSvg from "../icons/SignInSvg";

interface AuthWarningBannerProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonWidth: string;
  onButtonClick: () => void;
}

export default function AuthWarningBanner({
  title,
  description,
  buttonLabel,
  buttonWidth,
  onButtonClick,
}: AuthWarningBannerProps) {
  return (
    <div className="w-[530px] h-[102px] bg-[#F8FAFC] border-[1px] border-[#E5E7EB] flex items-center justify-between rounded-[12px] p-[20px] mt-[12px]">
      <div>
        <div className="flex gap-[6px] items-center h-[24px]">
          <TriangleIcon />
          <p className="text-[#292929] font-medium text-base leading-6 tracking-normal">
            {title}
          </p>
        </div>
        <p className="w-[283px] text-[#8A8A8A] font-normal text-xs leading-tight tracking-normal mt-[6px]">
          {description}
        </p>
      </div>
      <div
        onClick={onButtonClick}
        className={`flex gap-[6px] items-center justify-center ${buttonWidth} h-[46px] bg-[#EEEDFC] cursor-pointer rounded-[8px] border-[1px] border-[#B7B3F4]`}
      >
        <p className="text-[#281ED2] font-normal text-sm leading-6 tracking-normal">
          {buttonLabel}
        </p>
        <SignInSvg />
      </div>
    </div>
  );
}
