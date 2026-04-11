interface EnrollmentInfoRowProps {
  icon: React.ReactNode;
  label: string;
}

export default function EnrollmentInfoRow({
  icon,
  label,
}: EnrollmentInfoRowProps) {
  return (
    <div>
      <span className="text-[4F46E5] flex items-center h-[24px] gap-[12px] mt-[22px]">
        {icon}
        <p className="text-[#525252] font-medium text-xl leading-none tracking-normal">
          {label}
        </p>
      </span>
    </div>
  );
}
