// Shared style helpers + tiny presentational atoms for SignUpModal steps

export const inputClass = (hasError: boolean) =>
  `w-full mt-[8px] h-[48px] rounded-[8px] pl-[13px] pr-[15px] py-[12px]
   text-[14px] font-inter font-medium leading-[100%] tracking-[0%]
   focus:outline-none focus:ring-0 caret-[#8A8A8A]
   placeholder:text-[#8A8A8A] placeholder:font-medium placeholder:text-[14px]
   hover:placeholder:text-[#D1D1D1] focus:placeholder:text-[#F5F5F5]
   ${
     hasError
       ? "border-[1.5px] border-[#F4161A] text-[#F4161A]"
       : "border-[1.5px] border-[#D1D1D1] text-[#3D3D3D] hover:border-[#ADADAD] focus:border-[#8A8A8A]"
   }`;

export const labelClass = (hasError: boolean) =>
  `mt-[24px] text-sm font-medium h-[17px] flex items-center${hasError ? " text-[#F4161A]" : ""}`;

export const eyeColor = (hasError: boolean, isFocused: boolean) => {
  if (hasError) return "#F4161A";
  if (isFocused) return "#8A8A8A";
  return "#ADADAD";
};

export const PRIMARY_BTN =
  "w-[360px] h-[47px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out rounded-[10px] flex items-center justify-center font-medium text-[16px] leading-[24px] tracking-[0%] text-white mt-[18px] cursor-pointer";

export function ErrorMessage({ msg }: { msg: string }) {
  return (
    <p className="error-message mt-[4px] text-[12px] font-normal leading-[100%] tracking-[0%] h-[17px] flex items-center text-[#F4161A]">
      {msg}
    </p>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center w-[320px] mx-auto mt-[16px] h-[21px]">
      <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
      <span className="px-[8px] text-[14px] font-inter font-medium leading-[100%] tracking-[0%] text-center text-[#8A8A8A]">
        or
      </span>
      <div className="flex-1 h-[1px] bg-[#D1D1D1]" />
    </div>
  );
}

export function LogInRow({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center justify-center mt-[8px]">
      <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
        Already have an account?
      </p>
      <p
        onClick={onClick}
        className="text-[#141414] ml-[8px] decoration-skip-ink-auto font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
      >
        Log In
      </p>
    </div>
  );
}
