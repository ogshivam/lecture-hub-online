
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
    title: 'Introduction to Stock Markets',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder - Replace with real unlisted IDs in production
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    description: 'Learn the basics of how stock markets function and the key terminology.',
  },
  {
    id: 'l2',
    courseId: 'c1',
    weekId: 'w1',
    title: 'Understanding Market Indices',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    description: 'Deep dive into market indices, their composition, and importance in market analysis.',
  },
  {
    id: 'l3',
    courseId: 'c1',
    weekId: 'w2',
    title: 'Technical Analysis Fundamentals',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (completed)
    description: 'Introduction to chart patterns and technical indicators for stock analysis.',
  },
  {
    id: 'l4',
    courseId: 'c2',
    weekId: 'w3',
    title: 'Mutual Fund Basics',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now (soon to be live)
    description: 'Understanding different types of mutual funds and their investment strategies.',
  },
  {
    id: 'l5',
    courseId: 'c2',
    weekId: 'w3',
    title: 'SIP vs Lump Sum Investments',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (live now)
    description: 'Comparing systematic investment plans and lump sum investment approaches.',
  },
  {
    id: 'l6',
    courseId: 'c2',
    weekId: 'w4',
    title: 'Tax Planning with Mutual Funds',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    description: 'Learn how to optimize your tax liability using mutual fund investments.',
  },
];

// Sample weeks
export const weeks: Week[] = [
  {
    id: 'w1',
    name: 'Week 1 - Market Fundamentals',
    courseId: 'c1',
    lectures: lectures.filter(lecture => lecture.weekId === 'w1'),
  },
  {
    id: 'w2',
    name: 'Week 2 - Technical Analysis',
    courseId: 'c1',
    lectures: lectures.filter(lecture => lecture.weekId === 'w2'),
  },
  {
    id: 'w3',
    name: 'Week 1 - Introduction to Mutual Funds',
    courseId: 'c2',
    lectures: lectures.filter(lecture => lecture.weekId === 'w3'),
  },
  {
    id: 'w4',
    name: 'Week 2 - Advanced Mutual Fund Strategies',
    courseId: 'c2',
    lectures: lectures.filter(lecture => lecture.weekId === 'w4'),
  },
];

// Sample courses
export const courses: Course[] = [
  {
    id: 'c1',
    name: 'Stock Market Fundamentals',
    description: 'A comprehensive course covering all aspects of stock market investing for beginners.',
    weeks: weeks.filter(week => week.courseId === 'c1'),
  },
  {
    id: 'c2',
    name: 'Mutual Fund Mastery',
    description: 'Master the art of mutual fund investing with this detailed guide to fund selection and strategies.',
    weeks: weeks.filter(week => week.courseId === 'c2'),
  },
];

// Relationship Managers data
export const relationshipManagers = [
  {
    id: 'RM001',
    name: 'Raj Mehta',
    email: 'raj.mehta@example.com',
  },
  {
    id: 'RM002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
  },
];
