
import { useState, useRef, useCallback } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentAudioId: string | null;
  duration: number;
  currentTime: number;
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentAudioId: null,
    duration: 0,
    currentTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async (audioUrl: string, audioId: string) => {
    try {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // If clicking the same audio that's currently playing, just stop it
      if (state.currentAudioId === audioId && state.isPlaying) {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          currentAudioId: null,
        }));
        return;
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setState(prev => ({
          ...prev,
          duration: audio.duration,
        }));
      };

      audio.ontimeupdate = () => {
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
        }));
      };

      audio.onended = () => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          currentAudioId: null,
          currentTime: 0,
        }));
      };

      await audio.play();
      
      setState(prev => ({
        ...prev,
        isPlaying: true,
        currentAudioId: audioId,
      }));
    } catch (error) {
      console.error('Error playing audio:', error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentAudioId: null,
      }));
    }
  }, [state.currentAudioId, state.isPlaying]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentAudioId: null,
      currentTime: 0,
    }));
  }, []);

  return {
    ...state,
    playAudio,
    stopAudio,
  };
};
