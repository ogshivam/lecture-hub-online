
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import AddWeekForm from '@/components/admin/AddWeekForm';
import AddLectureForm from '@/components/admin/AddLectureForm';

const CourseManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, updateCourse, deleteCourse } = useApi();
  
  const course = courses.find(c => c.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [courseName, setCourseName] = useState(course?.name || '');
  const [courseDescription, setCourseDescription] = useState(course?.description || '');
  
  if (!course) {
    return (
      <MainLayout requireAuth adminOnly>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/admin">Back to Admin Panel</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSaveCourse = () => {
    if (courseName.trim() === '') {
      toast.error('Course name cannot be empty');
      return;
    }
    
    updateCourse({
      ...course,
      name: courseName,
      description: courseDescription
    });
    
    setIsEditing(false);
    toast.success('Course updated successfully');
  };

  const handleDeleteCourse = () => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
      deleteCourse(course.id);
      navigate('/admin');
      toast.success('Course deleted successfully');
    }
  };

  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <span>Admin Panel</span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {isEditing ? (
                <div className="w-full">
                  <Input
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="text-xl font-bold mb-2"
                    placeholder="Course Name"
                  />
                  <Textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full"
                    placeholder="Course Description (optional)"
                  />
                </div>
              ) : (
                <div>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  {course.description && (
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveCourse} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button onClick={handleDeleteCourse} variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Weeks</CardTitle>
                <CardDescription>Manage weeks and lectures for this course</CardDescription>
              </CardHeader>
              <CardContent>
                {course.weeks.length > 0 ? (
                  <Accordion type="multiple" className="w-full">
                    {course.weeks.map(week => (
                      <AccordionItem key={week.id} value={week.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{week.name}</span>
                            <span className="text-muted-foreground text-sm">
                              {week.lectures.length} {week.lectures.length === 1 ? 'lecture' : 'lectures'}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {week.lectures.length > 0 ? (
                              <div className="space-y-2">
                                {week.lectures.map(lecture => (
                                  <Card key={lecture.id}>
                                    <CardContent className="p-4">
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                          <h3 className="font-medium">{lecture.title}</h3>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(lecture.scheduledTime).toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            asChild
                                            variant="outline" 
                                            size="sm"
                                          >
                                            <Link to={`/admin/lectures/${lecture.id}`}>
                                              <Edit className="h-3.5 w-3.5 mr-1" />
                                              Edit
                                            </Link>
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground py-2">No lectures in this week yet.</p>
                            )}
                            <AddLectureForm courseId={course.id} weekId={week.id} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No weeks added to this course yet.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to={`/courses/${course.id}`} className="flex items-center gap-2">
                    <span>View Course Page</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <AddWeekForm courseId={course.id} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseManagement;
