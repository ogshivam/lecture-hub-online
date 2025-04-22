
import React, { useState, useEffect } from 'react';
import { Lecture } from '@/types';
import { useApi } from '@/contexts/ApiContext';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  lecture: Lecture;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ lecture }) => {
  const { getLectureStatus } = useApi();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [status, setStatus] = useState(getLectureStatus(lecture));

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const scheduledTime = new Date(lecture.scheduledTime);
      setStatus(getLectureStatus(lecture));
      
      if (now >= scheduledTime) {
        setTimeLeft('');
        return;
      }
      
      const diffMs = scheduledTime.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${diffDays > 0 ? `${diffDays}d ` : ''}${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`
      );
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [lecture, getLectureStatus]);

  if (status !== 'upcoming' || !timeLeft) {
    return null;
  }

  return (
    <div className="flex items-center text-sm font-medium text-muted-foreground">
      <Clock className="mr-1 h-4 w-4" />
      <span>Starts in: {timeLeft}</span>
    </div>
  );
};

export default CountdownTimer;
