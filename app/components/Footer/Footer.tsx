import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../../../public/images/logo.svg";
import SocialMedia from "../../../public/images/Social Media.svg";

interface FooterProps {
  onEnrolledCoursesClick: () => void;
  onMyProfileClick: () => void;
}

function Footer({ onEnrolledCoursesClick, onMyProfileClick }: FooterProps) {
  const router = useRouter();
  return (
    <div className="w-full h-[334px] border-t-[1px] border-t-[#D1D1D1] mt-[162px]">
      <div className="mt-[80px] flex w-[1566px] mx-auto justify-between">
        <div>
          <div className="flex items-center gap-[12px]">
            <div className="w-[60px] h-[60px] bg-[#4F46E5] rounded-[14px] flex items-center justify-center">
              <Image
                src={Logo}
                width={29}
                height={30}
                alt="logo"
                className="w-[29px] h-[30px]"
              ></Image>
            </div>
            <p className="text-[#130E67] font-medium text-[24px] leading-[24px] tracking-normal">
              Bootcamp
            </p>
          </div>
          <p className=" mt-[16px] text-[#130E67]  font-medium text-[14px] leading-[14px] tracking-normal w-[250px]">
            Your learning journey starts here! Browse courses to get started.
          </p>
          <Image
            src={SocialMedia}
            alt="socialMedia"
            width={177}
            height={19}
            className="w-[177px] h-[19px] mt-[24px]"
          ></Image>
        </div>
        <div className="flex gap-[120px]">
          <div>
            <p className="text-[#130E67] font-semibold text-[20px] leading-[24px] tracking-normal">
              Explore
            </p>
            <p
              onClick={onEnrolledCoursesClick}
              className="text-[#666666] cursor-pointer font-normal mt-[16px] text-[18px] leading-none tracking-normal hover:text-[#4F46E5] transition-colors duration-200"
            >
              Enrolled Courses
            </p>
            <p
              onClick={() => router.push("/courses")}
              className="text-[#666666] cursor-pointer font-normal mt-[8px] text-[18px] leading-none tracking-normal hover:text-[#4F46E5] transition-colors duration-200"
            >
              Browse Courses
            </p>
          </div>
          <div>
            <p className="text-[#130E67] font-semibold text-[20px] leading-[24px] tracking-normal">
              Account
            </p>
            <p
              onClick={onMyProfileClick}
              className="text-[#666666] cursor-pointer font-normal mt-[16px] text-[18px] leading-none tracking-normal hover:text-[#4F46E5] transition-colors duration-200"
            >
              My Profile
            </p>
          </div>
          <div>
            <p className="text-[#130E67] font-semibold text-[20px] leading-none tracking-normal">
              Contact
            </p>
            <div className="mt-[16px] flex h-[24px] items-center gap-[6px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.75 0H0.75C0.551088 0 0.360322 0.0790178 0.21967 0.21967C0.0790176 0.360322 0 0.551088 0 0.75V13.5C0 13.8978 0.158035 14.2794 0.43934 14.5607C0.720644 14.842 1.10218 15 1.5 15H18C18.3978 15 18.7794 14.842 19.0607 14.5607C19.342 14.2794 19.5 13.8978 19.5 13.5V0.75C19.5 0.551088 19.421 0.360322 19.2803 0.21967C19.1397 0.0790178 18.9489 0 18.75 0ZM16.8216 1.5L9.75 7.98281L2.67844 1.5H16.8216ZM18 13.5H1.5V2.45531L9.24281 9.55312C9.38118 9.68014 9.56217 9.75062 9.75 9.75062C9.93783 9.75062 10.1188 9.68014 10.2572 9.55312L18 2.45531V13.5Z"
                    fill="#666666"
                  />
                </svg>
              </div>
              <p className="text-[#666666] text-[18px] leading-none tracking-normal text-center">
                contact@company.com
              </p>
            </div>
            <div className="mt-[10px] flex h-[24px] items-center gap-[6px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.3599 11.555L12.3114 9.74084L12.3002 9.73569C12.0901 9.64579 11.8608 9.60972 11.6332 9.63072C11.4055 9.65173 11.1867 9.72916 10.9966 9.856C10.9742 9.87079 10.9527 9.88686 10.9321 9.90412L8.8404 11.6873C7.51524 11.0437 6.14712 9.68584 5.50345 8.37787L7.28923 6.25436C7.30641 6.23287 7.32274 6.21139 7.33821 6.18819C7.46233 5.99852 7.53763 5.78112 7.55743 5.55532C7.57722 5.32952 7.54088 5.10233 7.45165 4.89397V4.88365L5.63235 0.828263C5.51439 0.556069 5.31157 0.329323 5.05415 0.181875C4.79674 0.0344262 4.49854 -0.0258169 4.20407 0.0101386C3.03959 0.163371 1.97071 0.735252 1.19706 1.61897C0.423411 2.50269 -0.00209768 3.63781 7.77618e-06 4.81233C7.77618e-06 11.6358 5.55157 17.1873 12.375 17.1873C13.5495 17.1894 14.6846 16.7639 15.5684 15.9903C16.4521 15.2166 17.024 14.1477 17.1772 12.9833C17.2132 12.6889 17.1531 12.3908 17.0058 12.1334C16.8585 11.876 16.632 11.6731 16.3599 11.555ZM12.375 15.8123C9.4586 15.8091 6.66256 14.6492 4.60035 12.587C2.53814 10.5248 1.37819 7.72873 1.37501 4.81233C1.37177 3.97314 1.67411 3.16146 2.22556 2.52889C2.77701 1.89631 3.53986 1.48609 4.37165 1.37483C4.37131 1.37826 4.37131 1.38171 4.37165 1.38514L6.17634 5.4242L4.40001 7.55029C4.38198 7.57104 4.3656 7.59317 4.35102 7.61647C4.2217 7.81491 4.14583 8.0434 4.13078 8.27979C4.11572 8.51617 4.16199 8.75244 4.26509 8.96569C5.04368 10.5581 6.64813 12.1505 8.25774 12.9283C8.47256 13.0304 8.71019 13.0751 8.94743 13.0579C9.18467 13.0407 9.41339 12.9623 9.61126 12.8303C9.63332 12.8154 9.65455 12.7994 9.67485 12.7822L11.764 10.9998L15.8031 12.8088C15.8031 12.8088 15.8099 12.8088 15.8125 12.8088C15.7026 13.6418 15.293 14.4062 14.6603 14.959C14.0276 15.5118 13.2152 15.8152 12.375 15.8123Z"
                    fill="#666666"
                  />
                </svg>
              </div>
              <p className="text-[#666666] text-[18px] leading-none tracking-normal text-center">
                (+995) 555 111 222
              </p>
            </div>
            <div className="mt-[10px] flex h-[24px] items-center gap-[6px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <svg
                  width="17"
                  height="21"
                  viewBox="0 0 17 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.25 4.5C7.50832 4.5 6.7833 4.71993 6.16661 5.13199C5.54993 5.54404 5.06928 6.12971 4.78545 6.81494C4.50162 7.50016 4.42736 8.25416 4.57205 8.98159C4.71675 9.70902 5.0739 10.3772 5.59835 10.9017C6.1228 11.4261 6.79098 11.7833 7.51841 11.9279C8.24584 12.0726 8.99984 11.9984 9.68506 11.7145C10.3703 11.4307 10.956 10.9501 11.368 10.3334C11.7801 9.7167 12 8.99168 12 8.25C12 7.25544 11.6049 6.30161 10.9017 5.59835C10.1984 4.89509 9.24456 4.5 8.25 4.5ZM8.25 10.5C7.80499 10.5 7.36998 10.368 6.99997 10.1208C6.62996 9.87357 6.34157 9.52217 6.17127 9.11104C6.00097 8.6999 5.95642 8.2475 6.04323 7.81105C6.13005 7.37459 6.34434 6.97368 6.65901 6.65901C6.97368 6.34434 7.37459 6.13005 7.81105 6.04323C8.2475 5.95642 8.6999 6.00097 9.11104 6.17127C9.52217 6.34157 9.87357 6.62996 10.1208 6.99997C10.368 7.36998 10.5 7.80499 10.5 8.25C10.5 8.84674 10.2629 9.41903 9.84099 9.84099C9.41903 10.2629 8.84674 10.5 8.25 10.5ZM8.25 0C6.06273 0.00248131 3.96575 0.872472 2.41911 2.41911C0.872472 3.96575 0.00248131 6.06273 0 8.25C0 11.1938 1.36031 14.3138 3.9375 17.2734C5.09552 18.6108 6.39886 19.8151 7.82344 20.8641C7.94954 20.9524 8.09978 20.9998 8.25375 20.9998C8.40772 20.9998 8.55796 20.9524 8.68406 20.8641C10.106 19.8147 11.4068 18.6104 12.5625 17.2734C15.1359 14.3138 16.5 11.1938 16.5 8.25C16.4975 6.06273 15.6275 3.96575 14.0809 2.41911C12.5343 0.872472 10.4373 0.00248131 8.25 0ZM8.25 19.3125C6.70031 18.0938 1.5 13.6172 1.5 8.25C1.5 6.45979 2.21116 4.7429 3.47703 3.47703C4.7429 2.21116 6.45979 1.5 8.25 1.5C10.0402 1.5 11.7571 2.21116 13.023 3.47703C14.2888 4.7429 15 6.45979 15 8.25C15 13.6153 9.79969 18.0938 8.25 19.3125Z"
                    fill="#525252"
                  />
                </svg>
              </div>
              <p className="text-[#666666] text-[18px] leading-none tracking-normal text-center">
                Aghmashenebeli St.115
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1566px] mx-auto mt-[74px] flex justify-between items-center">
        <p className="text-[#666666] font-normal text-[18px] leading-none tracking-normal">
          Copyright © 2026 Redberry International
        </p>
        <p className="text-[#666666] font-normal text-[18px] leading-none tracking-normal">
          All Rights Reserved |
          <span className="text-[#4F46E5]"> Terms and Conditions</span> |
          <span className="text-[#4F46E5]"> Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

export default Footer;
