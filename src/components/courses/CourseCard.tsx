
import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const lectureCount = course.weeks.reduce(
    (count, week) => count + week.lectures.length,
    0
  );

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{course.name}</CardTitle>
        <CardDescription>
          {course.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{course.weeks.length} weeks · {lectureCount} lectures</span>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button asChild>
          <Link to={`/courses/${course.id}`} className="w-full flex items-center justify-center gap-2">
            View Course <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
