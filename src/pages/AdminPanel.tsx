import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Video, Plus, Edit, Trash2, Users } from 'lucide-react';
import AddCourseForm from '@/components/admin/AddCourseForm';
import AddWeekForm from '@/components/admin/AddWeekForm';
import AddLectureForm from '@/components/admin/AddLectureForm';
import ReferralManagerPanel from '@/components/admin/ReferralManagerPanel';
import LectureStatus from '@/components/lectures/LectureStatus';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { 
    courses, 
    weeks, 
    lectures, 
    deleteLecture,
    referralManagers,
    referralLinks,
    addReferralManager,
    addReferralLink
  } = useApi();
  const [activeTab, setActiveTab] = useState('courses');

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
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

  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage courses, weeks, and lectures from a single dashboard
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6 w-full md:w-auto">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="weeks" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Weeks</span>
            </TabsTrigger>
            <TabsTrigger value="lectures" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Lectures</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Referrals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>All Courses</CardTitle>
                    <CardDescription>Manage your existing courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {courses.length > 0 ? (
                      <div className="space-y-4">
                        {courses.map(course => (
                          <Card key={course.id} className="overflow-hidden">
                            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <h3 className="font-medium">{course.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {course.weeks.length} {course.weeks.length === 1 ? 'week' : 'weeks'} · 
                                  {" "}
                                  {course.weeks.reduce((acc, week) => acc + week.lectures.length, 0)} 
                                  {" "}
                                  {course.weeks.reduce((acc, week) => acc + week.lectures.length, 0) === 1 ? 'lecture' : 'lectures'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/courses/${course.id}`}>View</Link>
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                  <Link to={`/admin/courses/${course.id}`}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No courses yet. Create your first course!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <AddCourseForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weeks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>All Weeks</CardTitle>
                    <CardDescription>Manage weeks across all courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weeks.length > 0 ? (
                      <div className="space-y-4">
                        {weeks.map(week => (
                          <Card key={week.id} className="overflow-hidden">
                            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <h3 className="font-medium">{week.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {getCourseName(week.courseId)} · 
                                  {" "}
                                  {week.lectures.length} {week.lectures.length === 1 ? 'lecture' : 'lectures'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/courses/${week.courseId}`}>View Course</Link>
                                </Button>
                                <Button asChild variant="ghost" size="sm">
                                  <Link to={`/admin/courses/${week.courseId}`}>
                                    Manage
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No weeks yet. Add a week to a course!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <AddWeekForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lectures" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>All Lectures</CardTitle>
                      <CardDescription>Manage all lecture content</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lectures.length > 0 ? (
                      <div className="space-y-4">
                        {lectures.map(lecture => (
                          <Card key={lecture.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{lecture.title}</h3>
                                  <LectureStatus lecture={lecture} />
                                </div>
                                <div className="flex gap-2">
                                  <Button asChild variant="outline" size="sm">
                                    <Link to={`/lectures/${lecture.id}`}>View</Link>
                                  </Button>
                                  <Button 
                                    asChild
                                    variant="ghost" 
                                    size="sm"
                                    className="flex items-center gap-1"
                                  >
                                    <Link to={`/admin/lectures/${lecture.id}`}>
                                      <Edit className="h-3.5 w-3.5" />
                                      Edit
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{getCourseName(lecture.courseId)} · {getWeekName(lecture.weekId)}</p>
                                <p>
                                  {formatDate(lecture.scheduledTime)} at {formatTime(lecture.scheduledTime)}
                                </p>
                                <p className="truncate">YouTube ID: {lecture.youtubeId}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No lectures yet. Schedule your first lecture!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <AddLectureForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <ReferralManagerPanel
              referralManagers={referralManagers}
              referralLinks={referralLinks}
              lectures={lectures}
              onAddReferralManager={addReferralManager}
              onAddReferralLink={addReferralLink}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
