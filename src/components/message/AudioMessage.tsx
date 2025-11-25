import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { formatDuration } from '@/utils/messageFormatters';

interface AudioMessageProps {
  content: string;
  duration?: number;
  isUser: boolean;
  isPlaying: boolean;
  currentAudioId?: string;
  onPlayAudio?: (audioUrl: string) => void;
  transcribedText?: string;
}

export const AudioMessage: React.FC<AudioMessageProps> = ({
  content,
  duration,
  isUser,
  isPlaying,
  currentAudioId,
  onPlayAudio,
  transcribedText
}) => {
  console.log('AudioMessage rendered:', { isUser, duration, content });
  
  return (
    <div className={`flex items-center gap-3 rounded-2xl p-3 max-w-[280px] bg-white border border-gray-200 ${
      isUser ? 'ml-auto' : ''
    }`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-slate-600 flex-shrink-0"
        onClick={() => onPlayAudio?.(content)}
      >
        {isPlaying && currentAudioId === content ? (
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-slate-600 rounded-full"></div>
            <div className="w-1 h-3 bg-slate-600 rounded-full"></div>
          </div>
        ) : (
          <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
        )}
      </Button>
      
      <AudioWaveform variant="full" />
      
      <span className="text-sm font-medium text-slate-600 flex-shrink-0 min-w-[2.5rem]">
        {duration ? formatDuration(duration) : '--:--'}
      </span>
    </div>
  );
};