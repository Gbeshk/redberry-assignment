import React from "react";
import ArrowIcon from "@/app/components/icons/ArrowIcon";
import SessionIcon from "@/app/components/icons/SessionIcon";
import OnlineIcon from "@/app/components/icons/OnlineIcon";
import InPersonIcon from "@/app/components/icons/InPersonIcon";
import HybridIcon from "@/app/components/icons/HybridIcon";
import LocationIcon from "@/app/components/icons/LocationIcon";
import WarningIcon from "@/app/components/icons/WarningIcon";
import { SessionType } from "@/app/hooks/useCourseSchedule";

const STATIC_SESSION_PRICES: Record<string, string> = {
  online: "Included",
  in_person: "+ $30",
  hybrid: "+ $50",
};

const STATIC_SESSION_LOCATIONS: Record<string, string> = {
  in_person: "Chavchavadze St.34",
  hybrid: "Chavchavadze St.34",
};

const SESSION_CONFIGS = [
  {
    key: "online",
    label: "Online",
    subtitle: "Google Meet",
    hasLocation: false,
    Icon: OnlineIcon,
  },
  {
    key: "in_person",
    label: "In-Person",
    subtitle: null,
    hasLocation: true,
    Icon: InPersonIcon,
  },
  {
    key: "hybrid",
    label: "Hybrid",
    subtitle: null,
    hasLocation: true,
    Icon: HybridIcon,
  },
];

interface SessionTypeSectionProps {
  loading: boolean;
  selectedKey: string | null;
  selectedTimeSlotId: number | null;
  isOpen: boolean;
  hoveredKey: string | null;
  isAvailable: (key: string) => boolean;
  matchSession: (key: string) => SessionType | undefined;
  onToggle: () => void;
  onClick: (key: string) => void;
  onHover: (key: string | null) => void;
}

export default function SessionTypeSection({
  loading,
  selectedKey,
  selectedTimeSlotId,
  isOpen,
  hoveredKey,
  isAvailable,
  matchSession,
  onToggle,
  onClick,
  onHover,
}: SessionTypeSectionProps) {
  const getCardStyle = (key: string) => {
    const available = isAvailable(key);
    const active = selectedKey === key || hoveredKey === key;
    if (!available)
      return "py-[15px] px-[20px] rounded-[12px] bg-[#F5F5F5] border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center cursor-default transition-all duration-300 ease-out";
    if (active)
      return "py-[15px] px-[20px] rounded-[12px] bg-[#DDDBFA] border-[2px] h-[131px] border-[#958FEF] w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out";
    return "py-[15px] px-[20px] rounded-[12px] bg-white border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out";
  };

  const getTextColor = (key: string) => {
    if (!isAvailable(key)) return "#D1D1D1";
    if (selectedKey === key || hoveredKey === key) return "#4F46E5";
    return "#525252";
  };

  const getIconColor = (key: string): string | undefined => {
    if (!isAvailable(key)) return undefined;
    if (selectedKey === key || hoveredKey === key) return "#4F46E5";
    return undefined;
  };

  const getPriceLabel = (key: string) => {
    const s = matchSession(key);
    if (s) {
      const mod = parseFloat(s.priceModifier);
      return mod === 0 ? "Included" : `+ $${mod.toFixed(0)}`;
    }
    return STATIC_SESSION_PRICES[key] ?? "Included";
  };

  const getLocation = (key: string) => {
    const s = matchSession(key);
    return s?.location ?? STATIC_SESSION_LOCATIONS[key] ?? "Chavchavadze St.34";
  };

  const getSeatsNode = (key: string): React.ReactNode => {
    const s = matchSession(key);
    if (!s) return null;
    if (s.availableSeats === 0)
      return (
        <p className="font-medium text-[12px] text-[#F4161A] leading-none tracking-normal">
          Fully Booked
        </p>
      );
    if (s.availableSeats <= 5) {
      return (
        <div className="flex items-center gap-[4px]">
          <WarningIcon />
          <p className="font-medium text-[12px] text-[#F4A316] leading-none tracking-normal">
            Only {s.availableSeats} Seats Remaining
          </p>
        </div>
      );
    }
    return (
      <p className="text-[#3D3D3D] font-medium text-[12px] leading-none tracking-normal">
        {s.availableSeats} Seats Available
      </p>
    );
  };

  return (
    <div className="w-[530px] mt-[32px]">
      <div
        className={`h-[29px] flex items-center justify-between ${selectedTimeSlotId !== null ? "cursor-pointer" : "cursor-default"}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-[8px]">
          <SessionIcon
            state={selectedKey ? "selected" : isOpen ? "open" : "inactive"}
          />
          <p
            className="font-semibold text-[24px] leading-none tracking-normal"
            style={{ color: selectedKey || isOpen ? "#130E67" : "#8A8A8A" }}
          >
            Session Type
          </p>
        </div>
        <div
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <ArrowIcon />
        </div>
      </div>

      {isOpen && selectedTimeSlotId !== null && (
        <div className="w-full mt-[18px] grid h-[155px] grid-cols-3 gap-[8px]">
          {loading
            ? SESSION_CONFIGS.map(({ key }) => (
                <div key={key} className="h-[131px] w-full rounded-[12px] bg-[#E8E8E8] animate-pulse" />
              ))
            : SESSION_CONFIGS.map(
            ({ key, label, subtitle, hasLocation, Icon }) => (
              <div
                key={key}
                className="flex-1 h-full flex flex-col items-center justify-between"
              >
                <div
                  className={getCardStyle(key)}
                  onClick={() => onClick(key)}
                  onMouseEnter={() => isAvailable(key) && onHover(key)}
                  onMouseLeave={() => onHover(null)}
                >
                  <span style={{ opacity: isAvailable(key) ? 1 : 0.3 }}>
                    <Icon color={getIconColor(key)} />
                  </span>
                  <p
                    className="font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]"
                    style={{ color: getTextColor(key) }}
                  >
                    {label}
                  </p>
                  {subtitle && (
                    <p
                      className="h-[15px] flex items-center mt-[6px] font-normal text-[12px] leading-none tracking-normal"
                      style={{ color: getTextColor(key) }}
                    >
                      {subtitle}
                    </p>
                  )}
                  {hasLocation && (
                    <div className="flex h-[15px] items-center mt-[6px] gap-[2px] overflow-hidden">
                      <span style={{ opacity: isAvailable(key) ? 1 : 0.3 }}>
                        <LocationIcon color={getIconColor(key)} />
                      </span>
                      <p
                        className="flex items-center font-normal text-[12px] leading-none tracking-normal truncate whitespace-nowrap"
                        style={{ color: getTextColor(key) }}
                      >
                        {getLocation(key)}
                      </p>
                    </div>
                  )}
                  <p
                    className="h-[17px] flex items-center mt-[12px] font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: isAvailable(key) ? "#736BEA" : "#D1D1D1" }}
                  >
                    {getPriceLabel(key)}
                  </p>
                </div>
                {getSeatsNode(key)}
              </div>
            ),
          )}
        </div>
      )}

    </div>
  );
}
