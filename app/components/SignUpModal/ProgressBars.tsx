const STEP_COLORS = (step: number) => [
  step === 1 ? "#B7B3F4" : "#4F46E5",
  step === 1 ? "#EEEDFC" : step === 2 ? "#B7B3F4" : "#4F46E5",
  step <= 2 ? "#EEEDFC" : step === 3 ? "#B7B3F4" : "#4F46E5",
];

export default function ProgressBars({ step }: { step: number }) {
  return (
    <div className="flex items-center w-full justify-between mt-[24px]">
      {STEP_COLORS(step).map((color, i) => (
        <div
          key={i}
          className="w-[114px] h-[8px] rounded-[30px]"
          style={{
            backgroundColor: color,
            transition: "background-color 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
