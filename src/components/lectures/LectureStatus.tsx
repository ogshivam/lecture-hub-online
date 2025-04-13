
import React, { useState, useEffect } from 'react';
import { Lecture, LectureStatus } from '@/types';
import { useApi } from '@/contexts/ApiContext';
import { Badge } from '@/components/ui/badge';

interface LectureStatusProps {
  lecture: Lecture;
}

const LectureStatus: React.FC<LectureStatusProps> = ({ lecture }) => {
  const { getLectureStatus } = useApi();
  const [status, setStatus] = useState<LectureStatus>(getLectureStatus(lecture));

  useEffect(() => {
    // Update status every minute
    const interval = setInterval(() => {
      setStatus(getLectureStatus(lecture));
    }, 60000);

    return () => clearInterval(interval);
  }, [lecture, getLectureStatus]);

  return (
    <Badge
      variant={status === 'live' ? 'destructive' : status === 'upcoming' ? 'outline' : 'secondary'}
      className={status === 'live' ? 'animate-pulse-slow' : ''}
    >
      {status === 'live' ? 'LIVE NOW' : status === 'upcoming' ? 'Upcoming' : 'Completed'}
    </Badge>
  );
};

export default LectureStatus;
