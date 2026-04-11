interface CourseDetailDescriptionProps {
  description: string;
}

export default function CourseDetailDescription({
  description,
}: CourseDetailDescriptionProps) {
  return (
    <>
      <p className="mt-[16px] text-[#8A8A8A] font-semibold text-[20px] leading-[24px] tracking-normal h-[24px] flex items-center">
        Course Description
      </p>
      <p className="text-[#8A8A8A] mt-[24px] font-medium text-[16px] leading-[24px] tracking-normal">
        {description}
      </p>
    </>
  );
}
