import { User, Course, Week, Lecture } from '@/types';

// Keep the existing users
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

// Update lectures to be finance-related
export const lectures: Lecture[] = [
  {
    id: 'l1',
    courseId: 'c1',
    weekId: 'w1',
    title: 'Introduction to Personal Finance',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder YouTube ID
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    description: 'Learn the fundamental principles of personal financial management.',
  },
  {
    id: 'l2',
    courseId: 'c1',
    weekId: 'w1',
    title: 'Budgeting and Expense Tracking',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    description: 'Master techniques for creating and maintaining an effective personal budget.',
  },
  {
    id: 'l3',
    courseId: 'c1',
    weekId: 'w2',
    title: 'Investment Strategies for Beginners',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (completed)
    description: 'Introduction to different investment vehicles and basic investment principles.',
  },
  {
    id: 'l4',
    courseId: 'c2',
    weekId: 'w3',
    title: 'Understanding Stock Markets',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now (soon to be live)
    description: 'Comprehensive overview of stock market fundamentals and trading basics.',
  },
  {
    id: 'l5',
    courseId: 'c2',
    weekId: 'w3',
    title: 'Cryptocurrency and Blockchain',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (live now)
    description: 'Exploring the world of cryptocurrencies and blockchain technology.',
  },
  {
    id: 'l6',
    courseId: 'c2',
    weekId: 'w4',
    title: 'Retirement Planning',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    description: 'Strategies for effective long-term financial planning and retirement savings.',
  },
];

// Update weeks to match new lecture structure
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

// Update courses to be finance-related
export const courses: Course[] = [
  {
    id: 'c1',
    name: 'Personal Finance Mastery',
    description: 'Comprehensive course covering essential financial skills for personal wealth management.',
    weeks: weeks.filter(week => week.courseId === 'c1'),
  },
  {
    id: 'c2',
    name: 'Investment and Wealth Building',
    description: 'Advanced course exploring investment strategies, market dynamics, and financial growth techniques.',
    weeks: weeks.filter(week => week.courseId === 'c2'),
  },
];
