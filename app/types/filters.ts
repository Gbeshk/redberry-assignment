export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Topic {
  id: number;
  categoryId: number;
  name: string;
}

export interface Instructor {
  id: number;
  name: string;
  avatar: string;
}