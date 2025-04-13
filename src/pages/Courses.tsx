
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/courses/CourseCard';

const Courses = () => {
  const { courses, isAdmin } = useApi();

  return (
    <MainLayout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
          {isAdmin && (
            <Button asChild>
              <a href="/admin">Manage Courses</a>
            </Button>
          )}
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available yet.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Courses;
