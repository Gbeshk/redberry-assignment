export interface Category {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  name: string;
}

export interface Instructor {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: number;
  durationWeeks: number;
  hours: number;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  isRated: boolean;
  reviews?: { userId: number; rating: number }[];
  category: Category;
  topic: Topic;
  instructor: Instructor;
}
export type CourseBase = {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: string;
  durationWeeks: number;
  isFeatured: boolean;
  avgRating: number | null;
  reviewCount: number;
  category: { id: number; name: string };
  topic: { id: number; name: string };
  instructor: { id: number; name: string; avatar: string };
};
