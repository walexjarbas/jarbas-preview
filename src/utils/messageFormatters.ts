export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimestamp = (timestamp: Date) => {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp);
    return '--:--';
  }
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.floor(bytes / Math.pow(k, i)) + ' ' + sizes[i];
};

export const formatMessageContent = (content: string) => {
  // Decode Unicode escape sequences
  const decodedContent = content.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
  
  // Replace \n with actual line breaks
  return decodedContent.replace(/\\n/g, '\n');
};

export const isImage = (fileType: string) => {
  return fileType.startsWith('image/');
};

export const isVideo = (fileType: string) => {
  return fileType.startsWith('video/');
};

export const generateWaveform = () => {
  return Array.from({ length: 40 }, (_, i) => {
    const intensity = Math.sin(i * 0.3) * 0.5 + 0.5;
    const randomVariation = Math.random() * 0.4 + 0.3;
    return Math.max(intensity * randomVariation * 100, 10);
  });
};