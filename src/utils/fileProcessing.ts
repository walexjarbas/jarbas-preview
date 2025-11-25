export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export const isImage = (fileType: string): boolean => {
  return fileType.startsWith('image/');
};

export const isDocument = (fileType: string): boolean => {
  return fileType === 'application/pdf' || 
         fileType.includes('document') || 
         fileType.includes('text') ||
         fileType.includes('spreadsheet') ||
         fileType.includes('presentation');
};

export const getSupportedFileTypes = (): string[] => {
  return [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
};