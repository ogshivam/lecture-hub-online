import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Course, Lecture, Week, LectureStatus } from '@/types';
import { users as mockUsers, courses as mockCourses, lectures as mockLectures, weeks as mockWeeks, referralManagers as mockReferralManagers, referralLinks as mockReferralLinks, ReferralManager, ReferralLink, UserWithReferral } from '@/data/mockData';
import { toast } from 'sonner';
import { getStoredReferralCode, clearStoredReferralCode } from '@/utils/referralUtils';

interface ApiContextProps {
  users: UserWithReferral[];
  courses: Course[];
  lectures: Lecture[];
  weeks: Week[];
  referralManagers: ReferralManager[];
  referralLinks: ReferralLink[];
  currentUser: UserWithReferral | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addCourse: (course: Omit<Course, 'id' | 'weeks'>) => Course;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addWeek: (week: Omit<Week, 'id' | 'lectures'>) => Week;
  updateWeek: (week: Week) => void;
  deleteWeek: (id: string) => void;
  addLecture: (lecture: Omit<Lecture, 'id'>) => Lecture;
  updateLecture: (lecture: Lecture) => void;
  deleteLecture: (id: string) => void;
  addReferralManager: (rm: Omit<ReferralManager, 'rmId' | 'created_at'>) => void;
  addReferralLink: (link: Omit<ReferralLink, 'created_at'>) => void;
  getLectureStatus: (lecture: Lecture) => LectureStatus;
  getTimeUntilLecture: (lecture: Lecture) => string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  createUser: (userData: { name: string; email: string; mobile: string; referralCode?: string }) => boolean;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserWithReferral[]>(mockUsers);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [lectures, setLectures] = useState<Lecture[]>(mockLectures);
  const [weeks, setWeeks] = useState<Week[]>(mockWeeks);
  const [referralManagers, setReferralManagers] = useState<ReferralManager[]>(mockReferralManagers);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>(mockReferralLinks);
  const [currentUser, setCurrentUser] = useState<UserWithReferral | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const login = (username: string, password: string) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Check for referral code
      const referralCode = getStoredReferralCode();
      if (referralCode) {
        const referralLink = referralLinks.find(link => link.referralCode === referralCode);
        if (referralLink) {
          user.referredBy = {
            rmId: referralLink.rmId,
            lectureId: referralLink.lectureId,
          };
          // Update user in the list
          setUsers(users.map(u => u.id === user.id ? user : u));
        }
        clearStoredReferralCode();
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
  };

  const addReferralManager = (rmData: Omit<ReferralManager, 'rmId' | 'created_at'>) => {
    const newRm: ReferralManager = {
      rmId: `rm${referralManagers.length + 1}`,
      ...rmData,
      created_at: new Date().toISOString(),
    };

    setReferralManagers([...referralManagers, newRm]);
  };

  const addReferralLink = (linkData: Omit<ReferralLink, 'created_at'>) => {
    const newLink: ReferralLink = {
      ...linkData,
      created_at: new Date().toISOString(),
    };

    setReferralLinks([...referralLinks, newLink]);
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'weeks'>) => {
    const newCourse: Course = {
      id: `c${courses.length + 1}`,
      ...courseData,
      weeks: [],
    };

    setCourses([...courses, newCourse]);
    toast.success(`Course "${courseData.name}" added successfully!`);
    return newCourse;
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    
    toast.success(`Course "${updatedCourse.name}" updated successfully!`);
  };

  const deleteCourse = (id: string) => {
    const courseToDelete = courses.find((course) => course.id === id);
    
    if (!courseToDelete) return;
    
    // Delete all weeks and lectures associated with this course
    const weeksToDelete = weeks.filter(week => week.courseId === id);
    const lectureIdsToDelete = weeksToDelete.flatMap(week => 
      week.lectures.map(lecture => lecture.id)
    );
    
    setLectures(lectures.filter(lecture => !lectureIdsToDelete.includes(lecture.id)));
    setWeeks(weeks.filter(week => week.courseId !== id));
    setCourses(courses.filter(course => course.id !== id));
    
    toast.success(`Course deleted successfully!`);
  };

  const addWeek = (weekData: Omit<Week, 'id' | 'lectures'>) => {
    const newWeek: Week = {
      id: `w${weeks.length + 1}`,
      ...weekData,
      lectures: [],
    };

    setWeeks([...weeks, newWeek]);
    
    // Update courses with new week
    setCourses(
      courses.map((course) => {
        if (course.id === weekData.courseId) {
          return {
            ...course,
            weeks: [...course.weeks, newWeek],
          };
        }
        return course;
      })
    );
    
    toast.success(`Week "${weekData.name}" added successfully!`);
    return newWeek;
  };

  const updateWeek = (updatedWeek: Week) => {
    setWeeks(
      weeks.map((week) =>
        week.id === updatedWeek.id ? updatedWeek : week
      )
    );
    
    // Update courses
    setCourses(
      courses.map((course) => {
        if (course.id === updatedWeek.courseId) {
          return {
            ...course,
            weeks: course.weeks.map((week) =>
              week.id === updatedWeek.id ? updatedWeek : week
            ),
          };
        }
        return course;
      })
    );
    
    toast.success(`Week "${updatedWeek.name}" updated successfully!`);
  };

  const deleteWeek = (id: string) => {
    const weekToDelete = weeks.find((week) => week.id === id);
    
    if (!weekToDelete) return;
    
    // Delete all lectures associated with this week
    const lectureIdsToDelete = weekToDelete.lectures.map(lecture => lecture.id);
    
    setLectures(lectures.filter(lecture => !lectureIdsToDelete.includes(lecture.id)));
    setWeeks(weeks.filter(week => week.id !== id));
    
    // Update courses
    setCourses(
      courses.map((course) => {
        if (course.id === weekToDelete.courseId) {
          return {
            ...course,
            weeks: course.weeks.filter((week) => week.id !== id),
          };
        }
        return course;
      })
    );
    
    toast.success(`Week deleted successfully!`);
  };

  const addLecture = (lectureData: Omit<Lecture, 'id'>) => {
    const newLecture: Lecture = {
      id: `l${lectures.length + 1}`,
      ...lectureData,
    };

    setLectures([...lectures, newLecture]);
    
    // Update weeks with new lecture
    setWeeks(
      weeks.map((week) => {
        if (week.id === lectureData.weekId) {
          return {
            ...week,
            lectures: [...week.lectures, newLecture],
          };
        }
        return week;
      })
    );
    
    // Update courses
    setCourses(
      courses.map((course) => {
        if (course.id === lectureData.courseId) {
          return {
            ...course,
            weeks: course.weeks.map((week) => {
              if (week.id === lectureData.weekId) {
                return {
                  ...week,
                  lectures: [...week.lectures, newLecture],
                };
              }
              return week;
            }),
          };
        }
        return course;
      })
    );
    
    toast.success(`Lecture "${lectureData.title}" added successfully!`);
    return newLecture;
  };

  const updateLecture = (updatedLecture: Lecture) => {
    setLectures(
      lectures.map((lecture) =>
        lecture.id === updatedLecture.id ? updatedLecture : lecture
      )
    );
    
    // Update weeks
    setWeeks(
      weeks.map((week) => {
        if (week.id === updatedLecture.weekId) {
          return {
            ...week,
            lectures: week.lectures.map((lecture) =>
              lecture.id === updatedLecture.id ? updatedLecture : lecture
            ),
          };
        }
        return week;
      })
    );
    
    // Update courses
    setCourses(
      courses.map((course) => {
        if (course.id === updatedLecture.courseId) {
          return {
            ...course,
            weeks: course.weeks.map((week) => {
              if (week.id === updatedLecture.weekId) {
                return {
                  ...week,
                  lectures: week.lectures.map((lecture) =>
                    lecture.id === updatedLecture.id ? updatedLecture : lecture
                  ),
                };
              }
              return week;
            }),
          };
        }
        return course;
      })
    );
    
    toast.success(`Lecture "${updatedLecture.title}" updated successfully!`);
  };

  const deleteLecture = (id: string) => {
    const lectureToDelete = lectures.find((lecture) => lecture.id === id);
    
    if (!lectureToDelete) return;
    
    setLectures(lectures.filter((lecture) => lecture.id !== id));
    
    // Update weeks
    setWeeks(
      weeks.map((week) => {
        if (week.id === lectureToDelete.weekId) {
          return {
            ...week,
            lectures: week.lectures.filter((lecture) => lecture.id !== id),
          };
        }
        return week;
      })
    );
    
    // Update courses
    setCourses(
      courses.map((course) => {
        if (course.id === lectureToDelete.courseId) {
          return {
            ...course,
            weeks: course.weeks.map((week) => {
              if (week.id === lectureToDelete.weekId) {
                return {
                  ...week,
                  lectures: week.lectures.filter((lecture) => lecture.id !== id),
                };
              }
              return week;
            }),
          };
        }
        return course;
      })
    );
    
    toast.success(`Lecture deleted successfully!`);
  };

  const getLectureStatus = (lecture: Lecture): LectureStatus => {
    const now = new Date();
    const scheduledTime = new Date(lecture.scheduledTime);
    const endTime = new Date(scheduledTime);
    endTime.setHours(endTime.getHours() + 1); // Assume 1 hour lectures
    
    if (now < scheduledTime) {
      return 'upcoming';
    } else if (now >= scheduledTime && now <= endTime) {
      return 'live';
    } else {
      return 'completed';
    }
  };

  const getTimeUntilLecture = (lecture: Lecture): string => {
    const now = new Date();
    const scheduledTime = new Date(lecture.scheduledTime);
    
    if (now >= scheduledTime) {
      return '';
    }
    
    const diffMs = scheduledTime.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const createUser = (userData: { name: string; email: string; mobile: string; referralCode?: string }) => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      toast.error('Email already registered');
      return false;
    }

    // Create new user
    const newUser: UserWithReferral = {
      id: `u${users.length + 1}`,
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      role: 'user',
      // If there's a referral code, add the referral information
      ...(userData.referralCode && {
        referredBy: {
          rmId: userData.referralCode.split('-')[0],
          lectureId: userData.referralCode.split('-')[1],
        },
      }),
    };

    setUsers([...users, newUser]);
    return true;
  };

  return (
    <ApiContext.Provider
      value={{
        users,
        courses,
        lectures,
        weeks,
        referralManagers,
        referralLinks,
        currentUser,
        login,
        logout,
        addCourse,
        updateCourse,
        deleteCourse,
        addWeek,
        updateWeek,
        deleteWeek,
        addLecture,
        updateLecture,
        deleteLecture,
        addReferralManager,
        addReferralLink,
        getLectureStatus,
        getTimeUntilLecture,
        isAuthenticated,
        isAdmin,
        createUser,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
