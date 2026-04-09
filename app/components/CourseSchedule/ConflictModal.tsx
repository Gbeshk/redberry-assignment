import ConflictSvg from "../icons/ConflictSvg";

interface ConflictData {
  message: string;
  conflicts: {
    requestedCourseId: number;
    conflictingEnrollmentId: number;
    conflictingCourseName: string;
    schedule: string;
  }[];
}

interface ConflictModalProps {
  conflictData: ConflictData;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConflictModal({
  conflictData,
  onCancel,
  onConfirm,
}: ConflictModalProps) {
  const formatSchedule = (schedule: string): string => {
    const dayMap: Record<string, string> = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };

    const timeMap: Record<string, string> = {
      Morning: "8AM-10AM",
      Afternoon: "12PM-2PM",
      Evening: "6PM-8PM",
      Night: "9PM-11PM",
    };

    // Match "Day - Day at Period (time)" or "Day - Day at HH:MM AM/PM - HH:MM AM/PM"
    const match = schedule.match(/(\w+)\s*-\s*(\w+)\s+at\s+(.+)/);

    if (!match) return schedule;

    const [, startDay, endDay, timePart] = match;

    const formattedDays = `${dayMap[startDay] ?? startDay}-${dayMap[endDay] ?? endDay}`;

    // Check if timePart is a named period like "Evening"
    const namedPeriod = timePart.match(/^(\w+)\s*(?:\(.*\))?$/);
    if (namedPeriod && timeMap[namedPeriod[1]]) {
      return `${formattedDays} at ${timeMap[namedPeriod[1]]}`;
    }

    // Otherwise parse explicit times like "6:00 PM - 8:00 PM"
    const timeMatch = timePart.match(
      /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i,
    );

    if (timeMatch) {
      const [, h1, , p1, h2, , p2] = timeMatch;
      return `${formattedDays} at ${h1}${p1.toUpperCase()}-${h2}${p2.toUpperCase()}`;
    }

    return `${formattedDays} at ${timePart}`;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white   w-[476px] min-h-[455px] rounded-[16px] flex items-center flex-col p-[60px] ">
        <ConflictSvg />
        <p className="text-[#3D3D3D] h-[39px] flex items-center  font-semibold text-3xl leading-none tracking-normal text-center mt-[24px]">
          Enrollment Conflict
        </p>
        <div>
 <div className="flex flex-col items-center mt-[24px]">
  <p className="font-medium text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
    You are already enrolled in
  </p>
  <p className="text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
    {conflictData.conflicts.map((c, i) => (
      <span key={i}>
        <span className="font-semibold">"{c.conflictingCourseName}"</span>
        {i < conflictData.conflicts.length - 2 && (
          <span className="font-medium">, </span>
        )}
        {i === conflictData.conflicts.length - 2 && (
          <span className="font-medium"> and </span>
        )}
        {i === conflictData.conflicts.length - 1 && (
          <span className="font-medium"> with</span>
        )}
      </span>
    ))}
  </p>
  <p className="font-medium text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
    the same schedule:
  </p>
  <p className="font-semibold text-xl leading-none tracking-normal text-center text-[#3D3D3D]">
    {formatSchedule(conflictData.conflicts[0].schedule)}
  </p>
</div>
        </div>
        {/* <div className="flex flex-col gap-[12px]">
          {conflictData.conflicts.map((c, i) => (
            <div key={i} className="bg-[#F5F5F5] rounded-[12px] p-[16px]">
              <p className="text-[#292929] font-semibold text-[15px]">
                {c.conflictingCourseName}
              </p>
              <p className="text-[#8A8A8A] text-[13px] mt-[4px]">
                {c.schedule}
              </p>
            </div>
          ))}
        </div> */}

        <div className="flex mt-[40px] w-full gap-[8px] justify-between">
          <button
            className="w-full h-[58px] rounded-[8px]  font-medium text-base leading-6 tracking-normal text-center border-[2px] border-[#958FEF] text-[#4F46E5] text-[16px] cursor-pointer"
            onClick={onConfirm}
          >
            Continue Anyway
          </button>
          <button
            className=" w-full h-[58px] rounded-[8px]  font-medium text-base leading-6 tracking-normal text-center bg-[#4F46E5] text-white  text-[16px] cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
