"use client";
import Image from "next/image";
import Logo from "../../../public/images/logo.svg";
import NavIcon from "../../../public/images/NavIcon.svg";

interface HeaderProps {
  isLoggedIn: boolean;
  userData: { avatar?: string } | null;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onProfileClick: () => void;
}

export default function Header({
  isLoggedIn,
  userData,
  onSignInClick,
  onSignUpClick,
  onProfileClick,
}: HeaderProps) {
  return (
    <>
      <div className="w-[1566px] h-[60px] mx-auto my-[24px] flex justify-between items-center">
        <div className="w-[60px] h-[60px] bg-[#4F46E5] rounded-[14px] flex items-center justify-center">
          <Image src={Logo} width={29} height={30} alt="logo" className="w-[29px] h-[30px]" />
        </div>
        <div className="flex items-center">
          <div className="w-[220px] h-[56px] gap-[8px] flex items-center justify-center">
            <Image src={NavIcon} width={26} height={26} alt="NavIcon" className="w-[26px] h-[26px]" />
            <p className="text-[#525252] font-medium text-[20px] leading-none tracking-normal">
              Browse Courses
            </p>
          </div>

          {isLoggedIn ? (
            <>
              <div className="w-[227px] h-[56px] gap-[8px] flex items-center ml-[8px] justify-center">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9998 7.58333V22.75M12.9998 7.58333C12.9998 6.43406 12.5433 5.33186 11.7306 4.5192C10.918 3.70655 9.81578 3.25 8.6665 3.25H3.24984C2.96252 3.25 2.68697 3.36414 2.4838 3.5673C2.28064 3.77047 2.1665 4.04602 2.1665 4.33333V18.4167C2.1665 18.704 2.28064 18.9795 2.4838 19.1827C2.68697 19.3859 2.96252 19.5 3.24984 19.5H9.74984C10.6118 19.5 11.4384 19.8424 12.0479 20.4519C12.6574 21.0614 12.9998 21.888 12.9998 22.75M12.9998 7.58333C12.9998 6.43406 13.4564 5.33186 14.269 4.5192C15.0817 3.70655 16.1839 3.25 17.3332 3.25H22.7498C23.0372 3.25 23.3127 3.36414 23.5159 3.5673C23.719 3.77047 23.8332 4.04602 23.8332 4.33333V18.4167C23.8332 18.704 23.719 18.9795 23.5159 19.1827C23.3127 19.3859 23.0372 19.5 22.7498 19.5H16.2498C15.3879 19.5 14.5612 19.8424 13.9517 20.4519C13.3422 21.0614 12.9998 21.888 12.9998 22.75" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[#525252] font-medium text-[20px] leading-none tracking-normal">
                  Enrolled Courses
                </p>
              </div>
              <div className="relative ml-[36px] cursor-pointer" onClick={onProfileClick}>
                <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#EEEDFC" }}>
                  {userData?.avatar ? (
                    <Image src={userData.avatar} alt="Profile" className="w-full h-full object-cover" width={56} height={56} />
                  ) : (
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30.0832 33.25V30.0833C30.0832 28.4036 29.4159 26.7927 28.2282 25.605C27.0404 24.4173 25.4295 23.75 23.7498 23.75H14.2498C12.5701 23.75 10.9592 24.4173 9.77149 25.605C8.58376 26.7927 7.9165 28.4036 7.9165 30.0833V33.25" stroke="#736BEA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.9998 17.4167C22.4976 17.4167 25.3332 14.5811 25.3332 11.0833C25.3332 7.58553 22.4976 4.75 18.9998 4.75C15.502 4.75 12.6665 7.58553 12.6665 11.0833C12.6665 14.5811 15.502 17.4167 18.9998 17.4167Z" stroke="#736BEA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full" style={{ backgroundColor: "#F4A316", border: "2px solid white" }} />
              </div>
            </>
          ) : (
            <>
              <div
                className="w-[114px] h-[60px] border-[2px] border-[#958FEF] rounded-[8px] ml-[36px] text-[#4F46E5] flex items-center justify-center font-medium text-[20px] leading-none tracking-normal text-center cursor-pointer"
                onClick={onSignInClick}
              >
                Log In
              </div>
              <div
                className="w-[125px] h-[60px] bg-[#4F46E5] rounded-[8px] flex items-center justify-center ml-[17px] font-medium text-[20px] leading-none tracking-normal text-center text-white cursor-pointer"
                onClick={onSignUpClick}
              >
                Sign Up
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D1D1D1] mt-[-1px]"></div>
    </>
  );
}