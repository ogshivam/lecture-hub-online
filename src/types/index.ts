export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  courseId: string;
  weekId: string;
  youtubeId: string;
  scheduledTime: string;
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
  description: string;
  weeks: Week[];
}

export type LectureStatus = 'upcoming' | 'live' | 'completed';
