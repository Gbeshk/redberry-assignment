import {
  inputClass,
  labelClass,
  PRIMARY_BTN,
  ErrorMessage,
  OrDivider,
} from "./shared";

interface SignUpStep1Props {
  email: string;
  emailError: string;
  onEmailChange: (v: string) => void;
  onNext: () => void;
  onSignInClick: () => void;
}

export default function SignUpStep1({
  email,
  emailError,
  onEmailChange,
  onNext,
  onSignInClick,
}: SignUpStep1Props) {
  return (
    <>
      <div className="flex flex-col w-full">
        <label htmlFor="signup-email" className={labelClass(!!emailError)}>
          Email*
        </label>
        <input
          type="text"
          id="signup-email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={inputClass(!!emailError)}
        />
        {emailError && <ErrorMessage msg={emailError} />}
      </div>
      <button type="button" className={PRIMARY_BTN} onClick={onNext}>
        Next
      </button>
      <OrDivider />
      <div className="flex items-center justify-center mt-[8px] h-[17px]">
        <p className="text-[#666666] font-normal text-[12px] leading-[100%] tracking-[0%] text-center">
          Already have an account?
        </p>
        <p
          onClick={onSignInClick}
          className="text-[#141414] ml-[8px] font-medium text-[14px] leading-[100%] tracking-[0%] text-center underline decoration-solid decoration-[0%] underline-offset-[25%] cursor-pointer"
        >
          Log In
        </p>
      </div>
    </>
  );
}
