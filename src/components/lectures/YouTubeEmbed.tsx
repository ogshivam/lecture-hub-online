
import React from 'react';
import { Lecture } from '@/types';
import { useApi } from '@/contexts/ApiContext';

interface YouTubeEmbedProps {
  lecture: Lecture;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ lecture }) => {
  const { getLectureStatus } = useApi();
  const status = getLectureStatus(lecture);
  
  return (
    <div className="youtube-container rounded-lg overflow-hidden border shadow-sm">
      <iframe
        src={`https://www.youtube.com/embed/${lecture.youtubeId}${status === 'live' ? '?autoplay=1' : ''}`}
        title={lecture.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
