export const calculateAudioDuration = (audioSource: Blob | string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
      if (typeof audioSource === 'string') {
        // Don't revoke object URLs we didn't create
      }
    };

    const onLoaded = () => {
      cleanup();
      resolve(audio.duration);
    };

    const onError = () => {
      cleanup();
      reject(new Error('Failed to load audio'));
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);

    if (audioSource instanceof Blob) {
      const url = URL.createObjectURL(audioSource);
      audio.src = url;
      // Clean up object URL after use
      audio.addEventListener('loadedmetadata', () => URL.revokeObjectURL(url));
    } else {
      audio.src = audioSource;
    }

    audio.preload = 'metadata';
  });
};