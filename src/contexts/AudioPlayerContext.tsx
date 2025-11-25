import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AudioPlayerContextType {
  currentPlayingId: string | null;
  playAudio: (audioId: string, audioUrl: string) => Promise<void>;
  stopAudio: () => void;
  isPlaying: (audioId: string) => boolean;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async (audioId: string, audioUrl: string) => {
    try {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // If clicking the same audio that's currently playing, just stop it
      if (currentPlayingId === audioId) {
        setCurrentPlayingId(null);
        return;
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setCurrentPlayingId(null);
      };

      audio.onerror = () => {
        console.error('Error loading audio:', audioUrl);
        setCurrentPlayingId(null);
      };

      setCurrentPlayingId(audioId);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentPlayingId(null);
    }
  }, [currentPlayingId]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentPlayingId(null);
  }, []);

  const isPlaying = useCallback((audioId: string) => {
    return currentPlayingId === audioId;
  }, [currentPlayingId]);

  return (
    <AudioPlayerContext.Provider value={{
      currentPlayingId,
      playAudio,
      stopAudio,
      isPlaying
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};