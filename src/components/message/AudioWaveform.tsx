import React, { useState, useEffect, useRef } from 'react';

interface AudioWaveformProps {
  variant?: 'compact' | 'full';
  className?: string;
  isPlaying?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  variant = 'full',
  className = '',
  isPlaying = false
}) => {
  const length = variant === 'compact' ? 20 : 40;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const generateStaticWaveform = () => {
    return Array.from({ length }, (_, i) => {
      const intensity = Math.sin(i * 0.3) * 0.5 + 0.5;
      const randomVariation = Math.random() * 0.4 + 0.3;
      return Math.max(intensity * randomVariation * 100, 10);
    });
  };

  const generateDynamicWaveform = () => {
    return Array.from({ length }, () => {
      return Math.random() * 80 + 20; // Random height between 20-100
    });
  };

  const [waveformBars, setWaveformBars] = useState(() => generateStaticWaveform());

  useEffect(() => {
    if (isPlaying) {
      // Start dynamic animation
      intervalRef.current = setInterval(() => {
        setWaveformBars(generateDynamicWaveform());
      }, 150);
    } else {
      // Stop animation and reset to static bars
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setWaveformBars(generateStaticWaveform());
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, length]);

  const heightMultiplier = variant === 'compact' ? 0.2 : 0.25;
  const minHeight = variant === 'compact' ? 3 : 4;

  return (
    <div className={`flex items-center gap-0.5 flex-1 ${variant === 'compact' ? 'h-6' : 'h-8'} ${className}`}>
      {waveformBars.map((height, index) => (
        <div
          key={index}
          className="bg-muted-foreground rounded-full transition-all duration-150"
          style={{
            height: `${Math.max(height * heightMultiplier, minHeight)}px`,
            width: '2px'
          }}
        />
      ))}
    </div>
  );
};