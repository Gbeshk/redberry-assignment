import React from "react";
import DevelopmentSvg from "@/app/components/icons/DevelopmentSvg";
import DesignSvg from "@/app/components/icons/DesignSvg";
import MarketingSvg from "@/app/components/icons/MarketingSvg";
import BusinessSvg from "@/app/components/icons/BusinessSvg";
import DataScienceSvg from "@/app/components/icons/DataScienceSvg";
import { Category } from "@/app/types/filters";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  development: <DevelopmentSvg />,
  design: <DesignSvg />,
  marketing: <MarketingSvg />,
  business: <BusinessSvg />,
  "data-science": <DataScienceSvg />,
};

interface CategoryChipProps {
  category: Category;
  active: boolean;
  onClick: () => void;
}

export default function CategoryChip({ category, active, onClick }: CategoryChipProps) {
  return (
    <div
      onClick={onClick}
      className={`
        px-[12px] py-[8px] rounded-[12px] flex items-center gap-[10px] cursor-pointer
        transition-all duration-300 ease-out border group
        ${active
          ? "bg-[#EEEDFC] border-[#281ED2]"
          : "bg-white border-transparent hover:bg-[#DDDBFA] focus:bg-[#EEEDFC] focus:border-[#281ED2]"
        }
      `}
    >
      <span
        className={`transition-colors ${
          active
            ? "text-[#281ED2]"
            : "text-[#666666] group-hover:text-[#281ED2] focus:text-[#281ED2] ease-out duration-[300ms]"
        }`}
      >
        {CATEGORY_ICONS[category.icon]}
      </span>
      <p
        className={`font-medium text-[16px] leading-[24px] tracking-[0%] transition-colors ${
          active
            ? "text-[#281ED2]"
            : "text-[#666666] group-hover:text-[#281ED2] focus:text-[#281ED2] ease-out duration-[300ms]"
        }`}
      >
        {category.name}
      </p>
    </div>
  );
}