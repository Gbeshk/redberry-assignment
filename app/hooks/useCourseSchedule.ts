import { useState, useEffect } from "react";

export interface WeeklySchedule {
  id: number;
  label: string;
  days: string[];
}

export interface TimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
}

export interface SessionType {
  id: number;
  courseScheduleId: number;
  name: string;
  priceModifier: string;
  availableSeats: number;
  location?: string;
}

export interface EnrollmentDetail {
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

const BASE = "https://api.redclass.redberryinternship.ge/api";

export function useCourseSchedule(courseId: string, onSignInClick: () => void) {
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

  const [scheduleOpen, setScheduleOpen] = useState(true);
  const [timeSlotOpen, setTimeSlotOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);

  const [hoveredTimeSlotKey, setHoveredTimeSlotKey] = useState<string | null>(
    null,
  );
  const [hoveredSessionKey, setHoveredSessionKey] = useState<string | null>(
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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentChecked, setEnrollmentChecked] = useState(
    () => !localStorage.getItem("authToken"),
  );
  const [enrolling, setEnrolling] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [conflictData, setConflictData] = useState<{
    message: string;
    conflicts: {
      requestedCourseId: number;
      conflictingEnrollmentId: number;
      conflictingCourseName: string;
      schedule: string;
    }[];
  } | null>(null);

  // --- Auth + enrollment check ---
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    if (!token) return;

    Promise.all([
      fetch(`${BASE}/me`, {
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

      fetch(`${BASE}/enrollments`, {
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
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-updated", checkAuth);
    window.addEventListener("profile-updated", checkAuth);
    return () => {
      window.removeEventListener("auth-updated", checkAuth);
      window.removeEventListener("profile-updated", checkAuth);
    };
  }, []);

  useEffect(() => {
    fetch(`${BASE}/courses/${courseId}/weekly-schedules`)
      .then((r) => r.json())
      .then((json) => setWeeklySchedules(json.data ?? []))
      .catch(() => {});
  }, [courseId]);

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
      `${BASE}/courses/${courseId}/time-slots?weekly_schedule_id=${selectedScheduleId}`,
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
      `${BASE}/courses/${courseId}/session-types?weekly_schedule_id=${selectedScheduleId}&time_slot_id=${selectedTimeSlotId}`,
    )
      .then((r) => r.json())
      .then((json) => setSessionTypes(json.data ?? []))
      .catch(() => {});
  }, [courseId, selectedScheduleId, selectedTimeSlotId]);

  // --- Lock scroll when modals open ---
  useEffect(() => {
    document.body.style.overflow =
      showSuccessModal || showCompleteProfileModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSuccessModal, showCompleteProfileModal]);

  // --- Helpers ---
  const matchSchedule = (label: string) =>
    weeklySchedules.find((s) => s.label.toLowerCase() === label.toLowerCase());

  const matchTimeSlot = (key: string) =>
    timeSlots.find((s) => s.label.toLowerCase().includes(key));

  const matchSession = (key: string) =>
    sessionTypes.find((s) => s.name.toLowerCase() === key);

  const isTimeSlotAvailable = (key: string) =>
    timeSlots.length > 0 && !!matchTimeSlot(key);

  const isSessionAvailable = (key: string) => {
    const s = matchSession(key);
    return !!s && s.availableSeats > 0;
  };

  const selectedSession = selectedSessionKey
    ? matchSession(selectedSessionKey)
    : null;
  const sessionMod = selectedSession
    ? parseFloat(selectedSession.priceModifier)
    : 0;

  // --- Schedule handlers ---
  const handleScheduleClick = (key: string, label: string) => {
    if (selectedScheduleKey === key) {
      setSelectedScheduleKey(null);
      setSelectedScheduleId(null);
      setTimeSlotOpen(false);
      setSessionOpen(false);
    } else {
      const match = matchSchedule(label);
      setSelectedScheduleKey(key);
      setSelectedScheduleId(match?.id ?? null);
      setSelectedTimeSlotKey(null);
      setSelectedTimeSlotId(null);
      setSelectedSessionKey(null);
      setTimeSlotOpen(true);
      setSessionOpen(false);
    }
  };

  const handleTimeSlotClick = (key: string) => {
    const match = matchTimeSlot(key);
    if (!match) return;
    if (selectedTimeSlotKey === key) {
      setSelectedTimeSlotKey(null);
      setSelectedTimeSlotId(null);
      setSelectedSessionKey(null);
      setSessionOpen(false);
    } else {
      setSelectedTimeSlotKey(key);
      setSelectedTimeSlotId(match.id);
      setSelectedSessionKey(null);
      setSessionOpen(true);
    }
  };

  const handleSessionClick = (key: string) => {
    if (!isSessionAvailable(key)) return;
    setSelectedSessionKey(key === selectedSessionKey ? null : key);
  };

  const handleToggleSchedule = () => setScheduleOpen((o) => !o);
  const handleToggleTimeSlot = () => {
    if (selectedScheduleId !== null) setTimeSlotOpen((o) => !o);
  };
  const handleToggleSession = () => {
    if (selectedTimeSlotId !== null) setSessionOpen((o) => !o);
  };

  // --- Enroll ---
  const handleEnroll = async (force = false) => {
    if (!selectedSessionKey || !isSessionAvailable(selectedSessionKey)) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      onSignInClick();
      return;
    }
    const session = matchSession(selectedSessionKey);
    if (!session) return;

    setEnrolling(true);
    try {
      const res = await fetch(`${BASE}/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          courseId: Number(courseId),
          courseScheduleId: session.courseScheduleId,
          force,
        }),
      });
      if (res.status === 401) {
        onSignInClick();
        return;
      }
      if (res.status === 409) {
        setConflictData(await res.json());
        return;
      }
      if (res.status === 201) {
        const json = await res.json();
        setEnrollmentDetail(json.data ?? null);
        setShowSuccessModal(true);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleEnrollClick = () => {
    if (isLoggedIn && profileChecked && !profileComplete) {
      setShowCompleteProfileModal(true);
      return;
    }
    handleEnroll(false);
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    setIsEnrolled(true);
  };

  return {
    // data
    weeklySchedules,
    timeSlots,
    sessionTypes,
    // selections
    selectedScheduleKey,
    selectedTimeSlotKey,
    selectedSessionKey,
    selectedScheduleId,
    selectedTimeSlotId,
    // open/closed
    scheduleOpen,
    timeSlotOpen,
    sessionOpen,
    // hover
    hoveredTimeSlotKey,
    setHoveredTimeSlotKey,
    hoveredSessionKey,
    setHoveredSessionKey,
    // auth/enrollment
    isLoggedIn,
    profileComplete,
    profileChecked,
    enrollmentDetail,
    isEnrolled,
    setIsEnrolled,
    setEnrollmentDetail,
    enrollmentChecked,
    enrolling,
    // modals
    showSuccessModal,
    showCompleteProfileModal,
    conflictData,
    setShowCompleteProfileModal,
    setConflictData,
    // computed
    sessionMod,
    selectedSession,
    isTimeSlotAvailable,
    isSessionAvailable,
    matchSchedule,
    matchTimeSlot,
    matchSession,
    // handlers
    handleScheduleClick,
    handleTimeSlotClick,
    handleSessionClick,
    handleToggleSchedule,
    handleToggleTimeSlot,
    handleToggleSession,
    handleEnroll,
    handleEnrollClick,
    handleSuccessDone,
  };
}
