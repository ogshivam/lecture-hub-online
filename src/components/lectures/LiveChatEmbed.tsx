
import React from 'react';
import { Lecture } from '@/types';
import { useApi } from '@/contexts/ApiContext';

interface LiveChatEmbedProps {
  lecture: Lecture;
}

const LiveChatEmbed: React.FC<LiveChatEmbedProps> = ({ lecture }) => {
  const { getLectureStatus } = useApi();
  const status = getLectureStatus(lecture);
  
  if (status !== 'live') {
    return null;
  }
  
  return (
    <div className="h-[500px] border rounded-lg overflow-hidden shadow-sm">
      <iframe
        src={`https://www.youtube.com/live_chat?v=${lecture.youtubeId}&embed_domain=${window.location.hostname}`}
        width="100%"
        height="100%"
        title="Live Chat"
      ></iframe>
    </div>
  );
};

export default LiveChatEmbed;
