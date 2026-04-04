"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "../public/images/logo.svg";
import NavIcon from "../public/images/NavIcon.svg";
import SwiperPic1 from "../public/images/swiperpic1.png";
import SwiperPic2 from "../public/images/swiperpic2.png";
import SwiperPic3 from "../public/images/swiperpic3.png";
import Footer from "./components/Footer/Footer";
import CoursesSection from "./components/CoursesSection/CoursesSection";
import SignUpModal from "./components/SignUpModal/SignUpModal";
import SignInModal from "./components/SignInModal/SignInModal";
import ProfileModal from "./components/ProfileModal/ProfileModal";
import CurrentCourses from "./components/CurrentCourses/CurrentCourses";

const slides = [
  {
    image: SwiperPic1,
    title: "Start learning something new today",
    subtitle:
      "Explore a wide range of expert-led courses in design, development, business, and more. Find the skills you need to grow your career and learn at your own pace.",
    btnText: "Browse Courses",
  },
  {
    image: SwiperPic2,
    title: "Pick up where you left off",
    subtitle:
      "Your learning journey is already in progress. Continue your enrolled courses, track your progress, and stay on track toward completing your goals.",
    btnText: "Start Learning",
  },
  {
    image: SwiperPic3,
    title: "Learn together, grow faster",
    subtitle: null,
    btnText: "Learn more",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isFirst = current === 0;
  const isLast = current === slides.length - 1;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ avatar?: string } | null>(null);

  return (
    <>
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignUpClick={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
        onSuccess={async () => {
          setIsLoggedIn(true);
          setShowSignInModal(false);
          try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(
              "https://api.redclass.redberryinternship.ge/api/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              },
            );
            const json = await res.json();
            setUserData(json.data);
          } catch (e) {}
        }}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <div className="w-[1566px] h-[60px] mx-auto my-[24px] flex justify-between items-center">
        <div className="w-[60px] h-[60px] bg-[#4F46E5] rounded-[14px] flex items-center justify-center">
          <Image
            src={Logo}
            width={29}
            height={30}
            alt="logo"
            className="w-[29px] h-[30px]"
          />
        </div>
        <div className="flex items-center">
          <div className="w-[220px] h-[56px] gap-[8px] flex items-center justify-center">
            <Image
              src={NavIcon}
              width={26}
              height={26}
              alt="NavIcon"
              className="w-[26px] h-[26px]"
            />
            <p className="text-[#525252] font-medium text-[20px] leading-none tracking-normal">
              Browse Courses
            </p>
          </div>

          {isLoggedIn ? (
            <>
              <div className=" w-[227px] h-[56px] gap-[8px] flex items-center ml-[8px] justify-center">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.9998 7.58333V22.75M12.9998 7.58333C12.9998 6.43406 12.5433 5.33186 11.7306 4.5192C10.918 3.70655 9.81578 3.25 8.6665 3.25H3.24984C2.96252 3.25 2.68697 3.36414 2.4838 3.5673C2.28064 3.77047 2.1665 4.04602 2.1665 4.33333V18.4167C2.1665 18.704 2.28064 18.9795 2.4838 19.1827C2.68697 19.3859 2.96252 19.5 3.24984 19.5H9.74984C10.6118 19.5 11.4384 19.8424 12.0479 20.4519C12.6574 21.0614 12.9998 21.888 12.9998 22.75M12.9998 7.58333C12.9998 6.43406 13.4564 5.33186 14.269 4.5192C15.0817 3.70655 16.1839 3.25 17.3332 3.25H22.7498C23.0372 3.25 23.3127 3.36414 23.5159 3.5673C23.719 3.77047 23.8332 4.04602 23.8332 4.33333V18.4167C23.8332 18.704 23.719 18.9795 23.5159 19.1827C23.3127 19.3859 23.0372 19.5 22.7498 19.5H16.2498C15.3879 19.5 14.5612 19.8424 13.9517 20.4519C13.3422 21.0614 12.9998 21.888 12.9998 22.75"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-[#525252] font-medium text-[20px] leading-none tracking-normal">
                  Enrolled Courses
                </p>
              </div>
              <div
                className="relative ml-[36px] cursor-pointer"
                onClick={() => setShowProfileModal(true)}
              >
                <div
                  className="w-[56px] h-[56px] rounded-full flex items-center justify-center overflow-hidden"
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
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M30.0832 33.25V30.0833C30.0832 28.4036 29.4159 26.7927 28.2282 25.605C27.0404 24.4173 25.4295 23.75 23.7498 23.75H14.2498C12.5701 23.75 10.9592 24.4173 9.77149 25.605C8.58376 26.7927 7.9165 28.4036 7.9165 30.0833V33.25"
                        stroke="#736BEA"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.9998 17.4167C22.4976 17.4167 25.3332 14.5811 25.3332 11.0833C25.3332 7.58553 22.4976 4.75 18.9998 4.75C15.502 4.75 12.6665 7.58553 12.6665 11.0833C12.6665 14.5811 15.502 17.4167 18.9998 17.4167Z"
                        stroke="#736BEA"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-[15px] h-[15px] rounded-full"
                  style={{
                    backgroundColor: "#F4A316",
                    border: "2px solid white",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="w-[114px] h-[60px] border-[2px] border-[#958FEF] rounded-[8px] ml-[36px] text-[#4F46E5] flex items-center justify-center font-medium text-[20px] leading-none tracking-normal text-center cursor-pointer"
                onClick={() => setShowSignInModal(true)}
              >
                Log In
              </div>
              <div
                className="w-[125px] h-[60px] bg-[#4F46E5] rounded-[8px] flex items-center justify-center ml-[17px] font-medium text-[20px] leading-none tracking-normal text-center text-white cursor-pointer"
                onClick={() => setShowSignUpModal(true)}
              >
                Sign Up
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D1D1D1] mt-[-1px]"></div>

      <div className="w-[1566px] h-[420px] mx-auto mt-[62px] rounded-[30px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${current * 1566}px)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-[1566px] h-[420px] rounded-[30px] p-[48px] flex flex-col justify-between"
              style={{
                backgroundImage: `url(${slide.image.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div>
                <h1 className="text-white font-bold text-[48px] leading-none tracking-normal mt-[4px]">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <h2 className="text-white font-light text-[24px] leading-none tracking-normal w-[1218px] mt-[24px]">
                    {slide.subtitle}
                  </h2>
                )}
                <div className="bg-[#4F46E5] mt-[40px] w-[206px] h-[64px] flex items-center justify-center rounded-[8px] font-medium text-[20px] leading-none tracking-normal text-white cursor-pointer">
                  {slide.btnText}
                </div>
              </div>

              <div className="flex mt-[31px] items-center justify-between">
                <div className="h-[54px] w-[132px] opacity-0"></div>

                <div className="flex gap-[12px] h-[54px] items-center">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="w-[57px] h-[8px] rounded-[999px] cursor-pointer transition-colors duration-300"
                      style={{
                        backgroundColor: i === index ? "#F5F5F5" : "#C1BCBC80",
                      }}
                    />
                  ))}
                </div>

                <div className="h-[54px] w-[132px] flex items-center justify-center gap-[24px]">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                    onClick={prev}
                  >
                    <path
                      d="M21.9375 0C17.5987 0 13.3573 1.28661 9.74969 3.69714C6.14208 6.10766 3.3303 9.53383 1.6699 13.5424C0.00950518 17.5509 -0.42493 21.9618 0.421533 26.2173C1.268 30.4728 3.35734 34.3816 6.42535 37.4497C9.49337 40.5177 13.4023 42.607 17.6577 43.4535C21.9132 44.2999 26.3241 43.8655 30.3326 42.2051C34.3412 40.5447 37.7673 37.7329 40.1779 34.1253C42.5884 30.5177 43.875 26.2763 43.875 21.9375C43.8689 16.1212 41.5556 10.5449 37.4429 6.43213C33.3301 2.31938 27.7538 0.00614212 21.9375 0ZM21.9375 40.5C18.2662 40.5 14.6773 39.4113 11.6247 37.3717C8.57215 35.332 6.19295 32.4329 4.788 29.0411C3.38304 25.6492 3.01544 21.9169 3.73168 18.3161C4.44792 14.7154 6.21583 11.4078 8.81184 8.81183C11.4079 6.21582 14.7154 4.44791 18.3161 3.73167C21.9169 3.01543 25.6492 3.38303 29.0411 4.78799C32.4329 6.19294 35.332 8.57214 37.3717 11.6247C39.4113 14.6773 40.5 18.2662 40.5 21.9375C40.4944 26.8589 38.5369 31.5771 35.057 35.057C31.5771 38.5369 26.8589 40.4944 21.9375 40.5ZM26.5064 14.6939L19.2607 21.9375L26.5064 29.1811C26.6632 29.3379 26.7876 29.524 26.8724 29.7289C26.9573 29.9337 27.0009 30.1533 27.0009 30.375C27.0009 30.5967 26.9573 30.8163 26.8724 31.0211C26.7876 31.226 26.6632 31.4121 26.5064 31.5689C26.3496 31.7257 26.1635 31.8501 25.9586 31.9349C25.7538 32.0198 25.5342 32.0634 25.3125 32.0634C25.0908 32.0634 24.8712 32.0198 24.6664 31.9349C24.4615 31.8501 24.2754 31.7257 24.1186 31.5689L15.6811 23.1314C15.5242 22.9747 15.3997 22.7886 15.3148 22.5837C15.2299 22.3789 15.1862 22.1593 15.1862 21.9375C15.1862 21.7157 15.2299 21.4961 15.3148 21.2913C15.3997 21.0864 15.5242 20.9003 15.6811 20.7436L24.1186 12.3061C24.2754 12.1493 24.4615 12.0249 24.6664 11.9401C24.8712 11.8552 25.0908 11.8116 25.3125 11.8116C25.5342 11.8116 25.7538 11.8552 25.9586 11.9401C26.1635 12.0249 26.3496 12.1493 26.5064 12.3061C26.6632 12.4629 26.7876 12.649 26.8724 12.8539C26.9573 13.0587 27.0009 13.2783 27.0009 13.5C27.0009 13.7217 26.9573 13.9413 26.8724 14.1461C26.7876 14.351 26.6632 14.5371 26.5064 14.6939Z"
                      fill={isFirst ? "#C1BCBC" : "white"}
                      fillOpacity={isFirst ? "0.5" : "1"}
                    />
                  </svg>
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                    onClick={next}
                  >
                    <path
                      d="M21.9375 0C17.5987 0 13.3573 1.28661 9.74969 3.69714C6.14208 6.10766 3.3303 9.53383 1.6699 13.5424C0.00950518 17.5509 -0.42493 21.9618 0.421533 26.2173C1.268 30.4728 3.35734 34.3816 6.42535 37.4497C9.49337 40.5177 13.4023 42.607 17.6577 43.4535C21.9132 44.2999 26.3241 43.8655 30.3326 42.2051C34.3412 40.5447 37.7673 37.7329 40.1779 34.1253C42.5884 30.5177 43.875 26.2763 43.875 21.9375C43.8689 16.1212 41.5556 10.5449 37.4429 6.43213C33.3301 2.31938 27.7538 0.00614212 21.9375 0ZM21.9375 40.5C18.2662 40.5 14.6773 39.4113 11.6247 37.3717C8.57215 35.332 6.19295 32.4329 4.788 29.0411C3.38304 25.6492 3.01544 21.9169 3.73168 18.3161C4.44792 14.7154 6.21583 11.4078 8.81184 8.81183C11.4079 6.21582 14.7154 4.44791 18.3161 3.73167C21.9169 3.01543 25.6492 3.38303 29.0411 4.78799C32.4329 6.19294 35.332 8.57214 37.3717 11.6247C39.4113 14.6773 40.5 18.2662 40.5 21.9375C40.4944 26.8589 38.5369 31.5771 35.057 35.057C31.5771 38.5369 26.8589 40.4944 21.9375 40.5ZM28.1939 20.7436C28.3508 20.9003 28.4753 21.0864 28.5602 21.2913C28.6451 21.4961 28.6888 21.7157 28.6888 21.9375C28.6888 22.1593 28.6451 22.3789 28.5602 22.5837C28.4753 22.7886 28.3508 22.9747 28.1939 23.1314L19.7564 31.5689C19.5996 31.7257 19.4135 31.8501 19.2086 31.9349C19.0038 32.0198 18.7842 32.0634 18.5625 32.0634C18.3408 32.0634 18.1212 32.0198 17.9164 31.9349C17.7115 31.8501 17.5254 31.7257 17.3686 31.5689C17.2118 31.4121 17.0874 31.226 17.0026 31.0211C16.9177 30.8163 16.8741 30.5967 16.8741 30.375C16.8741 30.1533 16.9177 29.9337 17.0026 29.7289C17.0874 29.524 17.2118 29.3379 17.3686 29.1811L24.6143 21.9375L17.3686 14.6939C17.052 14.3773 16.8741 13.9478 16.8741 13.5C16.8741 13.0522 17.052 12.6227 17.3686 12.3061C17.6852 11.9894 18.1147 11.8116 18.5625 11.8116C19.0103 11.8116 19.4398 11.9894 19.7564 12.3061L28.1939 20.7436Z"
                      fill={isLast ? "#C1BCBC" : "white"}
                      fillOpacity={isLast ? "0.5" : "1"}
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CoursesSection />
      <CurrentCourses />
      <Footer />
    </>
  );
}
