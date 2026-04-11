import ArrowIcon from "@/app/components/icons/ArrowIcon";
import TimeSlotIcon from "@/app/components/icons/TimeSlotIcon";
import MorningIcon from "@/app/components/icons/MorningIcon";
import AfternoonIcon from "@/app/components/icons/AfternoonIcon";
import EveningIcon from "@/app/components/icons/EveningIcon";

const TIME_SLOTS = [
  {
    key: "morning",
    label: "Morning",
    time: "9:00 AM – 12:00 PM",
    Icon: MorningIcon,
  },
  {
    key: "afternoon",
    label: "Afternoon",
    time: "12:00 PM – 6:00 PM",
    Icon: AfternoonIcon,
  },
  {
    key: "evening",
    label: "Evening",
    time: "6:00 PM – 9:00 PM",
    Icon: EveningIcon,
  },
];

interface TimeSlotSectionProps {
  selectedKey: string | null;
  selectedScheduleId: number | null;
  isOpen: boolean;
  hoveredKey: string | null;
  isAvailable: (key: string) => boolean;
  onToggle: () => void;
  onClick: (key: string) => void;
  onHover: (key: string | null) => void;
}

export default function TimeSlotSection({
  selectedKey,
  selectedScheduleId,
  isOpen,
  hoveredKey,
  isAvailable,
  onToggle,
  onClick,
  onHover,
}: TimeSlotSectionProps) {
  const getContainerStyle = (key: string) => {
    const available = isAvailable(key);
    const active = selectedKey === key || hoveredKey === key;
    if (!available)
      return "p-[15px] rounded-[12px] bg-[#F5F5F5] border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px] cursor-default transition-all duration-300 ease-out";
    if (active)
      return "p-[15px] rounded-[12px] bg-[#DDDBFA] border-[2px] h-[61px] border-[#958FEF] w-full flex items-center justify-center gap-[12px] cursor-pointer transition-all duration-300 ease-out";
    return "p-[15px] rounded-[12px] bg-white border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px] cursor-pointer transition-all duration-300 ease-out";
  };

  const getTextColor = (key: string) => {
    if (!isAvailable(key)) return "#D1D1D1";
    if (selectedKey === key || hoveredKey === key) return "#4F46E5";
    return "#666666";
  };

  const getIconColor = (key: string): string | undefined => {
    if (!isAvailable(key)) return undefined;
    if (selectedKey === key || hoveredKey === key) return "#4F46E5";
    return undefined;
  };

  return (
    <div className="w-[530px] mt-[32px]">
      <div
        className={`h-[29px] flex items-center justify-between ${selectedScheduleId !== null ? "cursor-pointer" : "cursor-default"}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-[8px]">
          <TimeSlotIcon
            state={selectedKey ? "selected" : isOpen ? "open" : "inactive"}
          />
          <p
            className="font-semibold text-[24px] leading-none tracking-normal"
            style={{ color: selectedKey || isOpen ? "#130E67" : "#8A8A8A" }}
          >
            Time Slot
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

      {isOpen && selectedScheduleId !== null && (
        <div className="w-full h-[61px] mt-[18px] flex items-center justify-between gap-[6px]">
          {TIME_SLOTS.map(({ key, label, time, Icon }) => (
            <div
              key={key}
              className={getContainerStyle(key)}
              onClick={() => onClick(key)}
              onMouseEnter={() => isAvailable(key) && onHover(key)}
              onMouseLeave={() => onHover(null)}
            >
              <span style={{ opacity: isAvailable(key) ? 1 : 0.3 }}>
                <Icon color={getIconColor(key)} />
              </span>
              <div className="flex flex-col h-[31px] justify-center gap-[2px]">
                <p
                  className="h-[17px] flex items-center font-medium text-[14px] leading-none tracking-normal"
                  style={{ color: getTextColor(key) }}
                >
                  {label}
                </p>
                <p
                  className="h-[12px] flex items-center font-normal text-[10px] leading-none tracking-normal"
                  style={{ color: getTextColor(key) }}
                >
                  {time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
