import CongratulateIcon from "@/app/components/icons/CongratulateIcon";
import StarRating from "./StarRating";
import StarHalf from "@/app/components/icons/StarHalf";
import StarFull from "@/app/components/icons/StarFull";
import StarEmpty from "@/app/components/icons/StarEmpty";

interface CongratsModalProps {
  courseTitle: string;
  rating: number | null;
  hoverRating: number | null;
  ratingSubmitted: boolean;
  isRating: boolean;
  onRate: (star: number) => void;
  onHover: (star: number | null) => void;
  onDone: () => void;
  onClose: () => void;
}

export default function CongratsModal({
  courseTitle,
  rating,
  hoverRating,
  ratingSubmitted,
  isRating,
  onRate,
  onHover,
  onDone,
  onClose,
}: CongratsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#00000040" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-[460px] rounded-[16px] p-[50px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <CongratulateIcon />
        <p className="font-semibold text-3xl leading-none tracking-normal h-[39px] flex items-center text-center text-[#3D3D3D] mt-[24px]">
          Congratulations!
        </p>
        <p className="font-medium text-xl leading-none tracking-normal text-center text-[#3D3D3D] mt-[24px]">
          {"You've completed "}
          <span className="font-semibold">{`"${courseTitle}"`}</span>
          {" Course!"}
        </p>

        {ratingSubmitted ? (
          <p className="mt-[40px] font-medium text-[16px] leading-[24px] tracking-[0] text-center text-[#736BEA]">
            You've already rated this course
          </p>
        ) : (
          <>
            <p className="mt-[40px] font-medium text-[16px] leading-[24px] tracking-[0] text-center text-[#736BEA]">
              Rate your experience
            </p>
            <div className="flex gap-[8px] mt-[16px]">
              {[1, 2, 3, 4, 5].map((star) => {
                const activeRating = hoverRating ?? rating;
                const full = activeRating !== null ? star <= activeRating : star <= 2;
                const half = activeRating === null && star === 3;

                return (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform duration-150 cursor-pointer hover:scale-110 focus-visible:outline-none"
                    onClick={() => onRate(star)}
                    onMouseEnter={() => !ratingSubmitted && onHover(star)}
                    onMouseLeave={() => !ratingSubmitted && onHover(null)}
                  >
                    {full ? (
                      <StarFull />
                    ) : half ? (
                      <StarHalf />
                    ) : (
                      <StarEmpty id={`congrats-${star}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onDone}
          disabled={isRating}
          className="w-full h-[47px] mt-[32px] rounded-[10px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out text-white font-medium text-[16px] leading-[24px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Done
        </button>
      </div>
    </div>
  );
}