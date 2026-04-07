"use client";
import Image from "next/image";
import Logo from "../../../public/images/logo.svg";
import NavIcon from "../icons/NavIcon";
import { useRouter } from "next/navigation";
import EnrolledCoursesIcon from "../icons/EnrolledCoursesIcon";
import ProfileSvg from "../icons/ProfileSvg";

interface HeaderProps {
  isLoggedIn: boolean;
  userData: { avatar?: string } | null;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onProfileClick: () => void;
  onEnrolledCoursesClick: () => void;
  profileCompleted?: boolean;
}

export default function Header({
  isLoggedIn,
  userData,
  onSignInClick,
  onSignUpClick,
  onProfileClick,
  onEnrolledCoursesClick,
  profileCompleted,
}: HeaderProps) {
  const router = useRouter();
  return (
    <>
      <div className="flex w-[full] items-center h-[108px]  border-b-[#D1D1D1] border-b-[1px]">
        <div className="w-[1566px] h-[60px] mx-auto my-[24px] flex justify-between items-center">
          <div
            className="w-[60px] h-[60px] bg-[#4F46E5] rounded-[14px] flex items-center justify-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src={Logo}
              width={29}
              height={30}
              alt="logo"
              className="w-[29px] h-[30px]"
            />
          </div>
          <div className="flex items-center min-w-[510px] shrink-0">
            <div
              onClick={() => {
                router.push("/courses");
              }}
              className="min-w-[220px] shrink-0 h-[56px] gap-[8px] flex items-center justify-center group cursor-pointer"
            >
              <div className="text-[#525252] group-hover:text-[#4F46E5] transition-colors duration-300 ease-in-out">
                <NavIcon />
              </div>

              <p className="text-[#525252] font-medium text-[20px] leading-[100%] tracking-normal group-hover:text-[#4F46E5] transition-colors duration-[600ms] ease-in-out">
                Browse Courses
              </p>
            </div>

            {isLoggedIn ? (
              <>
                <div
                  onClick={onEnrolledCoursesClick}
                  className="min-w-[227px] shrink-0 h-[56px] ml-[8px] gap-[8px] justify-center flex items-center group cursor-pointer"
                >
                  <div className="text-[#525252] group-hover:text-[#4F46E5] transition-colors duration-300 ease-in-out">
                    <EnrolledCoursesIcon />
                  </div>
                  <p className="text-[#525252] font-medium text-[20px] leading-none tracking-normal group-hover:text-[#4F46E5] transition-colors duration-[600ms] ease-in-out">
                    Enrolled Courses
                  </p>
                </div>
                <div
                  className="relative ml-[36px] cursor-pointer group"
                  onClick={onProfileClick}
                >
                  <div
                    className="w-[56px] h-[56px] rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-out group-hover:ring-[1.5px] group-hover:ring-[#B7B3F4]"
                    style={{ backgroundColor: "#EEEDFC" }}
                  >
                    {userData?.avatar ? (
                      <Image
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        width={56}
                        height={56}
                      />
                    ) : (
                      <ProfileSvg />
                    )}
                  </div>
                  <div
                    className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full"
                    style={{
                      backgroundColor: profileCompleted ? "#1DC31D" : "#F4A316",
                      border: "2px solid white",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between w-[254px] h-[60px] ml-[36px]">
                <div
                  onClick={onSignInClick}
                  className="w-[114px] h-[60px]
  flex items-center justify-center text-center cursor-pointer
  border-[2px] border-[#958FEF] rounded-[8px]
  font-medium text-[20px] leading-none tracking-normal
  text-[#4F46E5]

  transition-colors duration-300 ease-out

  hover:bg-[#281ED2] hover:text-white hover:border-[#281ED2]
  active:bg-[#1E169D] active:border-[#1E169D]"
                >
                  Log In
                </div>
                <div
                  className="w-[125px] h-[60px] bg-[#4F46E5] rounded-[8px] flex items-center justify-center font-medium text-[20px] leading-none tracking-normal text-center text-white cursor-pointer"
                  onClick={onSignUpClick}
                >
                  Sign Up
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
