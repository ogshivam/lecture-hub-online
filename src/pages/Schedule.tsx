
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lecture } from '@/types';
import LectureStatus from '@/components/lectures/LectureStatus';

const Schedule = () => {
  const { lectures, courses, weeks, getLectureStatus } = useApi();
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const [liveLectures, setLiveLectures] = useState<Lecture[]>([]);
  const [completedLectures, setCompletedLectures] = useState<Lecture[]>([]);
  
  useEffect(() => {
    // Filter lectures by status
    const upcoming = lectures
      .filter(lecture => getLectureStatus(lecture) === 'upcoming')
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    
    const live = lectures
      .filter(lecture => getLectureStatus(lecture) === 'live')
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    
    const completed = lectures
      .filter(lecture => getLectureStatus(lecture) === 'completed')
      .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()); // Most recent first
    
    setUpcomingLectures(upcoming);
    setLiveLectures(live);
    setCompletedLectures(completed);
  }, [lectures, getLectureStatus]);

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  // Get week name by ID
  const getWeekName = (weekId: string) => {
    const week = weeks.find(w => w.id === weekId);
    return week ? week.name : 'Unknown Week';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lecture Schedule</h1>
            <p className="text-muted-foreground mt-2">
              View all upcoming, live, and completed lectures
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingLectures.length})
            </TabsTrigger>
            <TabsTrigger value="live">
              Live Now ({liveLectures.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedLectures.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {upcomingLectures.length > 0 ? (
              <div className="space-y-4">
                {upcomingLectures.map(lecture => (
                  <Card key={lecture.id} className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium">{lecture.title}</h3>
                            <LectureStatus lecture={lecture} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCourseName(lecture.courseId)} · {getWeekName(lecture.weekId)}
                          </p>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/lectures/${lecture.id}`} className="whitespace-nowrap">
                            View Details
                          </Link>
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(lecture.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(lecture.scheduledTime)}</span>
                        </div>
                      </div>
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
          </TabsContent>
          
          <TabsContent value="live" className="mt-6">
            {liveLectures.length > 0 ? (
              <div className="space-y-4">
                {liveLectures.map(lecture => (
                  <Card key={lecture.id} className="overflow-hidden border-2 border-destructive/20 bg-destructive/5">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium">{lecture.title}</h3>
                            <LectureStatus lecture={lecture} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCourseName(lecture.courseId)} · {getWeekName(lecture.weekId)}
                          </p>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/lectures/${lecture.id}`} className="whitespace-nowrap">
                            Join Now
                          </Link>
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(lecture.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(lecture.scheduledTime)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No lectures are currently live. Check back later!
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedLectures.length > 0 ? (
              <div className="space-y-4">
                {completedLectures.map(lecture => (
                  <Card key={lecture.id} className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium">{lecture.title}</h3>
                            <LectureStatus lecture={lecture} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCourseName(lecture.courseId)} · {getWeekName(lecture.weekId)}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/lectures/${lecture.id}`} className="whitespace-nowrap">
                            Watch Recording
                          </Link>
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(lecture.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(lecture.scheduledTime)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No completed lectures yet.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Schedule;
