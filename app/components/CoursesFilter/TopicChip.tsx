import { Topic } from "@/app/types/filters";

interface TopicChipProps {
  topic: Topic;
  active: boolean;
  onClick: () => void;
}

export default function TopicChip({ topic, active, onClick }: TopicChipProps) {
  return (
    <div
      onClick={onClick}
      className={`
        px-[12px] py-[8px] rounded-[12px] flex items-center gap-[10px] cursor-pointer
        transition-all duration-300 ease-out border group
        ${active
          ? "bg-[#EEEDFC] border-[#281ED2]"
          : "bg-white border-transparent hover:bg-[#DDDBFA] ease-out duration-[300ms]"
        }
      `}
    >
      <p
        className={`font-medium text-[16px] leading-[24px] tracking-[0%] ${
          active ? "text-[#281ED2]" : "text-[#666666] group-hover:text-[#281ED2]"
        }`}
      >
        {topic.name}
      </p>
    </div>
  );
}