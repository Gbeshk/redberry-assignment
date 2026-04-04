import Image from "next/image";
import React from "react";
import def_img from "../../../public/images/default-course-img.png";
export default function CurrentCourses() {
  return (
    <div className="w-[1566px] mx-auto  mt-[120px]">
      <h1 className="text-[#0A0A0A] font-semibold text-[40px] leading-[100%] tracking-[0%] h-[48px] flex items-center ">
        Continue Learning
      </h1>
      <div className="flex items-center h-[22px] mt-[6px] justify-between">
        <p className=" text-[#3D3D3D] font-medium text-[18px] leading-[100%] tracking-[0%]">
          Pick up where you left
        </p>
        <p className="text-[#4F46E5]  font-medium text-[20px] leading-[100%] tracking-[0%] underline decoration-solid underline-offset-[3px] decoration-0">
          See All
        </p>
      </div>
      <div className="w-full mt-[32px] h-[219px] flex items-center justify-between relative">
        <div className="absolute w-[418px] h-[233px] bg-white rounded-[12px] border-[1px] border-[#ADADAD] left-1/2 -translate-x-[calc(50%+27px)] z-10 flex items-center flex-col">
          <div className="w-[74px] h-[77px] rounded-full flex items-center justify-center bg-[#DDDBFA] mt-[26px]">
            <svg
              width="34"
              height="37"
              viewBox="0 0 34 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.8889 17H6.11111C4.39289 17 3 18.4652 3 20.2727V31.7273C3 33.5347 4.39289 35 6.11111 35H27.8889C29.6071 35 31 33.5347 31 31.7273V20.2727C31 18.4652 29.6071 17 27.8889 17Z"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 17V10.3333C9 8.1232 9.84285 6.00358 11.3431 4.44078C12.8434 2.87797 14.8783 2 17 2C19.1217 2 21.1566 2.87797 22.6569 4.44078C24.1571 6.00358 25 8.1232 25 10.3333V17"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="17" cy="25" r="2" fill="#4F46E5" />
            </svg>
          </div>
          <p className="h-[24px] flex items-center text-[#0A0836] mt-[12px] font-medium text-[16px] leading-[24px] tracking-[0%]">
            Sign in to track your learning progress
          </p>
          <div className="w-[83px] h-[42px] rounded-[8px] bg-[#4F46E5] mt-[24px] text-[#F5F5F5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center flex items-center justify-center">
            Log In
          </div>
        </div>
        <div className="w-[506px] h-full bg-white rounded-[12px] p-[20px] blur-[20px]">
          <div className="flex gap-[16px]">
            <Image
              src={def_img}
              width={140}
              height={123}
              alt="defImg"
              className="w-[140px] h-[123px] rounded-[12px] object-cover"
            ></Image>
            <div>
              <div className="w-[306px] h-[18px] flex items-center justify-between">
                <p className="text-[#8A8A8A] font-medium text-[14px] leading-[100%] tracking-[0%]">
                  Lecturer <span className="text-[#666666]">Marilyn Mango</span>
                </p>
                <div className="flex items-center gap-[4px] h-[18px]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6479 4.81838C10.7896 5.12026 11.0725 5.33164 11.4021 5.38201L14.691 5.88447C15.4956 6.00739 15.8242 6.98876 15.2558 7.57135L12.814 10.074C12.5923 10.3012 12.4917 10.6201 12.5428 10.9333L13.1106 14.4147C13.2449 15.2386 12.3704 15.8547 11.6399 15.4509L8.79101 13.8764C8.48996 13.71 8.12453 13.71 7.8235 13.8764L4.97567 15.4507C4.24511 15.8545 3.37056 15.2384 3.50492 14.4145L4.07267 10.9334C4.12377 10.6201 4.02309 10.3011 3.80139 10.074L1.35912 7.57143C0.790594 6.98887 1.11913 6.00737 1.9238 5.88446L5.21324 5.38201C5.54296 5.33165 5.82586 5.1202 5.96754 4.81825L7.40211 1.76078C7.76195 0.993865 8.8527 0.993786 9.21265 1.76065L10.6479 4.81838Z"
                      fill="#F4A316"
                    />
                  </svg>
                  <p className="text-[#525252] font-medium text-[14px] leading-[100%] tracking-[0%] ">
                    4.9
                  </p>
                </div>
              </div>
              <h1 className="mt-[9px] text-[#141414] font-semibold text-[20px] leading-[24px] tracking-[0%]">
                Advanced React & TypeScript Development
              </h1>
            </div>
          </div>
          <div className="w-full h-[48px]  mt-[8px] flex items-center justify-between">
            <div className="flex flex-col mt-[4px]">
              <p className="text-[#141414] h-[16px] flex items-center font-medium text-[12px] leading-[100%] tracking-[0%]">
                65% Complete
              </p>
              <div className="w-[336px] h-[15.13px] bg-[#DDDBFA] rounded-[30px]">
                <div className="h-full w-[202.56px] bg-[#4F46E5] rounded-[30px]"></div>
              </div>
            </div>
            <div className="w-[90px] h-[48px] border-[2px] border-[#958FEF] rounded-[8px] flex items-center justify-center text-[#4F46E5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center ">
              View
            </div>
          </div>
        </div>
        <div className="w-[506px] h-full bg-white rounded-[12px] p-[20px]  blur-[20px]">
          <div className="flex gap-[16px]">
            <Image
              src={def_img}
              width={140}
              height={123}
              alt="defImg"
              className="w-[140px] h-[123px] rounded-[12px] object-cover"
            ></Image>
            <div>
              <div className="w-[306px] h-[18px] flex items-center justify-between">
                <p className="text-[#8A8A8A] font-medium text-[14px] leading-[100%] tracking-[0%]">
                  Lecturer <span className="text-[#666666]">Marilyn Mango</span>
                </p>
                <div className="flex items-center gap-[4px] h-[18px]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6479 4.81838C10.7896 5.12026 11.0725 5.33164 11.4021 5.38201L14.691 5.88447C15.4956 6.00739 15.8242 6.98876 15.2558 7.57135L12.814 10.074C12.5923 10.3012 12.4917 10.6201 12.5428 10.9333L13.1106 14.4147C13.2449 15.2386 12.3704 15.8547 11.6399 15.4509L8.79101 13.8764C8.48996 13.71 8.12453 13.71 7.8235 13.8764L4.97567 15.4507C4.24511 15.8545 3.37056 15.2384 3.50492 14.4145L4.07267 10.9334C4.12377 10.6201 4.02309 10.3011 3.80139 10.074L1.35912 7.57143C0.790594 6.98887 1.11913 6.00737 1.9238 5.88446L5.21324 5.38201C5.54296 5.33165 5.82586 5.1202 5.96754 4.81825L7.40211 1.76078C7.76195 0.993865 8.8527 0.993786 9.21265 1.76065L10.6479 4.81838Z"
                      fill="#F4A316"
                    />
                  </svg>
                  <p className="text-[#525252] font-medium text-[14px] leading-[100%] tracking-[0%] ">
                    4.9
                  </p>
                </div>
              </div>
              <h1 className="mt-[9px] text-[#141414] font-semibold text-[20px] leading-[24px] tracking-[0%]">
                Advanced React & TypeScript Development
              </h1>
            </div>
          </div>
          <div className="w-full h-[48px]  mt-[8px] flex items-center justify-between">
            <div className="flex flex-col mt-[4px]">
              <p className="text-[#141414] h-[16px] flex items-center font-medium text-[12px] leading-[100%] tracking-[0%]">
                65% Complete
              </p>
              <div className="w-[336px] h-[15.13px] bg-[#DDDBFA] rounded-[30px]">
                <div className="h-full w-[202.56px] bg-[#4F46E5] rounded-[30px]"></div>
              </div>
            </div>
            <div className="w-[90px] h-[48px] border-[2px] border-[#958FEF] rounded-[8px] flex items-center justify-center text-[#4F46E5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center ">
              View
            </div>
          </div>
        </div>
        <div className="w-[506px] h-full bg-white rounded-[12px] p-[20px] blur-[10px] ">
          <div className="flex gap-[16px]">
            <Image
              src={def_img}
              width={140}
              height={123}
              alt="defImg"
              className="w-[140px] h-[123px] rounded-[12px] object-cover"
            ></Image>
            <div>
              <div className="w-[306px] h-[18px] flex items-center justify-between">
                <p className="text-[#8A8A8A] font-medium text-[14px] leading-[100%] tracking-[0%]">
                  Lecturer <span className="text-[#666666]">Marilyn Mango</span>
                </p>
                <div className="flex items-center gap-[4px] h-[18px]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6479 4.81838C10.7896 5.12026 11.0725 5.33164 11.4021 5.38201L14.691 5.88447C15.4956 6.00739 15.8242 6.98876 15.2558 7.57135L12.814 10.074C12.5923 10.3012 12.4917 10.6201 12.5428 10.9333L13.1106 14.4147C13.2449 15.2386 12.3704 15.8547 11.6399 15.4509L8.79101 13.8764C8.48996 13.71 8.12453 13.71 7.8235 13.8764L4.97567 15.4507C4.24511 15.8545 3.37056 15.2384 3.50492 14.4145L4.07267 10.9334C4.12377 10.6201 4.02309 10.3011 3.80139 10.074L1.35912 7.57143C0.790594 6.98887 1.11913 6.00737 1.9238 5.88446L5.21324 5.38201C5.54296 5.33165 5.82586 5.1202 5.96754 4.81825L7.40211 1.76078C7.76195 0.993865 8.8527 0.993786 9.21265 1.76065L10.6479 4.81838Z"
                      fill="#F4A316"
                    />
                  </svg>
                  <p className="text-[#525252] font-medium text-[14px] leading-[100%] tracking-[0%] ">
                    4.9
                  </p>
                </div>
              </div>
              <h1 className="mt-[9px] text-[#141414] font-semibold text-[20px] leading-[24px] tracking-[0%]">
                Advanced React & TypeScript Development
              </h1>
            </div>
          </div>
          <div className="w-full h-[48px]  mt-[8px] flex items-center justify-between">
            <div className="flex flex-col mt-[4px]">
              <p className="text-[#141414] h-[16px] flex items-center font-medium text-[12px] leading-[100%] tracking-[0%]">
                65% Complete
              </p>
              <div className="w-[336px] h-[15.13px] bg-[#DDDBFA] rounded-[30px]">
                <div className="h-full w-[202.56px] bg-[#4F46E5] rounded-[30px]"></div>
              </div>
            </div>
            <div className="w-[90px] h-[48px] border-[2px] border-[#958FEF] rounded-[8px] flex items-center justify-center text-[#4F46E5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center ">
              View
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
