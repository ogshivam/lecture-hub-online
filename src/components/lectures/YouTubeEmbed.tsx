
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
      {/* YouTube iframe */}
      <iframe
        src={`https://www.youtube.com/embed/${lecture.youtubeId}${status === 'live' ? '?autoplay=1' : ''}`}
        title={lecture.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      {/* Overlay to block "Watch on YouTube" button */}
      <div 
        className="absolute bottom-0 right-0 h-[40px] w-[120px] bg-transparent z-10"
        style={{ cursor: 'not-allowed' }}
        aria-hidden="true"
        title="This button is disabled"
      />
    </div>
  );
};

export default YouTubeEmbed;
