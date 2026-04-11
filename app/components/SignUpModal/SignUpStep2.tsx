import ShowPassSvg from "@/app/components/icons/ShowPassSvg";
import HidePassSvg from "@/app/components/icons/HidePassSvg";
import {
  inputClass,
  labelClass,
  eyeColor,
  PRIMARY_BTN,
  ErrorMessage,
  OrDivider,
  LogInRow,
} from "./shared";

interface SignUpStep2Props {
  password: string;
  confirmPassword: string;
  passwordError: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isPasswordFocused: boolean;
  isConfirmPasswordFocused: boolean;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onPasswordFocus: (v: boolean) => void;
  onConfirmPasswordFocus: (v: boolean) => void;
  onNext: () => void;
  onSignInClick: () => void;
}

export default function SignUpStep2({
  password,
  confirmPassword,
  passwordError,
  showPassword,
  showConfirmPassword,
  isPasswordFocused,
  isConfirmPasswordFocused,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onPasswordFocus,
  onConfirmPasswordFocus,
  onNext,
  onSignInClick,
}: SignUpStep2Props) {
  const hasError = !!passwordError;

  const PasswordToggle = ({
    show,
    onToggle,
    isFocused,
  }: {
    show: boolean;
    onToggle: () => void;
    isFocused: boolean;
  }) => (
    <div
      className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer mt-[4px]"
      onClick={onToggle}
    >
      {show ? (
        <ShowPassSvg color={eyeColor(hasError, isFocused)} />
      ) : (
        <HidePassSvg color={eyeColor(hasError, isFocused)} />
      )}
    </div>
  );

  return (
    <>
      <div className="flex flex-col w-full">
        <label htmlFor="signup-password" className={labelClass(hasError)}>
          Password*
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="signup-password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onFocus={() => onPasswordFocus(true)}
            onBlur={() => onPasswordFocus(false)}
            className={`${inputClass(hasError)} pr-[40px]`}
          />
          <PasswordToggle
            show={showPassword}
            onToggle={onTogglePassword}
            isFocused={isPasswordFocused}
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="signup-confirm" className={labelClass(hasError)}>
          Confirm Password*
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="signup-confirm"
            name="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            onFocus={() => onConfirmPasswordFocus(true)}
            onBlur={() => onConfirmPasswordFocus(false)}
            className={`${inputClass(hasError)} pr-[40px]`}
          />
          <PasswordToggle
            show={showConfirmPassword}
            onToggle={onToggleConfirmPassword}
            isFocused={isConfirmPasswordFocused}
          />
        </div>
        {passwordError && <ErrorMessage msg={passwordError} />}
      </div>

      <button
        type="button"
        className={`${PRIMARY_BTN} mt-[16px]`}
        onClick={onNext}
      >
        Next
      </button>
      <OrDivider />
      <LogInRow onClick={onSignInClick} />
    </>
  );
}
