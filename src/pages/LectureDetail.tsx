
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import LectureStatus from '@/components/lectures/LectureStatus';
import CountdownTimer from '@/components/lectures/CountdownTimer';
import YouTubeEmbed from '@/components/lectures/YouTubeEmbed';
import LiveChatEmbed from '@/components/lectures/LiveChatEmbed';

const LectureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lectures, courses, getLectureStatus } = useApi();
  const [lecture, setLecture] = useState(lectures.find(l => l.id === id));
  const [course, setCourse] = useState(courses.find(c => c.id === lecture?.courseId));
  const [week, setWeek] = useState(course?.weeks.find(w => w.id === lecture?.weekId));
  const [status, setStatus] = useState(lecture ? getLectureStatus(lecture) : null);

  useEffect(() => {
    // Refresh lecture status every minute
    const interval = setInterval(() => {
      if (lecture) {
        setStatus(getLectureStatus(lecture));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lecture, getLectureStatus]);

  if (!lecture || !course || !week) {
    return (
      <MainLayout requireAuth>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Lecture Not Found</h1>
          <p className="text-muted-foreground mb-6">The lecture you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to={`/courses/${course.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <span>{course.name} / {week.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{lecture.title}</h1>
              <LectureStatus lecture={lecture} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(lecture.scheduledTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(lecture.scheduledTime)}</span>
              </div>
              <CountdownTimer lecture={lecture} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>Lecture Video</CardTitle>
                {status === 'upcoming' && (
                  <CardDescription>
                    This lecture hasn't started yet. The video will be available when the lecture goes live.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <YouTubeEmbed lecture={lecture} />
              </CardContent>
            </Card>
            
            {lecture.description && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle>About this Lecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{lecture.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>
                  {status === 'live' 
                    ? 'Chat with your instructor and other students' 
                    : status === 'upcoming'
                    ? 'Chat will be available when the lecture starts'
                    : 'This lecture has ended'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                {status === 'live' ? (
                  <LiveChatEmbed lecture={lecture} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4 border rounded-lg p-6">
                    {status === 'upcoming' ? (
                      <>
                        <Clock className="h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground">The live chat will be available when the lecture begins</p>
                        <CountdownTimer lecture={lecture} />
                      </>
                    ) : (
                      <>
                        <Calendar className="h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground">The live chat for this lecture has ended</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
              {status === 'upcoming' && (
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/dashboard">Back to Dashboard</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LectureDetail;
