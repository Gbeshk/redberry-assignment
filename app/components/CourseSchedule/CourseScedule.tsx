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
import CompleteProfIcon from "../icons/CompleteProfIcon";
import ConfirmedEnrollmentIcon from "../icons/ConfirmedEnrollmentIcon";

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
  isRated?: boolean;
  course?: { id: number };
  courseSchedule?: {
    weeklySchedule?: { label: string };
    timeSlot?: { label: string; startTime?: string; endTime?: string };
    sessionType?: { name: string; location?: string };
  };
}
interface CourseScheduleProps {
  courseId: string;
  courseTitle: string;
  basePrice: number;
  isRated: boolean;
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
  courseTitle,
  basePrice,
  isRated,
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
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileChecked, setProfileChecked] = useState(
    () => !localStorage.getItem("authToken"),
  );
  const [enrollmentDetail, setEnrollmentDetail] =
    useState<EnrollmentDetail | null>(null);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    setIsEnrolled(true);
  };

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentChecked, setEnrollmentChecked] = useState(
    () => !localStorage.getItem("authToken"),
  );

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    if (token) {
      Promise.all([
        fetch("https://api.redclass.redberryinternship.ge/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
          .then((r) => r.json())
          .then((json) => {
            const u = json.data?.user ?? json.data;
            if (u) {
              setProfileComplete(!!u.profileComplete);
              localStorage.setItem("userData", JSON.stringify(u));
            }
          })
          .catch(() => {
            try {
              const stored = localStorage.getItem("userData");
              if (stored)
                setProfileComplete(!!JSON.parse(stored).profileComplete);
            } catch {}
          })
          .finally(() => setProfileChecked(true)),
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
          .catch(() => {}),
      ]).finally(() => setEnrollmentChecked(true));
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
  const [hoveredTimeSlotKey, setHoveredTimeSlotKey] = useState<string | null>(null);
  const [hoveredSessionKey, setHoveredSessionKey] = useState<string | null>(null);

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

  useEffect(() => {
    document.body.style.overflow =
      showSuccessModal || showCompleteProfileModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSuccessModal, showCompleteProfileModal]);

  // --- Handlers ---
  function handleTimeSlotClick(staticKey: string) {
    const match = matchTimeSlot(staticKey, timeSlots);
    if (!match) return;
    if (selectedTimeSlotKey === staticKey) {
      setSelectedTimeSlotKey(null);
      setSelectedTimeSlotId(null);
      setSelectedSessionKey(null);
      setSessionOpen(false);
    } else {
      setSelectedTimeSlotKey(staticKey);
      setSelectedTimeSlotId(match.id);
      setSelectedSessionKey(null);
      setSessionOpen(true);
    }
  }

  function handleSessionClick(staticKey: string) {
    if (!isSessionAvailable(staticKey)) return;
    setSelectedSessionKey(staticKey === selectedSessionKey ? null : staticKey);
  }

  // --- Availability helpers ---
  function isTimeSlotAvailable(staticKey: string): boolean {
    if (timeSlots.length === 0) return false;
    return !!matchTimeSlot(staticKey, timeSlots);
  }

  function isSessionAvailable(staticKey: string): boolean {
    if (sessionTypes.length === 0) return false;
    const session = matchSession(staticKey, sessionTypes);
    return !!session && session.availableSeats > 0;
  }

  // --- Price calculation ---
  const selectedSession = selectedSessionKey
    ? matchSession(selectedSessionKey, sessionTypes)
    : null;
  const sessionMod = selectedSession
    ? parseFloat(selectedSession.priceModifier)
    : 0;
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
    const active = selectedTimeSlotKey === staticKey || hoveredTimeSlotKey === staticKey;

    if (!available) {
      return "p-[15px] rounded-[12px] bg-[#F5F5F5] border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px] cursor-default transition-all duration-300 ease-out";
    }
    if (active) {
      return "p-[15px] rounded-[12px] bg-[#DDDBFA] border-[2px] h-[61px] border-[#958FEF] w-full flex items-center justify-center gap-[12px] cursor-pointer transition-all duration-300 ease-out";
    }
    return "p-[15px] rounded-[12px] bg-white border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px] cursor-pointer transition-all duration-300 ease-out";
  }

  function timeSlotTextColor(staticKey: string) {
    if (!isTimeSlotAvailable(staticKey)) return "#D1D1D1";
    if (selectedTimeSlotKey === staticKey || hoveredTimeSlotKey === staticKey) return "#4F46E5";
    return "#666666";
  }

  function getTimeSlotIconColor(staticKey: string): string | undefined {
    if (!isTimeSlotAvailable(staticKey)) return undefined;
    if (selectedTimeSlotKey === staticKey || hoveredTimeSlotKey === staticKey) return "#4F46E5";
    return undefined;
  }

  function timeSlotIconOpacity(staticKey: string) {
    return isTimeSlotAvailable(staticKey) ? 1 : 0.3;
  }

  function sessionIconOpacity(staticKey: string) {
    return isSessionAvailable(staticKey) ? 1 : 0.3;
  }

  function getSessionIconColor(staticKey: string): string | undefined {
    if (!isSessionAvailable(staticKey)) return undefined;
    if (selectedSessionKey === staticKey || hoveredSessionKey === staticKey) return "#4F46E5";
    return undefined;
  }

  // --- Session type card styles ---
  function sessionCardStyle(staticKey: string) {
    const available = isSessionAvailable(staticKey);
    const active = selectedSessionKey === staticKey || hoveredSessionKey === staticKey;

    if (!available) {
      return "py-[15px] px-[20px] rounded-[12px] bg-[#F5F5F5] border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center cursor-default transition-all duration-300 ease-out";
    }
    if (active) {
      return "py-[15px] px-[20px] rounded-[12px] bg-[#DDDBFA] border-[2px] h-[131px] border-[#958FEF] w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out";
    }
    return "py-[15px] px-[20px] rounded-[12px] bg-white border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out";
  }

  function sessionTextColor(staticKey: string) {
    if (!isSessionAvailable(staticKey)) return "#D1D1D1";
    if (selectedSessionKey === staticKey || hoveredSessionKey === staticKey) return "#4F46E5";
    return "#525252";
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
    if (sessionTypes.length === 0) return STATIC_SESSION_SEATS[staticKey];
    const apiSession = matchSession(staticKey, sessionTypes);
    if (!apiSession) return null;
    if (apiSession.availableSeats === 0)
      return (
        <p className="font-medium text-[12px] text-[#F4161A] leading-none tracking-normal">
          No Seats Available
        </p>
      );
    return sessionSeatsLabel(apiSession);
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
        setEnrollmentDetail(json.data ?? null);
        setShowSuccessModal(true);
        return;
      }
    } finally {
      setEnrolling(false);
    }
  }
  if (!enrollmentChecked) return null;

  if (isEnrolled && enrollmentDetail) {
    return (
      <AlreadyEnrolledCard
        enrollment={enrollmentDetail}
        isRated={isRated}
        courseTitle={courseTitle}
        onUnenroll={() => {
          setIsEnrolled(false);
          setEnrollmentDetail(null);
        }}
      />
    );
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
              <WeeklyScheduleIcon state={selectedScheduleKey ? "selected" : scheduleOpen ? "open" : "inactive"} />
              <p className="font-semibold text-[24px] leading-none tracking-normal" style={{ color: selectedScheduleKey || scheduleOpen ? "#130E67" : "#8A8A8A" }}>
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
                        ? "text-[#D1D1D1] h-full font-semibold text-[16px] leading-none border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-[#F5F5F5] w-full cursor-default transition-all duration-300 ease-out"
                        : selected
                          ? "text-[#4F46E5] h-full font-semibold text-[16px] leading-none border-[2px] border-[#958FEF] rounded-[12px] flex items-center justify-center bg-[#DDDBFA] w-full cursor-pointer transition-all duration-300 ease-out"
                          : "text-[#292929] h-full font-semibold text-[16px] leading-none border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-white w-full cursor-pointer hover:bg-[#DDDBFA] hover:text-[#4F46E5] hover:border-[#958FEF] transition-all duration-300 ease-out"
                    }
                    onClick={() => {
                      if (!available) return;
                      if (selectedScheduleKey === key) {
                        setSelectedScheduleKey(null);
                        setSelectedScheduleId(null);
                        setTimeSlotOpen(false);
                        setSessionOpen(false);
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
              <TimeSlotIcon state={selectedTimeSlotKey ? "selected" : timeSlotOpen ? "open" : "inactive"} />
              <p className="font-semibold text-[24px] leading-none tracking-normal" style={{ color: selectedTimeSlotKey || timeSlotOpen ? "#130E67" : "#8A8A8A" }}>
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
                onMouseEnter={() => isTimeSlotAvailable("morning") && setHoveredTimeSlotKey("morning")}
                onMouseLeave={() => setHoveredTimeSlotKey(null)}
              >
                <span style={{ opacity: timeSlotIconOpacity("morning") }}><MorningIcon color={getTimeSlotIconColor("morning")} /></span>
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
                onMouseEnter={() => isTimeSlotAvailable("afternoon") && setHoveredTimeSlotKey("afternoon")}
                onMouseLeave={() => setHoveredTimeSlotKey(null)}
              >
                <span style={{ opacity: timeSlotIconOpacity("afternoon") }}><AfternoonIcon color={getTimeSlotIconColor("afternoon")} /></span>
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
                onMouseEnter={() => isTimeSlotAvailable("evening") && setHoveredTimeSlotKey("evening")}
                onMouseLeave={() => setHoveredTimeSlotKey(null)}
              >
                <span style={{ opacity: timeSlotIconOpacity("evening") }}><EveningIcon color={getTimeSlotIconColor("evening")} /></span>
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
              <SessionIcon state={selectedSessionKey ? "selected" : sessionOpen ? "open" : "inactive"} />
              <p className="font-semibold text-[24px] leading-none tracking-normal" style={{ color: selectedSessionKey || sessionOpen ? "#130E67" : "#8A8A8A" }}>
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
                  onMouseEnter={() => isSessionAvailable("online") && setHoveredSessionKey("online")}
                  onMouseLeave={() => setHoveredSessionKey(null)}
                >
                  <span style={{ opacity: sessionIconOpacity("online") }}><OnlineIcon color={getSessionIconColor("online")} /></span>
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
                  onMouseEnter={() => isSessionAvailable("in_person") && setHoveredSessionKey("in_person")}
                  onMouseLeave={() => setHoveredSessionKey(null)}
                >
                  <span style={{ opacity: sessionIconOpacity("in_person") }}><InPersonIcon color={getSessionIconColor("in_person")} /></span>
                  <p
                    className="font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]"
                    style={{ color: sessionTextColor("in_person") }}
                  >
                    In-Person
                  </p>
                  <div className="flex h-[15px] items-center mt-[6px] gap-[2px] overflow-hidden">
                    <span style={{ opacity: sessionIconOpacity("in_person") }}><LocationIcon color={getSessionIconColor("in_person")} /></span>
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
                  onMouseEnter={() => isSessionAvailable("hybrid") && setHoveredSessionKey("hybrid")}
                  onMouseLeave={() => setHoveredSessionKey(null)}
                >
                  <span style={{ opacity: sessionIconOpacity("hybrid") }}><HybridIcon color={getSessionIconColor("hybrid")} /></span>
                  <p
                    className="font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]"
                    style={{ color: sessionTextColor("hybrid") }}
                  >
                    Hybrid
                  </p>
                  <div className="flex h-[15px] items-center mt-[6px] gap-[2px] overflow-hidden">
                    <span style={{ opacity: sessionIconOpacity("hybrid") }}><LocationIcon color={getSessionIconColor("hybrid")} /></span>
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
          <button
            type="button"
            className="w-[450px] h-[63px] rounded-[12px] mt-[32px] font-semibold text-[20px] leading-[24px] tracking-normal flex items-center justify-center transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] disabled:cursor-not-allowed"
            style={
              selectedSessionKey &&
              isSessionAvailable(selectedSessionKey) &&
              !enrolling
                ? {
                    backgroundColor: "#736BEA",
                    color: "#ffffff",
                    cursor: "pointer",
                  }
                : {
                    backgroundColor: "#EEEDFC",
                    color: "#B7B3F4",
                    cursor: "default",
                  }
            }
            disabled={
              !selectedSessionKey ||
              !isSessionAvailable(selectedSessionKey || "") ||
              enrolling
            }
            onClick={() => {
              if (isLoggedIn && profileChecked && !profileComplete) {
                setShowCompleteProfileModal(true);
                return;
              }
              handleEnroll(false);
            }}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
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
        {isLoggedIn && profileChecked && !profileComplete && (
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
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#00000040" }}
          onClick={handleSuccessDone}
        >
          <div
            className="bg-white w-[476px] rounded-[16px] p-[60px] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ConfirmedEnrollmentIcon />
            <p className="font-semibold h-[39px] flex items-center text-3xl leading-none tracking-normal text-center text-[#3D3D3D] mt-[24px]">
              Enrollment Confirmed!
            </p>
            <p className=" font-medium text-xl leading-none tracking-normal mt-[24px] text-center text-[#3D3D3D]">
              You've successfully enrolled to the{" "}
              <span className="font-semibold">"{courseTitle}"</span> Course!
            </p>
            <button
              type="button"
              onClick={handleSuccessDone}
              className="w-full h-[58px] mt-[40px] rounded-[10px] bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out text-white text-[16px] cursor-pointer font-medium text-base leading-6 tracking-normal text-center"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {showCompleteProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#00000040" }}
          onClick={() => setShowCompleteProfileModal(false)}
        >
          <div
            className="bg-white w-[476px] rounded-[16px] p-[60px] flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CompleteProfIcon />
            <p className="text-[#3D3D3D] mt-[24px] h-[78px] flex items-center font-semibold text-3xl leading-none tracking-normal">
              Complete your profile <br /> to continue
            </p>
            <p className="mt-[24px]  font-medium text-xl leading-none h-[48px] flex items-center tracking-normal text-[#3D3D3D]">
              You need to complete your profile before enrolling in this course.
            </p>

            <div className="flex gap-[8px] w-full mt-[40px]">
              <button
                type="button"
                onClick={() => {
                  setShowCompleteProfileModal(false);
                  onCompleteProfileClick();
                }}
                className="flex-1 h-[58px] rounded-[8px] border-[2px] border-[#958FEF] cursor-pointer flex items-center justify-center font-medium text-base leading-6 tracking-normal text-center text-[#4F46E5]"
              >
                Complete Profile
              </button>
              <button
                type="button"
                onClick={() => setShowCompleteProfileModal(false)}
                className="flex-1 h-[58px] rounded-[8px]  bg-[#4F46E5]   font-medium text-base leading-6 tracking-normal text-center text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CourseScedule;
