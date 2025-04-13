
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, BookOpen, ChevronRight } from 'lucide-react';
import CourseCard from '@/components/courses/CourseCard';
import { Lecture } from '@/types';
import LectureStatus from '@/components/lectures/LectureStatus';

const Dashboard = () => {
  const { courses, lectures, isAdmin, getLectureStatus } = useApi();
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const [liveLectures, setLiveLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    // Filter live and upcoming lectures
    const now = new Date();
    
    const upcoming = lectures
      .filter(lecture => {
        const status = getLectureStatus(lecture);
        return status === 'upcoming';
      })
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 5);

    const live = lectures
      .filter(lecture => {
        const status = getLectureStatus(lecture);
        return status === 'live';
      });

    setUpcomingLectures(upcoming);
    setLiveLectures(live);
  }, [lectures, getLectureStatus]);

  // Find the course name for a lecture
  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  // Find the week name for a lecture
  const getWeekName = (weekId: string) => {
    const course = courses.find(c => 
      c.weeks.some(w => w.id === weekId)
    );
    
    if (course) {
      const week = course.weeks.find(w => w.id === weekId);
      return week ? week.name : 'Unknown Week';
    }
    
    return 'Unknown Week';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout requireAuth>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {isAdmin && (
            <Button asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}
        </div>

        {liveLectures.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Live Now</h2>
            <div className="grid grid-cols-1 gap-4">
              {liveLectures.map(lecture => (
                <Card key={lecture.id} className="overflow-hidden border-2 border-destructive/20 bg-destructive/5 transition-all hover:shadow-md">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <LectureStatus lecture={lecture} />
                        <h3 className="font-medium">{lecture.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getCourseName(lecture.courseId)} · {getWeekName(lecture.weekId)}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/lectures/${lecture.id}`} className="flex items-center gap-2">
                        <Video className="h-4 w-4" /> 
                        Join Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Lectures</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/schedule" className="flex items-center gap-1">
                Full Schedule
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {upcomingLectures.length > 0 ? (
            <div className="space-y-3">
              {upcomingLectures.map(lecture => (
                <Card key={lecture.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{lecture.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getCourseName(lecture.courseId)} · {getWeekName(lecture.weekId)}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(lecture.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatTime(lecture.scheduledTime)}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/lectures/${lecture.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No upcoming lectures scheduled at this time.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Courses</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses" className="flex items-center gap-1">
                All Courses
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No courses available at this time.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
