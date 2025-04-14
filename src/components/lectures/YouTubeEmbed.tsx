
import React, { useEffect, useRef, useState } from 'react';
import { Lecture } from '@/types';
import { useApi } from '@/contexts/ApiContext';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeEmbedProps {
  lecture: Lecture;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ lecture }) => {
  const { getLectureStatus } = useApi();
  const status = getLectureStatus(lecture);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<{
    playing: boolean;
    muted: boolean;
    loading: boolean;
    fullscreen: boolean;
  }>({
    playing: false,
    muted: false,
    loading: true,
    fullscreen: false
  });

  // Disable right click globally for the document
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Add the event listener to the document
    document.addEventListener('contextmenu', disableContextMenu);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return;
      
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: lecture.youtubeId,
        playerVars: {
          enablejsapi: 1,
          controls: 0,         // Hide YouTube controls
          fs: 0,               // Disable fullscreen
          modestbranding: 1,   // Minimal branding
          rel: 0,              // No related videos
          disablekb: 1,        // Disable keyboard shortcuts
          iv_load_policy: 3,   // Hide annotations
          origin: window.location.origin,
          autoplay: status === 'live' ? 1 : 0
        },
        events: {
          onReady: (event: any) => {
            setPlayerState(prev => ({ ...prev, loading: false }));
            if (status === 'live') {
              setPlayerState(prev => ({ ...prev, playing: true }));
            }
          },
          onStateChange: (event: any) => {
            // Update play state based on player state
            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlayerState(prev => ({ ...prev, playing: true }));
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setPlayerState(prev => ({ ...prev, playing: false }));
            }
          }
        }
      });
    };

    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setPlayerState(prev => ({ ...prev, fullscreen: isFullscreen }));
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      // Clean up event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [lecture.youtubeId, status]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (playerState.playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (playerState.muted) {
      playerRef.current.unMute();
      setPlayerState(prev => ({ ...prev, muted: false }));
    } else {
      playerRef.current.mute();
      setPlayerState(prev => ({ ...prev, muted: true }));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!playerState.fullscreen) {
      // Enter fullscreen with cross-browser support
      const container = containerRef.current;
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      }
    } else {
      // Exit fullscreen with cross-browser support
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="youtube-container secure-player rounded-lg overflow-hidden border shadow-sm"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* YouTube iframe - controlled by the API */}
      <div id="youtube-player"></div>
      
      {/* Custom player controls */}
      <div className="player-controls">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={togglePlay} 
          disabled={playerState.loading} 
          className="text-white hover:text-white hover:bg-black/20"
        >
          {playerState.playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMute}
          disabled={playerState.loading}
          className="text-white hover:text-white hover:bg-black/20"
        >
          {playerState.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleFullscreen}
          disabled={playerState.loading}
          className="text-white hover:text-white hover:bg-black/20"
        >
          {playerState.fullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </Button>
        
        {status === 'live' && (
          <div className="ml-auto flex items-center">
            <span className="live-indicator">LIVE</span>
          </div>
        )}
      </div>
      
      {/* Protection overlay to prevent interactions with YouTube elements */}
      <div 
        className="protection-overlay" 
        aria-hidden="true"
        title="This area is disabled for security"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default YouTubeEmbed;
