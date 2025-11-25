import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { formatDuration } from '@/utils/messageFormatters';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

interface AudioBubbleProps {
  audioId: string;
  content: string;
  duration?: number;
  isUser: boolean;
  transcribedText?: string;
}

export const AudioBubble: React.FC<AudioBubbleProps> = ({
  audioId,
  content,
  duration,
  isUser,
  transcribedText
}) => {
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const { currentPlayingId, playAudio, isPlaying } = useAudioPlayerContext();

  useEffect(() => {
    const playing = isPlaying(audioId);
    setIsLocalPlaying(playing);
  }, [currentPlayingId, audioId, isPlaying]);

  const handlePlayClick = () => {
    playAudio(audioId, content);
  };

  return (
    <div className={`flex items-center gap-3 rounded-2xl p-3 max-w-[280px] bg-card border border-border ${
      isUser ? 'ml-auto' : ''
    }`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-muted border border-border hover:bg-accent text-foreground flex-shrink-0"
        onClick={handlePlayClick}
      >
        {isLocalPlaying ? (
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-primary rounded-full"></div>
            <div className="w-1 h-3 bg-primary rounded-full"></div>
          </div>
        ) : (
          <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
        )}
      </Button>
      
      <AudioWaveform variant="full" isPlaying={isLocalPlaying} />
      
      <span className="text-sm font-medium text-muted-foreground flex-shrink-0 min-w-[2.5rem]">
        {duration ? formatDuration(duration) : '--:--'}
      </span>
    </div>
  );
};