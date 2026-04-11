const DAY_MAP: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const TIME_MAP: Record<string, string> = {
  Morning: "8AM-10AM",
  Afternoon: "12PM-2PM",
  Evening: "6PM-8PM",
  Night: "9PM-11PM",
};

export function formatSchedule(schedule: string): string {
  // Match "Day - Day at Period (time)" or "Day - Day at HH:MM AM/PM - HH:MM AM/PM"
  const match = schedule.match(/(\w+)\s*-\s*(\w+)\s+at\s+(.+)/);
  if (!match) return schedule;

  const [, startDay, endDay, timePart] = match;
  const formattedDays = `${DAY_MAP[startDay] ?? startDay}-${DAY_MAP[endDay] ?? endDay}`;

  // Named period e.g. "Evening"
  const namedPeriod = timePart.match(/^(\w+)\s*(?:\(.*\))?$/);
  if (namedPeriod && TIME_MAP[namedPeriod[1]]) {
    return `${formattedDays} at ${TIME_MAP[namedPeriod[1]]}`;
  }

  // Explicit times e.g. "6:00 PM - 8:00 PM"
  const timeMatch = timePart.match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i,
  );
  if (timeMatch) {
    const [, h1, , p1, h2, , p2] = timeMatch;
    return `${formattedDays} at ${h1}${p1.toUpperCase()}-${h2}${p2.toUpperCase()}`;
  }

  return `${formattedDays} at ${timePart}`;
}
