import React from 'react';
import { Paperclip } from 'lucide-react';
import { isImage, isVideo } from '@/utils/messageFormatters';

interface FileMessageProps {
  content: string; // Now contains base64 data
  fileName?: string;
  fileType?: string;
  isUser: boolean;
}

export const FileMessage: React.FC<FileMessageProps> = ({
  content,
  fileName,
  fileType,
  isUser
}) => {
  if (fileType && (isImage(fileType) || isVideo(fileType))) {
    return (
      <div className="rounded-2xl overflow-hidden max-w-[240px]">
        {isImage(fileType) ? (
          <img
            src={content} // content is now base64 data URL
            alt={fileName || 'Image'}
            className="w-full h-auto cursor-pointer"
            onClick={() => window.open(content, '_blank')}
          />
        ) : (
          <video
            src={content} // content is now base64 data URL
            controls
            className="w-full h-auto"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-3 bg-muted border rounded-xl p-3 max-w-[280px] ${
        isUser ? 'ml-auto' : ''
      }`}>
        <Paperclip className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {fileName}
          </p>
        </div>
      </div>
    </div>
  );
};