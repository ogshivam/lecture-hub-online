
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Video, ArrowLeft } from 'lucide-react';
import LectureCard from '@/components/lectures/LectureCard';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { courses, isAdmin } = useApi();
  
  const course = courses.find(c => c.id === id);
  
  if (!course) {
    return (
      <MainLayout requireAuth>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <span>Courses</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
            {course.description && (
              <p className="mt-2 text-muted-foreground">{course.description}</p>
            )}
          </div>
          {isAdmin && (
            <Button asChild>
              <Link to={`/admin/courses/${course.id}`}>Edit Course</Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {course.weeks.length > 0 ? (
              <Accordion type="multiple" defaultValue={[course.weeks[0]?.id]}>
                {course.weeks.map(week => (
                  <AccordionItem key={week.id} value={week.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg font-medium">{week.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {week.lectures.length} {week.lectures.length === 1 ? 'lecture' : 'lectures'}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        {week.lectures.length > 0 ? (
                          week.lectures.map(lecture => (
                            <LectureCard key={lecture.id} lecture={lecture} weekName={week.name} />
                          ))
                        ) : (
                          <p className="text-muted-foreground py-2">No lectures in this week yet.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No content available for this course yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
