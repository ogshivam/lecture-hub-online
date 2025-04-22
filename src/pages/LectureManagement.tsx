
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useApi } from '@/contexts/ApiContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Clock, Youtube, Trash2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';

const LectureManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lectures, courses, updateLecture, deleteLecture } = useApi();
  
  const lecture = lectures.find(l => l.id === id);
  const [course, setCourse] = useState(lecture ? courses.find(c => c.id === lecture.courseId) : null);
  const [week, setWeek] = useState(course ? course.weeks.find(w => w.id === lecture.weekId) : null);
  
  const [title, setTitle] = useState(lecture?.title || '');
  const [description, setDescription] = useState(lecture?.description || '');
  const [youtubeId, setYoutubeId] = useState(lecture?.youtubeId || '');
  const [scheduledTime, setScheduledTime] = useState('');
  
  useEffect(() => {
    if (lecture) {
      // Format date for datetime-local input
      const date = new Date(lecture.scheduledTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      setScheduledTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [lecture]);
  
  if (!lecture || !course || !week) {
    return (
      <MainLayout requireAuth adminOnly>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Lecture Not Found</h1>
          <p className="text-muted-foreground mb-6">The lecture you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/admin">Back to Admin Panel</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSaveLecture = () => {
    if (title.trim() === '') {
      toast.error('Lecture title cannot be empty');
      return;
    }
    
    if (youtubeId.trim() === '') {
      toast.error('YouTube ID cannot be empty');
      return;
    }
    
    if (!scheduledTime) {
      toast.error('Scheduled time cannot be empty');
      return;
    }
    
    // Extract YouTube ID from the full share link
    const extractedYouTubeId = youtubeId.split('/').pop()?.split('?')[0] || youtubeId;
    
    updateLecture({
      ...lecture,
      title,
      description,
      youtubeId: extractedYouTubeId, // Use extracted ID
      scheduledTime: new Date(scheduledTime).toISOString()
    });
    
    toast.success('Lecture updated successfully');
    navigate(`/admin/courses/${course.id}`);
  };

  const handleDeleteLecture = () => {
    if (window.confirm(`Are you sure you want to delete "${lecture.title}"? This action cannot be undone.`)) {
      deleteLecture(lecture.id);
      navigate(`/admin/courses/${course.id}`);
      toast.success('Lecture deleted successfully');
    }
  };

  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to={`/admin/courses/${course.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <span>{course.name} / {week.name}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Lecture</CardTitle>
            <CardDescription>Update lecture details or delete it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lecture Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lecture title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter lecture description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtubeId" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                YouTube Video ID
              </Label>
              <Input
                id="youtubeId"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="e.g., dQw4w9WgXcQ"
              />
              <p className="text-xs text-muted-foreground">
                The part after 'watch?v=' in a YouTube URL
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledTime" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled Date & Time
              </Label>
              <Input
                id="scheduledTime"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={handleDeleteLecture} 
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Lecture
            </Button>
            <Button 
              onClick={handleSaveLecture}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LectureManagement;
