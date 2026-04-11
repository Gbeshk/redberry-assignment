export interface EnrollmentDetail {
  id: number;
  progress: number;
  isRated?: boolean;
  course?: { id: number };
  schedule?: {
    weeklySchedule?: { label: string };
    timeSlot?: { label: string; startTime?: string; endTime?: string };
    sessionType?: { name: string; location?: string };
    location?: string;
  };
}
export interface ConflictEntry {
  requestedCourseId: number;
  conflictingEnrollmentId: number;
  conflictingCourseName: string;
  schedule: string;
}

export interface ConflictData {
  message: string;
  conflicts: ConflictEntry[];
}
export interface FullEnrollment {
  id: number;
  totalPrice: number;
  progress: number;
  completedAt: string | null;
  course: {
    id: number;
    title: string;
    description: string;
    image: string;
    basePrice: number;
    durationWeeks: number;
    avgRating: number;
    reviewCount: number;
    instructor: { id: number; name: string; avatar: string };
    category: { id: number; name: string; icon: string };
  };
  schedule: {
    weeklySchedule: { id: number; label: string; days: string[] };
    timeSlot: { id: number; label: string; startTime: string; endTime: string };
    sessionType: {
      id: number;
      name: string;
      priceModifier: number;
      availableSeats: number;
      location: string;
    };
    location: string;
  };
}