
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
}

export interface Lecture {
  id: string;
  courseId: string;
  weekId: string;
  title: string;
  youtubeId: string;
  scheduledTime: string; // ISO string
  description?: string;
}

export interface Week {
  id: string;
  name: string;
  courseId: string;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  weeks: Week[];
}

export type LectureStatus = 'upcoming' | 'live' | 'completed';
