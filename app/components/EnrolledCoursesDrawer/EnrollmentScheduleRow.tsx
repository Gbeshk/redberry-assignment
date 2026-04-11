interface EnrollmentScheduleRowProps {
  icon: React.ReactNode;
  label: string;
}

export default function EnrollmentScheduleRow({
  icon,
  label,
}: EnrollmentScheduleRowProps) {
  return (
    <div className="flex items-center h-[26px] gap-[8px]">
      {icon}
      <p className="text-[#666666] font-normal text-sm leading-[26px] tracking-normal">
        {label}
      </p>
    </div>
  );
}
