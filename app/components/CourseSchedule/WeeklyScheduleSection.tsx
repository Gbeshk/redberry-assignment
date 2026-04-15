import ArrowIcon from "@/app/components/icons/ArrowIcon";
import WeeklyScheduleIcon from "@/app/components/icons/WeeklyScheduleIcon";
import { WeeklySchedule } from "@/app/hooks/useCourseSchedule";

const STATIC_SCHEDULES = [
  { key: "mon-wed", label: "Monday - Wednesday", short: "Mon - Wed" },
  { key: "tue-thu", label: "Tuesday - Thursday", short: "Tue - Thu" },
  { key: "fri-sat", label: "Friday - Saturday", short: "Fri - Sat" },
  { key: "weekend", label: "Weekend Only", short: "Weekend" },
];

interface WeeklyScheduleSectionProps {
  weeklySchedules: WeeklySchedule[];
  loading: boolean;
  selectedKey: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (key: string, label: string) => void;
}

export default function WeeklyScheduleSection({
  weeklySchedules,
  loading,
  selectedKey,
  isOpen,
  onToggle,
  onSelect,
}: WeeklyScheduleSectionProps) {
  const isAvailable = (label: string) =>
    !!weeklySchedules.find(
      (s) => s.label.toLowerCase() === label.toLowerCase(),
    );

  return (
    <div className="w-[530px]">
      <div
        className="h-[30px] flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-[8px]">
          <WeeklyScheduleIcon
            state={selectedKey ? "selected" : isOpen ? "open" : "inactive"}
          />
          <p
            className="font-semibold text-[24px] leading-none tracking-normal"
            style={{ color: selectedKey || isOpen ? "#130E67" : "#8A8A8A" }}
          >
            Weekly Schedule
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

      {isOpen && (
        <div className="w-full h-[91px] mt-[18px] flex items-center justify-between gap-[12px]">
          {loading
            ? STATIC_SCHEDULES.map(({ key }) => (
                <div key={key} className="h-full w-full rounded-[12px] bg-[#E8E8E8] animate-pulse" />
              ))
            : STATIC_SCHEDULES.map(({ key, label, short }) => {
                const available = isAvailable(label);
                const selected = selectedKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => { if (available) onSelect(key, label); }}
                    className={
                      !available
                        ? "text-[#D1D1D1] h-full font-semibold text-[16px] leading-none border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-[#F5F5F5] w-full cursor-default transition-all duration-300 ease-out"
                        : selected
                          ? "text-[#4F46E5] h-full font-semibold text-[16px] leading-none border-[2px] border-[#958FEF] rounded-[12px] flex items-center justify-center bg-[#DDDBFA] w-full cursor-pointer transition-all duration-300 ease-out"
                          : "text-[#292929] h-full font-semibold text-[16px] leading-none border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-white w-full cursor-pointer hover:bg-[#DDDBFA] hover:text-[#4F46E5] hover:border-[#958FEF] transition-all duration-300 ease-out"
                    }
                  >
                    {short}
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
}
