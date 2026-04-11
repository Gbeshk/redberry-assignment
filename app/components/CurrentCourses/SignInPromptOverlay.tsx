interface SignInPromptOverlayProps {
  onSignInClick?: () => void;
}

export default function SignInPromptOverlay({
  onSignInClick,
}: SignInPromptOverlayProps) {
  return (
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
      <div
        onClick={onSignInClick}
        tabIndex={0}
        className="w-[83px] h-[42px] rounded-[8px] bg-[#4F46E5] mt-[24px] text-[#F5F5F5] font-medium text-[16px] leading-[24px] tracking-[0%] text-center flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out hover:bg-[#281ED2] focus:bg-[#1E169D] focus:outline-none"
      >
        Log In
      </div>
    </div>
  );
}
