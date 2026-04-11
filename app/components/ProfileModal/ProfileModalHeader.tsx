import Image from "next/image";
import ProfileSvg from "@/app/components/icons/ProfileSvg";

interface ProfileModalHeaderProps {
  avatar: string | null;
  username: string;
  profileComplete: boolean;
}

export default function ProfileModalHeader({
  avatar,
  username,
  profileComplete,
}: ProfileModalHeaderProps) {
  return (
    <div className="w-[360px] h-[56px] mt-[24px] flex items-center gap-[12px]">
      <div className="relative w-[56px] h-[56px]">
        <div className="rounded-full flex items-center justify-center w-[56px] h-[56px] bg-[#EEEDFC] overflow-hidden">
          {avatar ? (
            <Image
              src={avatar}
              alt="avatar"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <ProfileSvg />
          )}
        </div>
        <div
          className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full border-[2px] border-white"
          style={{ backgroundColor: profileComplete ? "#1DC31D" : "#F4A316" }}
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
  );
}
