import StarFull from "@/app/components/icons/StarFull";
import StarEmpty from "@/app/components/icons/StarEmpty";
import StarHalf from "@/app/components/icons/StarHalf";

interface StarRatingProps {
  rating: number | null;
  hoverRating: number | null;
  ratingSubmitted: boolean;
  size?: "sm" | "lg";
  onRate: (star: number) => void;
  onHover: (star: number | null) => void;
}

export default function StarRating({
  rating,
  hoverRating,
  ratingSubmitted,
  size = "sm",
  onRate,
  onHover,
}: StarRatingProps) {
  if (ratingSubmitted) {
    return (
      <p className="text-[#736BEA] font-medium text-[16px] leading-none tracking-normal">
        You've already rated this course
      </p>
    );
  }

  return (
    <div className="flex gap-[8px] mt-[18px]">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hoverRating ?? rating ?? 0;
        const filled = star <= active;

        const smStar = filled ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#F4A316"
              stroke="#F4A316"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#D1D1D1"
              stroke="#D1D1D1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

        const activeRating = hoverRating ?? rating;
        const lgFull = activeRating !== null ? star <= activeRating : star <= 2;
        const lgHalf = activeRating === null && star === 3;
        const lgStar = lgFull ? (
          <StarFull />
        ) : lgHalf ? (
          <StarHalf />
        ) : (
          <StarEmpty id={`modal-${star}`} />
        );

        return (
          <button
            key={star}
            type="button"
            className="transition-transform duration-150 cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:scale-110"
            onClick={() => onRate(star)}
            onMouseEnter={() => !ratingSubmitted && onHover(star)}
            onMouseLeave={() => !ratingSubmitted && onHover(null)}
          >
            {size === "sm" ? smStar : lgStar}
          </button>
        );
      })}
    </div>
  );
}
