import React from "react";

function ClearFiltersIcon() {
  return (
    <div>
      <svg
        className="group-hover:stroke-[#4F46E5]"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.75 5.75L0.75 0.75M5.75 5.75L10.75 10.75M5.75 5.75L10.75 0.75M5.75 5.75L0.75 10.75"
          className="stroke-[#8A8A8A] group-hover:stroke-[#4F46E5]"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default ClearFiltersIcon;
