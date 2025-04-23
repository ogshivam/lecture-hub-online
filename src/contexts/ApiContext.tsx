import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Course, Lecture, Week, LectureStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ApiContextProps {
  users: User[];
  courses: Course[];
  lectures: Lecture[];
  weeks: Week[];
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>; // Updated return type to Promise<boolean>
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
  getLectureStatus: (lecture: Lecture) => LectureStatus;
  getTimeUntilLecture: (lecture: Lecture) => string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          
          // Get user profile data including admin status
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setCurrentUser({
              id: session.user.id,
              username: profile.username,
              role: profile.is_admin ? 'admin' : 'user',
              password: '' // Not needed with Supabase auth
            });
            setIsAdmin(profile.is_admin);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setCurrentUser({
                id: session.user.id,
                username: profile.username,
                role: profile.is_admin ? 'admin' : 'user',
                password: '' // Not needed with Supabase auth
              });
              setIsAdmin(profile.is_admin);
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error) {
      toast.error('An error occurred during login');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
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
        updateCourse,
        deleteCourse,
        addWeek,
        updateWeek,
        deleteWeek,
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
