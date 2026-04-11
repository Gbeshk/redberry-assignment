interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-[8px] mt-[32px] justify-center">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-[40px] h-[40px] rounded-[4px] flex items-center justify-center transition-colors border ${
          currentPage === 1
            ? "bg-white border-[#D1D1D1] cursor-default"
            : "bg-white border-[#D1D1D1] cursor-pointer hover:bg-[#DDDBFA] hover:border-[#B7B3F4]"
        }`}
      >
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
          <path
            d="M5.30113 0.000709453L6.32386 1.01207L2.77272 4.56321L11.6932 4.56321L11.6932 6.04048L2.77272 6.04048L6.32386 9.58594L5.30113 10.603L-4.5935e-06 5.30185L5.30113 0.000709453Z"
            fill={currentPage === 1 ? "#D1D1D1" : "#4F46E5"}
          />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-[40px] h-[40px] rounded-[4px] font-medium text-[14px] transition-colors cursor-pointer border ${
            page === currentPage
              ? "bg-[#281ED2] text-white border-[#4F46E5]"
              : "bg-white text-[#4F46E5] border-[#D1D1D1] hover:bg-[#DDDBFA] hover:border-[#B7B3F4]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-[40px] h-[40px] rounded-[4px] flex items-center justify-center transition-colors border ${
          currentPage === totalPages
            ? "bg-white border-[#D1D1D1] cursor-default"
            : "bg-white border-[#D1D1D1] cursor-pointer hover:bg-[#DDDBFA] hover:border-[#B7B3F4]"
        }`}
      >
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
          <path
            transform="scale(-1,1) translate(-12,0)"
            d="M5.30113 0.000709453L6.32386 1.01207L2.77272 4.56321L11.6932 4.56321L11.6932 6.04048L2.77272 6.04048L6.32386 9.58594L5.30113 10.603L-4.5935e-06 5.30185L5.30113 0.000709453Z"
            fill={currentPage === totalPages ? "#D1D1D1" : "#4F46E5"}
          />
        </svg>
      </button>
    </div>
  );
}
