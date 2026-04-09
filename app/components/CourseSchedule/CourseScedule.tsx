import React, { useEffect, useState } from "react";
import WeeklyScheduleIcon from "../icons/WeeklyScheduleIcon";
import TimeSlotIcon from "../icons/TimeSlotIcon";
import ArrowIcon from "../icons/ArrowIcon";
import MorningIcon from "../icons/MorningIcon";
import AfternoonIcon from "../icons/AfternoonIcon";
import EveningIcon from "../icons/EveningIcon";
import SessionIcon from "../icons/SessionIcon";
import OnlineIcon from "../icons/OnlineIcon";
import InPersonIcon from "../icons/InPersonIcon";
import LocationIcon from "../icons/LocationIcon";
import WarningIcon from "../icons/WarningIcon";
import HybridIcon from "../icons/HybridIcon";
import AlreadyEnrolledCard from "./AlreadyEnrolledCard";
import ConflictModal from "./ConflictModal";
import AuthWarningBanner from "./AuthWarningBanner";

interface WeeklySchedule {
  id: number;
  label: string;
  days: string[];
}

interface TimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
}

interface SessionType {
  id: number;
  courseScheduleId: number;
  name: string;
  priceModifier: string;
  availableSeats: number;
  location?: string;
}
interface EnrollmentDetail {
  id: number;
  progress: number;
  course?: { id: number };
  courseSchedule?: {
    weeklySchedule?: { label: string };
    timeSlot?: { label: string; startTime?: string; endTime?: string };
    sessionType?: { name: string; location?: string };
  };
}
interface CourseScheduleProps {
  courseId: string;
  onSignInClick: () => void;
  onCompleteProfileClick: () => void;
}
const STATIC_SCHEDULES = [
  { key: "mon-wed", label: "Monday - Wednesday", short: "Mon - Wed" },
  { key: "tue-thu", label: "Tuesday - Thursday", short: "Tue - Thu" },
  { key: "fri-sat", label: "Friday - Saturday", short: "Fri - Sat" },
  { key: "weekend", label: "Weekend Only", short: "Weekend" },
];
function matchSchedule(
  staticLabel: string,
  apiSchedules: WeeklySchedule[],
): WeeklySchedule | undefined {
  return apiSchedules.find(
    (s) => s.label.toLowerCase() === staticLabel.toLowerCase(),
  );
}
function matchTimeSlot(
  staticKey: string,
  apiSlots: TimeSlot[],
): TimeSlot | undefined {
  return apiSlots.find((s) => s.label.toLowerCase().includes(staticKey));
}

function matchSession(
  staticKey: string,
  apiSessions: SessionType[],
): SessionType | undefined {
  return apiSessions.find((s) => s.name.toLowerCase() === staticKey);
}

function sessionPriceLabel(session: SessionType): string {
  const mod = parseFloat(session.priceModifier);
  if (mod === 0) return "Included";
  return `+ $${mod.toFixed(0)}`;
}

function sessionSeatsLabel(session: SessionType): React.ReactNode {
  if (session.availableSeats <= 5) {
    return (
      <div className="flex items-center gap-[4px]">
        <WarningIcon />
        <p className="font-medium text-[12px] text-[#F4A316] leading-none tracking-normal">
          Only {session.availableSeats} Seats Remaining
        </p>
      </div>
    );
  }
  return (
    <p className="text-[#3D3D3D] font-medium text-[12px] leading-none tracking-normal">
      {session.availableSeats} Seats Available
    </p>
  );
}

function sessionLocationLabel(session: SessionType): string {
  return session.location ?? "Chavchavadze St.34";
}

const STATIC_SESSION_PRICES: Record<string, string> = {
  online: "Included",
  in_person: "+ $30",
  hybrid: "+ $50",
};

const STATIC_SESSION_SEATS: Record<string, React.ReactNode> = {
  online: (
    <p className="text-[#3D3D3D] font-medium text-[12px] leading-none tracking-normal">
      50 Seats Available
    </p>
  ),
  in_person: (
    <div className="flex items-center gap-[4px]">
      <WarningIcon />
      <p className="font-medium text-[12px] text-[#F4A316] leading-none tracking-normal">
        Only 3 Seats Remaining
      </p>
    </div>
  ),
  hybrid: (
    <p className="text-[#3D3D3D] font-medium text-[12px] leading-none tracking-normal">
      50 Seats Available
    </p>
  ),
};

const STATIC_SESSION_LOCATIONS: Record<string, string> = {
  in_person: "Chavchavadze St.34",
  hybrid: "Chavchavadze St.34",
};

function CourseScedule({
  courseId,
  onSignInClick,
  onCompleteProfileClick,
}: CourseScheduleProps) {
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);

  const [selectedScheduleKey, setSelectedScheduleKey] = useState<string | null>(
    null,
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );
  const [selectedTimeSlotKey, setSelectedTimeSlotKey] = useState<string | null>(
    null,
  );
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(
    null,
  );
  const [selectedSessionKey, setSelectedSessionKey] = useState<string | null>(
    null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("authToken"),
  );
  const [profileComplete, setProfileComplete] = useState(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const u = JSON.parse(stored);
        return !!u?.profileComplete;
      }
    } catch {}
    return false;
  });
  const [enrollmentDetail, setEnrollmentDetail] =
    useState<EnrollmentDetail | null>(null);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentChecked, setEnrollmentChecked] = useState(
    () => !localStorage.getItem("authToken"),
  );

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    if (token) {
      fetch("https://api.redclass.redberryinternship.ge/api/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((r) => r.json())
        .then((json) => {
          const enrollments: EnrollmentDetail[] = json.data ?? [];
          const match = enrollments.find(
            (e) => String(e.course?.id) === String(courseId),
          );
          if (match) {
            setIsEnrolled(true);
            setEnrollmentDetail(match);
          }
        })
        .catch(() => {})
        .finally(() => setEnrollmentChecked(true));
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-updated", checkAuth);
    return () => window.removeEventListener("auth-updated", checkAuth);
  }, []);
  const [scheduleOpen, setScheduleOpen] = useState(true);
  const [timeSlotOpen, setTimeSlotOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);

  // --- Fetch weekly schedules on mount ---
  useEffect(() => {
    fetch(
      `https://api.redclass.redberryinternship.ge/api/courses/${courseId}/weekly-schedules`,
    )
      .then((r) => r.json())
      .then((json) => setWeeklySchedules(json.data ?? []))
      .catch(() => {});
  }, [courseId]);

  // --- Fetch time slots when schedule selected ---
  useEffect(() => {
    if (selectedScheduleId === null) {
      setTimeSlots([]);
      setSelectedTimeSlotKey(null);
      setSelectedTimeSlotId(null);
      setSessionTypes([]);
      setSelectedSessionKey(null);
      return;
    }
    fetch(
      `https://api.redclass.redberryinternship.ge/api/courses/${courseId}/time-slots?weekly_schedule_id=${selectedScheduleId}`,
    )
      .then((r) => r.json())
      .then((json) => setTimeSlots(json.data ?? []))
      .catch(() => {});
  }, [courseId, selectedScheduleId]);

  // --- Fetch session types when time slot selected ---
  useEffect(() => {
    if (selectedScheduleId === null || selectedTimeSlotId === null) {
      setSessionTypes([]);
      setSelectedSessionKey(null);
      return;
    }
    fetch(
      `https://api.redclass.redberryinternship.ge/api/courses/${courseId}/session-types?weekly_schedule_id=${selectedScheduleId}&time_slot_id=${selectedTimeSlotId}`,
    )
      .then((r) => r.json())
      .then((json) => setSessionTypes(json.data ?? []))
      .catch(() => {});
  }, [courseId, selectedScheduleId, selectedTimeSlotId]);

  // --- Handlers ---
  function handleTimeSlotClick(staticKey: string) {
    const match = matchTimeSlot(staticKey, timeSlots);
    if (!match) return;
    if (selectedTimeSlotKey === staticKey) {
      setSelectedTimeSlotKey(null);
      setSelectedTimeSlotId(null);
      setSelectedSessionKey(null);
    } else {
      setSelectedTimeSlotKey(staticKey);
      setSelectedTimeSlotId(match.id);
      setSelectedSessionKey(null);
      setSessionOpen(true);
    }
  }

  function handleSessionClick(staticKey: string) {
    const match = matchSession(staticKey, sessionTypes);
    if (!match) return;
    setSelectedSessionKey(staticKey === selectedSessionKey ? null : staticKey);
  }

  // --- Availability helpers ---
  function isTimeSlotAvailable(staticKey: string): boolean {
    if (timeSlots.length === 0) return false;
    return !!matchTimeSlot(staticKey, timeSlots);
  }

  function isSessionAvailable(staticKey: string): boolean {
    if (sessionTypes.length === 0) return false;
    return !!matchSession(staticKey, sessionTypes);
  }

  // --- Price calculation ---
  const selectedSession = selectedSessionKey
    ? matchSession(selectedSessionKey, sessionTypes)
    : null;
  const sessionMod = selectedSession
    ? parseFloat(selectedSession.priceModifier)
    : 0;
  const basePrice = 349;
  const totalPrice = basePrice + sessionMod;

  const showTimeSlots = selectedScheduleId !== null && timeSlotOpen;
  const showSessionTypes = selectedTimeSlotId !== null && sessionOpen;

  function handleToggleSchedule() {
    setScheduleOpen((o) => !o);
  }

  function handleToggleTimeSlot() {
    if (selectedScheduleId === null) return; // gate: must pick a day first
    setTimeSlotOpen((o) => !o);
  }

  function handleToggleSession() {
    if (selectedTimeSlotId === null) return; // gate: must pick a time slot first
    setSessionOpen((o) => !o);
  }

  // --- Time slot div styles ---
  function timeSlotContainerStyle(staticKey: string) {
    const available = isTimeSlotAvailable(staticKey);
    const selected = selectedTimeSlotKey === staticKey;

    if (!available) {
      return "p-[15px] rounded-[12px] bg-[#F5F5F5] border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px] cursor-default";
    }
    if (selected) {
      return "p-[15px] rounded-[12px] bg-white border-[2px] h-[61px] border-[#736BEA] w-full flex items-center justify-center gap-[12px] cursor-pointer";
    }
    return "p-[15px] rounded-[12px] bg-white border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px] cursor-pointer";
  }

  function timeSlotTextColor(staticKey: string) {
    const available = isTimeSlotAvailable(staticKey);
    return available ? "#666666" : "#D1D1D1";
  }

  // --- Session type card styles ---
  function sessionCardStyle(staticKey: string) {
    const available = isSessionAvailable(staticKey);
    const selected = selectedSessionKey === staticKey;

    if (!available) {
      return "py-[15px] px-[20px] rounded-[12px] bg-[#F5F5F5] border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center cursor-default";
    }
    if (selected) {
      return "py-[15px] px-[20px] rounded-[12px] bg-white border-[2px] h-[131px] border-[#736BEA] w-full flex flex-col items-center justify-center cursor-pointer";
    }
    return "py-[15px] px-[20px] rounded-[12px] bg-white border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center cursor-pointer";
  }

  function sessionTextColor(staticKey: string) {
    return isSessionAvailable(staticKey) ? "#525252" : "#D1D1D1";
  }

  function sessionPriceColor(staticKey: string) {
    return isSessionAvailable(staticKey) ? "#736BEA" : "#D1D1D1";
  }

  function getSessionPriceLabel(staticKey: string): string {
    const apiSession = matchSession(staticKey, sessionTypes);
    if (apiSession) return sessionPriceLabel(apiSession);
    return STATIC_SESSION_PRICES[staticKey] ?? "Included";
  }

  function getSessionSeatsNode(staticKey: string): React.ReactNode {
    const apiSession = matchSession(staticKey, sessionTypes);
    if (apiSession) return sessionSeatsLabel(apiSession);
    return STATIC_SESSION_SEATS[staticKey];
  }

  function getSessionLocation(staticKey: string): string {
    const apiSession = matchSession(staticKey, sessionTypes);
    if (apiSession) return sessionLocationLabel(apiSession);
    return STATIC_SESSION_LOCATIONS[staticKey] ?? "Chavchavadze St.34";
  }
  const [enrolling, setEnrolling] = useState(false);
  const [conflictData, setConflictData] = useState<{
    message: string;
    conflicts: {
      requestedCourseId: number;
      conflictingEnrollmentId: number;
      conflictingCourseName: string;
      schedule: string;
    }[];
  } | null>(null);
  async function handleEnroll(force = false) {
    if (!selectedSessionKey || !isSessionAvailable(selectedSessionKey)) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      onSignInClick();
      return;
    }

    const selectedSession = matchSession(selectedSessionKey, sessionTypes);
    if (!selectedSession) return;

    setEnrolling(true);
    try {
      const res = await fetch(
        "https://api.redclass.redberryinternship.ge/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            courseId: Number(courseId),
            courseScheduleId: selectedSession.courseScheduleId,
            force,
          }),
        },
      );

      if (res.status === 401) {
        onSignInClick();
        return;
      }

      if (res.status === 409) {
        const json = await res.json();
        setConflictData(json);
        return;
      }

      if (res.status === 201) {
        const json = await res.json();
        setEnrollmentDetail(json.data ?? null); // if API returns the enrollment
        setIsEnrolled(true);
        return;
      }
    } finally {
      setEnrolling(false);
    }
  }
  if (!enrollmentChecked) return null;

  if (isEnrolled && enrollmentDetail) {
    return <AlreadyEnrolledCard enrollment={enrollmentDetail} />;
  }
  return (
    <>
      <div className="w-[530px]">
        {/* Weekly Schedule */}
        <div className="w-[530px]">
          <div
            className="h-[30px] flex items-center justify-between cursor-pointer"
            onClick={handleToggleSchedule}
          >
            <div className="flex items-center gap-[8px]">
              <WeeklyScheduleIcon />
              <p className="text-[#130E67] font-semibold text-[24px] leading-none tracking-normal">
                Weekly Schedule
              </p>
            </div>
            <div
              style={{
                transform: scheduleOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <ArrowIcon />
            </div>
          </div>
          {scheduleOpen && (
            <div className="w-full h-[91px] mt-[18px] flex items-center justify-between gap-[12px]">
              {STATIC_SCHEDULES.map(({ key, label, short }) => {
                const available =
                  weeklySchedules.length === 0 ||
                  !!matchSchedule(label, weeklySchedules);
                const selected = selectedScheduleKey === key;
                return (
                  <div
                    key={key}
                    className={
                      !available
                        ? "text-[#D1D1D1] h-full font-semibold text-[16px] leading-none border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-[#F5F5F5] w-full cursor-default"
                        : selected
                          ? "text-[#130E67] h-full font-semibold text-[16px] leading-none border-[2px] border-[#736BEA] rounded-[12px] flex items-center justify-center bg-white w-full cursor-pointer"
                          : "text-[#292929] h-full font-semibold text-[16px] leading-none border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-white w-full cursor-pointer"
                    }
                    onClick={() => {
                      if (!available) return;
                      if (selectedScheduleKey === key) {
                        setSelectedScheduleKey(null);
                        setSelectedScheduleId(null);
                      } else {
                        const match = matchSchedule(label, weeklySchedules);
                        setSelectedScheduleKey(key);
                        setSelectedScheduleId(match?.id ?? null);
                        setSelectedTimeSlotKey(null);
                        setSelectedTimeSlotId(null);
                        setSelectedSessionKey(null);
                        setTimeSlotOpen(true);
                        setSessionOpen(false);
                      }
                    }}
                  >
                    {short}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Time Slot */}
        <div className="w-[530px] mt-[32px]">
          <div
            className={`h-[29px] flex items-center justify-between ${selectedScheduleId !== null ? "cursor-pointer" : "cursor-default"}`}
            onClick={handleToggleTimeSlot}
          >
            <div className="flex items-center gap-[8px]">
              <TimeSlotIcon />
              <p className="text-[#8A8A8A] font-semibold text-[24px] leading-none tracking-normal">
                Time Slot
              </p>
            </div>
            <div
              style={{
                transform: timeSlotOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <ArrowIcon />
            </div>
          </div>

          {showTimeSlots && (
            <div className="w-full h-[61px] mt-[18px] flex items-center justify-between gap-[6px]">
              {/* Morning */}
              <div
                className={timeSlotContainerStyle("morning")}
                onClick={() => handleTimeSlotClick("morning")}
              >
                <MorningIcon />
                <div className="flex flex-col h-[31px] justify-center gap-[2px]">
                  <p
                    className="h-[17px] flex items-center font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: timeSlotTextColor("morning") }}
                  >
                    Morning
                  </p>
                  <p
                    className="h-[12px] flex items-center font-normal text-[10px] leading-none tracking-normal"
                    style={{ color: timeSlotTextColor("morning") }}
                  >
                    9:00 AM – 12:00 PM
                  </p>
                </div>
              </div>

              {/* Afternoon */}
              <div
                className={timeSlotContainerStyle("afternoon")}
                onClick={() => handleTimeSlotClick("afternoon")}
              >
                <AfternoonIcon />
                <div className="flex flex-col h-[31px] justify-center gap-[2px]">
                  <p
                    className="h-[17px] flex items-center font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: timeSlotTextColor("afternoon") }}
                  >
                    Afternoon
                  </p>
                  <p
                    className="h-[12px] flex items-center font-normal text-[10px] leading-none tracking-normal"
                    style={{ color: timeSlotTextColor("afternoon") }}
                  >
                    12:00 PM – 6:00 PM
                  </p>
                </div>
              </div>

              {/* Evening */}
              <div
                className={timeSlotContainerStyle("evening")}
                onClick={() => handleTimeSlotClick("evening")}
              >
                <EveningIcon />
                <div className="flex flex-col h-[31px] gap-[2px]">
                  <p
                    className="h-[17px] flex items-center font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: timeSlotTextColor("evening") }}
                  >
                    Evening
                  </p>
                  <p
                    className="h-[12px] flex items-center font-normal text-[10px] leading-none tracking-normal"
                    style={{ color: timeSlotTextColor("evening") }}
                  >
                    6:00 PM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Session Type */}
        <div className="w-[530px] mt-[32px]">
          <div
            className={`h-[29px] flex items-center justify-between ${selectedTimeSlotId !== null ? "cursor-pointer" : "cursor-default"}`}
            onClick={handleToggleSession}
          >
            <div className="flex items-center gap-[8px]">
              <SessionIcon />
              <p className="text-[#8A8A8A] font-semibold text-[24px] leading-none tracking-normal">
                Session Type
              </p>
            </div>
            <div
              style={{
                transform: sessionOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <ArrowIcon />
            </div>
          </div>

          {showSessionTypes && (
            <div className="w-full mt-[18px] grid h-[155px] grid-cols-3 gap-[8px]">
              {/* Online */}
              <div className="flex-1 h-full flex flex-col items-center justify-between">
                <div
                  className={sessionCardStyle("online")}
                  onClick={() => handleSessionClick("online")}
                >
                  <OnlineIcon />
                  <p
                    className="font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]"
                    style={{ color: sessionTextColor("online") }}
                  >
                    Online
                  </p>
                  <p
                    className="h-[15px] flex items-center mt-[6px] font-normal text-[12px] leading-none tracking-normal"
                    style={{ color: sessionTextColor("online") }}
                  >
                    Google Meet
                  </p>
                  <p
                    className="h-[17px] flex items-center mt-[12px] font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: sessionPriceColor("online") }}
                  >
                    {getSessionPriceLabel("online")}
                  </p>
                </div>
                {getSessionSeatsNode("online")}
              </div>

              {/* In-Person */}
              <div className="flex-1 h-full flex flex-col items-center justify-between">
                <div
                  className={sessionCardStyle("in_person")}
                  onClick={() => handleSessionClick("in_person")}
                >
                  <InPersonIcon />
                  <p
                    className="font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]"
                    style={{ color: sessionTextColor("in_person") }}
                  >
                    In-Person
                  </p>
                  <div className="flex h-[15px] items-center mt-[6px] gap-[2px] overflow-hidden">
                    <LocationIcon />
                    <p
                      className="flex items-center font-normal text-[12px] leading-none tracking-normal truncate whitespace-nowrap"
                      style={{ color: sessionTextColor("in_person") }}
                    >
                      {getSessionLocation("in_person")}
                    </p>
                  </div>
                  <p
                    className="h-[17px] flex items-center mt-[12px] font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: sessionPriceColor("in_person") }}
                  >
                    {getSessionPriceLabel("in_person")}
                  </p>
                </div>
                {getSessionSeatsNode("in_person")}
              </div>

              {/* Hybrid */}
              <div className="flex-1 h-full flex flex-col items-center justify-between">
                <div
                  className={sessionCardStyle("hybrid")}
                  onClick={() => handleSessionClick("hybrid")}
                >
                  <HybridIcon />
                  <p
                    className="font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]"
                    style={{ color: sessionTextColor("hybrid") }}
                  >
                    Hybrid
                  </p>
                  <div className="flex h-[15px] items-center mt-[6px] gap-[2px] overflow-hidden">
                    <LocationIcon />
                    <p
                      className="flex items-center font-normal text-[12px] leading-none tracking-normal truncate whitespace-nowrap"
                      style={{ color: sessionTextColor("hybrid") }}
                    >
                      {getSessionLocation("hybrid")}
                    </p>
                  </div>
                  <p
                    className="h-[17px] flex items-center mt-[12px] font-medium text-[14px] leading-none tracking-normal"
                    style={{ color: sessionPriceColor("hybrid") }}
                  >
                    {getSessionPriceLabel("hybrid")}
                  </p>
                </div>
                {getSessionSeatsNode("hybrid")}
              </div>
            </div>
          )}
        </div>
        {/* Price Summary */}
        <div className="w-[530px] h-[306px] bg-white rounded-[12px] mt-[32px] flex items-center flex-col p-[40px]">
          <div className="w-[450px] h-[39px] flex items-center justify-between">
            <p className="text-[#8A8A8A] font-semibold text-[20px] leading-[24px] tracking-normal">
              Total Price
            </p>
            <p className="text-[#292929] font-semibold text-[32px] leading-none tracking-normal text-right">
              ${totalPrice}
            </p>
          </div>
          <div className="h-[24px] flex items-center justify-between w-[450px] mt-[32px]">
            <p className="text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-normal">
              Base Price
            </p>
            <p className="text-[#292929] font-medium text-[16px] leading-[24px] tracking-normal flex items-center justify-end gap-[4px]">
              <span className="translate-y-[-1px]">+</span>
              <span>$0</span>
            </p>
          </div>
          <div className="h-[24px] flex items-center justify-between w-[450px] mt-[12px]">
            <p className="text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-normal">
              Session Type
            </p>
            <p className="text-[#292929] font-medium text-[16px] leading-[24px] tracking-normal flex items-center justify-end gap-[4px]">
              <span className="translate-y-[-1px]">+</span>
              <span>${sessionMod.toFixed(0)}</span>
            </p>
          </div>
          <div
            className="w-[450px] h-[63px] rounded-[12px] mt-[32px] font-semibold text-[20px] leading-[24px] tracking-normal flex items-center justify-center cursor-pointer"
            style={
              selectedSessionKey &&
              isSessionAvailable(selectedSessionKey) &&
              !enrolling
                ? { backgroundColor: "#736BEA", color: "#ffffff" }
                : { backgroundColor: "#EEEDFC", color: "#B7B3F4" }
            }
            onClick={() => handleEnroll(false)}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </div>
        </div>
        {!isLoggedIn && (
          <AuthWarningBanner
            title="Authentication Required"
            description="You need sign in to your profile before enrolling in this course."
            buttonLabel="Sign In"
            buttonWidth="w-[91px]"
            onButtonClick={onSignInClick}
          />
        )}
        {isLoggedIn && !profileComplete && (
          <AuthWarningBanner
            title="Complete Your Profile"
            description="You need to fill in your profile details before enrolling in this course."
            buttonLabel="Complete"
            buttonWidth="w-[110px]"
            onButtonClick={onCompleteProfileClick}
          />
        )}
      </div>
      {conflictData && (
        <ConflictModal
          conflictData={conflictData}
          onCancel={() => setConflictData(null)}
          onConfirm={async () => {
            setConflictData(null);
            await handleEnroll(true);
          }}
        />
      )}
    </>
  );
}

export default CourseScedule;
