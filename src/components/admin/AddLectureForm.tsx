
import React, { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddLectureFormProps {
  courseId?: string;
  weekId?: string;
}

const AddLectureForm: React.FC<AddLectureFormProps> = ({ courseId: propsCourseId, weekId: propsWeekId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [courseId, setCourseId] = useState(propsCourseId || '');
  const [weekId, setWeekId] = useState(propsWeekId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [availableWeeks, setAvailableWeeks] = useState<{ id: string; name: string }[]>([]);
  
  const { addLecture, courses, weeks } = useApi();

  // Update available weeks when course changes
  useEffect(() => {
    if (courseId) {
      const filteredWeeks = weeks.filter(week => week.courseId === courseId);
      setAvailableWeeks(filteredWeeks.map(w => ({ id: w.id, name: w.name })));
      
      // Reset week if not in the available weeks for this course
      if (weekId && !filteredWeeks.some(w => w.id === weekId)) {
        setWeekId('');
      }
    } else {
      setAvailableWeeks([]);
      setWeekId('');
    }
  }, [courseId, weeks, weekId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      addLecture({
        title,
        description,
        youtubeId,
        scheduledTime: new Date(scheduledTime).toISOString(),
        courseId,
        weekId,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setYoutubeId('');
      setScheduledTime('');
      if (!propsCourseId) setCourseId('');
      if (!propsWeekId) setWeekId('');
    } finally {
      setIsLoading(false);
    }
  };

  // Format datetime-local string
  const formatDateTimeForInput = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Lecture</CardTitle>
        <CardDescription>Schedule a new lecture with YouTube integration</CardDescription>
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
          
          {!propsWeekId && (
            <div className="space-y-2">
              <Label htmlFor="weekId">Week</Label>
              <Select
                value={weekId}
                onValueChange={setWeekId}
                disabled={!courseId || availableWeeks.length === 0}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={availableWeeks.length === 0 ? "No weeks available" : "Select a week"} />
                </SelectTrigger>
                <SelectContent>
                  {availableWeeks.map((week) => (
                    <SelectItem key={week.id} value={week.id}>
                      {week.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Lecture Title</Label>
            <Input
              id="title"
              placeholder="e.g., Introduction to Quantum Physics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe the lecture content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtubeId">YouTube Video ID</Label>
            <Input
              id="youtubeId"
              placeholder="e.g., dQw4w9WgXcQ"
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              The part after 'watch?v=' in a YouTube URL
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Scheduled Date & Time</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime || formatDateTimeForInput()}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={
              isLoading || 
              !title || 
              !youtubeId || 
              !scheduledTime || 
              !courseId || 
              !weekId
            }
          >
            {isLoading ? 'Creating...' : 'Schedule Lecture'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddLectureForm;
