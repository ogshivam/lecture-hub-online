
import { User, Course, Week, Lecture } from '@/types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin', // In production, this would be hashed
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    password: 'user', // In production, this would be hashed
    role: 'user',
  },
];

// Sample lectures with actual YouTube IDs (using placeholder IDs)
export const lectures: Lecture[] = [
  {
    id: 'l1',
    courseId: 'c1',
    weekId: 'w1',
    title: 'Atomic Structure - Basics',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder - Replace with real unlisted IDs in production
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    description: 'Introduction to atomic structure and basic principles of chemistry.',
  },
  {
    id: 'l2',
    courseId: 'c1',
    weekId: 'w1',
    title: 'Chemical Bonding',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    description: 'Understanding different types of chemical bonds and their properties.',
  },
  {
    id: 'l3',
    courseId: 'c1',
    weekId: 'w2',
    title: 'Thermodynamics Part 1',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (completed)
    description: 'First laws of thermodynamics and their applications.',
  },
  {
    id: 'l4',
    courseId: 'c2',
    weekId: 'w3',
    title: 'Cell Structure & Functions',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now (soon to be live)
    description: 'Detailed explanation of cell organelles and their functions.',
  },
  {
    id: 'l5',
    courseId: 'c2',
    weekId: 'w3',
    title: 'Plant Physiology',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (live now)
    description: 'Understanding plant growth, development and physiological processes.',
  },
  {
    id: 'l6',
    courseId: 'c2',
    weekId: 'w4',
    title: 'Human Anatomy Basics',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    description: 'Introduction to major organ systems in the human body.',
  },
];

// Sample weeks
export const weeks: Week[] = [
  {
    id: 'w1',
    name: 'Week 1',
    courseId: 'c1',
    lectures: lectures.filter(lecture => lecture.weekId === 'w1'),
  },
  {
    id: 'w2',
    name: 'Week 2',
    courseId: 'c1',
    lectures: lectures.filter(lecture => lecture.weekId === 'w2'),
  },
  {
    id: 'w3',
    name: 'Week 1',
    courseId: 'c2',
    lectures: lectures.filter(lecture => lecture.weekId === 'w3'),
  },
  {
    id: 'w4',
    name: 'Week 2',
    courseId: 'c2',
    lectures: lectures.filter(lecture => lecture.weekId === 'w4'),
  },
];

// Sample courses
export const courses: Course[] = [
  {
    id: 'c1',
    name: 'JEE Chemistry',
    description: 'Comprehensive course covering all chemistry topics for JEE preparation.',
    weeks: weeks.filter(week => week.courseId === 'c1'),
  },
  {
    id: 'c2',
    name: 'NEET Biology',
    description: 'Complete biology preparation for NEET aspirants with detailed explanations.',
    weeks: weeks.filter(week => week.courseId === 'c2'),
  },
];
