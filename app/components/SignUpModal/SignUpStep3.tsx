import {
  inputClass,
  labelClass,
  PRIMARY_BTN,
  ErrorMessage,
  OrDivider,
  LogInRow,
} from "./shared";
import SignUpAvatarUpload from "./SignUpAvatarUpload";

interface SignUpStep3Props {
  username: string;
  usernameError: string;
  avatar: File | null;
  avatarPreview: string | null;
  avatarError: string;
  submitError: string;
  isSubmitting: boolean;
  onUsernameChange: (v: string) => void;
  onAvatarChange: (file: File) => void;
  onAvatarRemove: () => void;
  onSubmit: () => void;
  onSignInClick: () => void;
}

export default function SignUpStep3({
  username,
  usernameError,
  avatar,
  avatarPreview,
  avatarError,
  submitError,
  isSubmitting,
  onUsernameChange,
  onAvatarChange,
  onAvatarRemove,
  onSubmit,
  onSignInClick,
}: SignUpStep3Props) {
  return (
    <>
      <div className="flex flex-col w-full">
        <label
          htmlFor="signup-username"
          className={labelClass(!!usernameError)}
        >
          Username*
        </label>
        <input
          type="text"
          id="signup-username"
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className={inputClass(!!usernameError)}
        />
        {usernameError && <ErrorMessage msg={usernameError} />}
      </div>

      <SignUpAvatarUpload
        avatar={avatar}
        avatarPreview={avatarPreview}
        avatarError={avatarError}
        onFileChange={onAvatarChange}
        onRemove={onAvatarRemove}
      />

      {submitError && <ErrorMessage msg={submitError} />}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className={`${PRIMARY_BTN} disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
      <OrDivider />
      <LogInRow onClick={onSignInClick} />
    </>
  );
}
