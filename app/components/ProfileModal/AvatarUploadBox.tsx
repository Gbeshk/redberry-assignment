import Image from "next/image";
import UploadPhotoIcon from "@/app/components/icons/UploadPhotoIcon";
import { formatFileSize } from "@/app/utils/formatFileSize";

interface AvatarUploadBoxProps {
  avatarFile: File | null;
  avatarPreview: string | null;
  onFileChange: (file: File) => void;
}

export default function AvatarUploadBox({
  avatarFile,
  avatarPreview,
  onFileChange,
}: AvatarUploadBoxProps) {
  const triggerInput = () =>
    document.getElementById("profileAvatarInput")?.click();

  const hasPreview = !!(avatarPreview && avatarFile);

  return (
    <div className="flex flex-col mt-[12px]">
      <label className="text-sm font-medium">Upload Avatar</label>
      <div
        onClick={triggerInput}
        className={`avatar-upload-box mt-[8px] rounded-[8px] flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200
          ${hasPreview
            ? "border-[1.5px] border-[#DDDBFA] bg-[#EEEDFC]"
            : "border-[1.5px] border-[#D1D1D1] bg-transparent hover:border-[#B7B3F4] hover:bg-[#EEEDFC]"
          }`}
        style={{ width: "360px", height: "140px" }}
      >
        {hasPreview ? (
          <div className="w-[240px] h-[54px] flex items-center gap-[10px]">
            <Image
              src={avatarPreview!}
              alt="Avatar preview"
              width={54}
              height={54}
              className="w-[54px] h-[54px] rounded-[40px] object-cover flex-shrink-0"
            />
            <div className="h-[41px] min-w-0 flex-1">
              <p className="text-[#525252] h-[15px] flex items-center font-normal text-xs leading-none tracking-normal overflow-hidden">
                <span className="truncate block max-w-[140px]">
                  {avatarFile!.name}
                </span>
              </p>
              <p className="text-[#ADADAD] font-normal text-[10px] leading-none tracking-normal h-[12px] flex items-center">
                Size — {formatFileSize(avatarFile!.size)}
              </p>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInput();
                }}
                className="h-[12px] flex items-center mt-[2px] text-[#4F46E5] font-medium text-[10px] leading-none tracking-normal underline decoration-solid underline-offset-[25%] decoration-[0px] cursor-pointer"
              >
                Change
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadPhotoIcon />
            <p className="mt-[8px] text-[#666666] font-medium text-sm leading-none">
              Drag and drop or{" "}
              <span className="text-[#281ED2] underline decoration-solid underline-offset-[25%]">
                Upload file
              </span>
            </p>
            <p className="text-[#ADADAD] mt-[8px] font-normal text-xs leading-none">
              JPG, PNG or WebP
            </p>
          </div>
        )}

        <input
          type="file"
          id="profileAvatarInput"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileChange(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
