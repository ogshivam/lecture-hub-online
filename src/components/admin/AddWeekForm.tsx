
import React, { useState } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddWeekFormProps {
  courseId?: string;
}

const AddWeekForm: React.FC<AddWeekFormProps> = ({ courseId: propsCourseId }) => {
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(propsCourseId || '');
  const [isLoading, setIsLoading] = useState(false);
  const { addWeek, courses } = useApi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      addWeek({ name, courseId });
      setName('');
      if (!propsCourseId) setCourseId('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Week</CardTitle>
        <CardDescription>Add a new week to an existing course</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!propsCourseId && (
            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <Select
                value={courseId}
                onValueChange={setCourseId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Week Name</Label>
            <Input
              id="name"
              placeholder="e.g., Week 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !name || !courseId}>
            {isLoading ? 'Creating...' : 'Add Week'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddWeekForm;
