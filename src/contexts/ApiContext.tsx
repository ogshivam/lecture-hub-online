import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Course, Lecture, Week, LectureStatus } from '@/types';
import { users as mockUsers, courses as mockCourses, lectures as mockLectures, weeks as mockWeeks } from '@/data/mockData';
import { toast } from 'sonner';

interface ApiContextProps {
  users: User[];
  courses: Course[];
  lectures: Lecture[];
  weeks: Week[];
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addCourse: (course: Omit<Course, 'id' | 'weeks'>) => Course;
  addWeek: (week: Omit<Week, 'id' | 'lectures'>) => Week;
  addLecture: (lecture: Omit<Lecture, 'id'>) => Lecture;
  updateLecture: (lecture: Lecture) => void;
  deleteLecture: (id: string) => void;
  getLectureStatus: (lecture: Lecture) => LectureStatus;
  getTimeUntilLecture: (lecture: Lecture) => string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [lectures, setLectures] = useState<Lecture[]>(mockLectures);
  const [weeks, setWeeks] = useState<Week[]>(mockWeeks);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  return (
    <ApiContext.Provider
      value={{
        users,
        courses,
        lectures,
        weeks,
        currentUser,
        login,
        logout,
        addCourse,
        addWeek,
        addLecture,
        updateLecture,
        deleteLecture,
        getLectureStatus,
        getTimeUntilLecture,
        isAuthenticated,
        isAdmin,
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
