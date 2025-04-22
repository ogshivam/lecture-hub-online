import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Lecture, Week, LectureStatus } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface RelationshipManager {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

type Profile = {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  referred_by: string | null;
  referral_code: string | null;
}

interface ApiContextProps {
  courses: Course[];
  lectures: Lecture[];
  weeks: Week[];
  currentUser: any;
  logout: () => void;
  addCourse: (course: Omit<Course, 'id' | 'weeks'>) => Promise<Course | null>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addWeek: (week: Omit<Week, 'id' | 'lectures'>) => Promise<Week | null>;
  updateWeek: (week: Week) => Promise<void>;
  deleteWeek: (id: string) => Promise<void>;
  addLecture: (lecture: Omit<Lecture, 'id'>) => Promise<Lecture | null>;
  updateLecture: (lecture: Lecture) => Promise<void>;
  deleteLecture: (id: string) => Promise<void>;
  getLectureStatus: (lecture: Lecture) => LectureStatus;
  getTimeUntilLecture: (lecture: Lecture) => string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  relationshipManagers: RelationshipManager[];
  rmClients: Record<string, Profile[]>;
  addRelationshipManager: (data: { name: string; email: string }) => Promise<void>;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const isAuthenticated = !!user;
  const [relationshipManagers, setRelationshipManagers] = useState<RelationshipManager[]>([]);
  const [rmClients, setRmClients] = useState<Record<string, Profile[]>>({});

  // Fetch data when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchWeeks();
      fetchLectures();
    } else {
      // Clear data when logged out
      setCourses([]);
      setWeeks([]);
      setLectures([]);
    }
  }, [isAuthenticated]);

  // Add this useEffect to fetch RMs when authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchRelationshipManagers();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      const formattedCourses = data.map(course => ({
        ...course,
        id: course.id,
        name: course.name,
        description: course.description,
        weeks: [], // Will be populated later
      }));
      
      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const fetchWeeks = async () => {
    try {
      const { data, error } = await supabase
        .from('weeks')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      const formattedWeeks = data.map(week => ({
        ...week,
        id: week.id,
        name: week.name,
        courseId: week.course_id,
        lectures: [], // Will be populated later
      }));
      
      setWeeks(formattedWeeks);
    } catch (error) {
      console.error('Error fetching weeks:', error);
      toast.error('Failed to load weeks');
    }
  };

  const fetchLectures = async () => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .order('scheduled_time');
        
      if (error) {
        throw error;
      }
      
      const formattedLectures = data.map(lecture => ({
        ...lecture,
        id: lecture.id,
        courseId: lecture.course_id,
        weekId: lecture.week_id,
        title: lecture.title,
        youtubeId: lecture.youtube_id,
        scheduledTime: lecture.scheduled_time,
        description: lecture.description,
      }));
      
      setLectures(formattedLectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      toast.error('Failed to load lectures');
    }
  };

  const fetchRelationshipManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('relationship_managers')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setRelationshipManagers(data);
      
      // Fetch clients for each RM
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .not('referred_by', 'is', null);
        
      if (profilesError) throw profilesError;
      
      // Fix the type issue by correctly typing the profiles
      const clientsByRM: Record<string, Profile[]> = {};
      
      // Process profiles and group them by referred_by
      profiles.forEach((profile: Profile) => {
        if (profile.referred_by) {
          if (!clientsByRM[profile.referred_by]) {
            clientsByRM[profile.referred_by] = [];
          }
          clientsByRM[profile.referred_by].push(profile);
        }
      });
      
      setRmClients(clientsByRM);
    } catch (error) {
      console.error('Error fetching relationship managers:', error);
      toast.error('Failed to load relationship managers');
    }
  };

  // Update the course objects with their related weeks and lectures
  useEffect(() => {
    if (courses.length && weeks.length && lectures.length) {
      // First, add lectures to their corresponding weeks
      const updatedWeeks = weeks.map(week => {
        const weekLectures = lectures.filter(lecture => lecture.weekId === week.id);
        return { ...week, lectures: weekLectures };
      });
      
      setWeeks(updatedWeeks);
      
      // Then, add weeks to their corresponding courses
      const updatedCourses = courses.map(course => {
        const courseWeeks = updatedWeeks.filter(week => week.courseId === course.id);
        return { ...course, weeks: courseWeeks };
      });
      
      setCourses(updatedCourses);
    }
  }, [courses, weeks, lectures]);

  const logout = async () => {
    await signOut();
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'weeks'>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          { name: courseData.name, description: courseData.description }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const newCourse: Course = {
        id: data.id,
        name: data.name,
        description: data.description,
        weeks: [],
      };
      
      setCourses(prev => [...prev, newCourse]);
      toast.success(`Course "${courseData.name}" added successfully!`);
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
      return null;
    }
  };

  const updateCourse = async (updatedCourse: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          name: updatedCourse.name,
          description: updatedCourse.description
        })
        .eq('id', updatedCourse.id);
        
      if (error) {
        throw error;
      }
      
      setCourses(prev =>
        prev.map(course => course.id === updatedCourse.id ? 
          { ...updatedCourse, weeks: course.weeks } : course
        )
      );
      
      toast.success(`Course "${updatedCourse.name}" updated successfully!`);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setCourses(prev => prev.filter(course => course.id !== id));
      
      // Since we have CASCADE deletes in the database, we should also update our local state
      const weekIds = weeks.filter(week => week.courseId === id).map(week => week.id);
      setWeeks(prev => prev.filter(week => !weekIds.includes(week.id)));
      setLectures(prev => prev.filter(lecture => lecture.courseId !== id));
      
      toast.success('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const addWeek = async (weekData: Omit<Week, 'id' | 'lectures'>) => {
    try {
      const { data, error } = await supabase
        .from('weeks')
        .insert([
          { name: weekData.name, course_id: weekData.courseId }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const newWeek: Week = {
        id: data.id,
        name: data.name,
        courseId: data.course_id,
        lectures: [],
      };
      
      setWeeks(prev => [...prev, newWeek]);
      
      // Update the course with the new week
      setCourses(prev =>
        prev.map(course => {
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
    } catch (error) {
      console.error('Error adding week:', error);
      toast.error('Failed to add week');
      return null;
    }
  };

  const updateWeek = async (updatedWeek: Week) => {
    try {
      const { error } = await supabase
        .from('weeks')
        .update({ name: updatedWeek.name })
        .eq('id', updatedWeek.id);
        
      if (error) {
        throw error;
      }
      
      // Update weeks state
      setWeeks(prev =>
        prev.map(week => week.id === updatedWeek.id ? 
          { ...updatedWeek, lectures: week.lectures } : week
        )
      );
      
      // Update courses state
      setCourses(prev =>
        prev.map(course => {
          if (course.id === updatedWeek.courseId) {
            return {
              ...course,
              weeks: course.weeks.map(week => 
                week.id === updatedWeek.id ? 
                { ...updatedWeek, lectures: week.lectures } : week
              ),
            };
          }
          return course;
        })
      );
      
      toast.success(`Week "${updatedWeek.name}" updated successfully!`);
    } catch (error) {
      console.error('Error updating week:', error);
      toast.error('Failed to update week');
    }
  };

  const deleteWeek = async (id: string) => {
    try {
      // Find the week before deleting it
      const weekToDelete = weeks.find(week => week.id === id);
      if (!weekToDelete) return;
      
      const { error } = await supabase
        .from('weeks')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update weeks state
      setWeeks(prev => prev.filter(week => week.id !== id));
      
      // Update lectures state (since we have CASCADE deletes)
      const lectureIds = weekToDelete.lectures.map(lecture => lecture.id);
      setLectures(prev => prev.filter(lecture => !lectureIds.includes(lecture.id)));
      
      // Update courses state
      setCourses(prev =>
        prev.map(course => {
          if (course.id === weekToDelete.courseId) {
            return {
              ...course,
              weeks: course.weeks.filter(week => week.id !== id),
            };
          }
          return course;
        })
      );
      
      toast.success(`Week deleted successfully!`);
    } catch (error) {
      console.error('Error deleting week:', error);
      toast.error('Failed to delete week');
    }
  };

  const addLecture = async (lectureData: Omit<Lecture, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .insert([
          {
            course_id: lectureData.courseId,
            week_id: lectureData.weekId,
            title: lectureData.title,
            youtube_id: lectureData.youtubeId,
            scheduled_time: lectureData.scheduledTime,
            description: lectureData.description,
          }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const newLecture: Lecture = {
        id: data.id,
        courseId: data.course_id,
        weekId: data.week_id,
        title: data.title,
        youtubeId: data.youtube_id,
        scheduledTime: data.scheduled_time,
        description: data.description,
      };
      
      // Update lectures state
      setLectures(prev => [...prev, newLecture]);
      
      // Update weeks state
      setWeeks(prev =>
        prev.map(week => {
          if (week.id === lectureData.weekId) {
            return {
              ...week,
              lectures: [...week.lectures, newLecture],
            };
          }
          return week;
        })
      );
      
      // Update courses state
      setCourses(prev =>
        prev.map(course => {
          if (course.id === lectureData.courseId) {
            return {
              ...course,
              weeks: course.weeks.map(week => {
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
    } catch (error) {
      console.error('Error adding lecture:', error);
      toast.error('Failed to add lecture');
      return null;
    }
  };

  const updateLecture = async (updatedLecture: Lecture) => {
    try {
      const { error } = await supabase
        .from('lectures')
        .update({
          title: updatedLecture.title,
          youtube_id: updatedLecture.youtubeId,
          scheduled_time: updatedLecture.scheduledTime,
          description: updatedLecture.description,
        })
        .eq('id', updatedLecture.id);
        
      if (error) {
        throw error;
      }
      
      // Update lectures state
      setLectures(prev =>
        prev.map(lecture => lecture.id === updatedLecture.id ? updatedLecture : lecture)
      );
      
      // Update weeks state
      setWeeks(prev =>
        prev.map(week => {
          if (week.id === updatedLecture.weekId) {
            return {
              ...week,
              lectures: week.lectures.map(lecture => 
                lecture.id === updatedLecture.id ? updatedLecture : lecture
              ),
            };
          }
          return week;
        })
      );
      
      // Update courses state
      setCourses(prev =>
        prev.map(course => {
          if (course.id === updatedLecture.courseId) {
            return {
              ...course,
              weeks: course.weeks.map(week => {
                if (week.id === updatedLecture.weekId) {
                  return {
                    ...week,
                    lectures: week.lectures.map(lecture => 
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
    } catch (error) {
      console.error('Error updating lecture:', error);
      toast.error('Failed to update lecture');
    }
  };

  const deleteLecture = async (id: string) => {
    try {
      // Find the lecture before deleting it
      const lectureToDelete = lectures.find(lecture => lecture.id === id);
      if (!lectureToDelete) return;
      
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update lectures state
      setLectures(prev => prev.filter(lecture => lecture.id !== id));
      
      // Update weeks state
      setWeeks(prev =>
        prev.map(week => {
          if (week.id === lectureToDelete.weekId) {
            return {
              ...week,
              lectures: week.lectures.filter(lecture => lecture.id !== id),
            };
          }
          return week;
        })
      );
      
      // Update courses state
      setCourses(prev =>
        prev.map(course => {
          if (course.id === lectureToDelete.courseId) {
            return {
              ...course,
              weeks: course.weeks.map(week => {
                if (week.id === lectureToDelete.weekId) {
                  return {
                    ...week,
                    lectures: week.lectures.filter(lecture => lecture.id !== id),
                  };
                }
                return week;
              }),
            };
          }
          return course;
        })
      );
      
      toast.success('Lecture deleted successfully!');
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast.error('Failed to delete lecture');
    }
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

  const addRelationshipManager = async (data: { name: string; email: string }) => {
    try {
      const { error } = await supabase
        .from('relationship_managers')
        .insert([data]);
        
      if (error) throw error;
      
      await fetchRelationshipManagers();
    } catch (error: any) {
      console.error('Error adding relationship manager:', error);
      throw new Error(error.message || 'Failed to add relationship manager');
    }
  };

  return (
    <ApiContext.Provider
      value={{
        courses,
        lectures,
        weeks,
        currentUser: user,
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
        isLoading,
        relationshipManagers,
        rmClients,
        addRelationshipManager,
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
