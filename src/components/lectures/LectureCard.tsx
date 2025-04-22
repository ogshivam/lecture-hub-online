
import React from 'react';
import { Link } from 'react-router-dom';
import { Lecture } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video } from 'lucide-react';
import LectureStatus from './LectureStatus';
import CountdownTimer from './CountdownTimer';

interface LectureCardProps {
  lecture: Lecture;
  weekName: string;
}

const LectureCard: React.FC<LectureCardProps> = ({ lecture, weekName }) => {
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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{lecture.title}</CardTitle>
          <LectureStatus lecture={lecture} />
        </div>
        <CardDescription>{weekName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(lecture.scheduledTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(lecture.scheduledTime)}</span>
        </div>
        <CountdownTimer lecture={lecture} />
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="secondary" className="w-full">
          <Link to={`/lectures/${lecture.id}`} className="flex items-center justify-center gap-2">
            <Video className="h-4 w-4" />
            View Lecture
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LectureCard;
