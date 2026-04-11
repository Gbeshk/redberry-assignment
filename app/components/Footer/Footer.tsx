import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/public/images/logo.svg";
import SocialMedia from "@/public/images/Social Media.svg";
import EmailIcon from "@/app/components/icons/EmailIcon";
import PhoneIcon from "@/app/components/icons/PhoneIcon";
import AddressIcon from "@/app/components/icons/AddressIcon";

const CONTACT_ITEMS = [
  { Icon: EmailIcon, text: "contact@company.com" },
  { Icon: PhoneIcon, text: "(+995) 555 111 222" },
  { Icon: AddressIcon, text: "Aghmashenebeli St.115" },
];

interface FooterProps {
  onEnrolledCoursesClick: () => void;
  onMyProfileClick: () => void;
}

export default function Footer({
  onEnrolledCoursesClick,
  onMyProfileClick,
}: FooterProps) {
  const router = useRouter();

  return (
    <div className="w-full h-[334px] border-t-[1px] border-t-[#D1D1D1] mt-[162px]">
      <div className="mt-[80px] flex w-[1566px] mx-auto justify-between">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-[12px]">
            <div className="w-[60px] h-[60px] bg-[#4F46E5] rounded-[14px] flex items-center justify-center">
              <Image
                src={Logo}
                width={29}
                height={30}
                alt="logo"
                className="w-[29px] h-[30px]"
              />
            </div>
            <p className="text-[#130E67] font-medium text-[24px] leading-[24px] tracking-normal">
              Bootcamp
            </p>
          </div>
          <p className="mt-[16px] text-[#130E67] font-medium text-[14px] leading-[14px] tracking-normal w-[250px]">
            Your learning journey starts here! Browse courses to get started.
          </p>
          <Image
            src={SocialMedia}
            alt="socialMedia"
            width={177}
            height={19}
            className="w-[177px] h-[19px] mt-[24px]"
          />
        </div>

        <div className="flex gap-[120px]">
          {/* Explore */}
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

          {/* Account */}
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

          {/* Contact */}
          <div>
            <p className="text-[#130E67] font-semibold text-[20px] leading-none tracking-normal">
              Contact
            </p>
            <div className="flex flex-col mt-[16px] gap-[10px]">
              {CONTACT_ITEMS.map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex h-[24px] items-center gap-[6px]"
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center">
                    <Icon />
                  </div>
                  <p className="text-[#666666] text-[18px] leading-none tracking-normal text-center">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
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
