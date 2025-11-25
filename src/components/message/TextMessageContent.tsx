import React from 'react';
import { formatMessageContent } from '@/utils/messageFormatters';

interface TextMessageContentProps {
  content: string;
  status?: string;
}

export const TextMessageContent: React.FC<TextMessageContentProps> = ({ 
  content, 
  status 
}) => {
  const parseMarkdown = (text: string) => {
    const formattedText = formatMessageContent(text);
    const lines = formattedText.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Handle bullet points
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        const parsedContent = parseBoldText(content);
        return (
          <div key={lineIndex} className="flex items-start gap-2 mb-2">
            <span className="text-current mt-0.5">•</span>
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      }
      
      // Handle regular lines with bold formatting
      const parsedContent = parseBoldText(line);
      return line.trim() ? (
        <div key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
          {parsedContent}
        </div>
      ) : (
        <div key={lineIndex} className="h-2" />
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold">{boldText}</strong>;
      }
      return part;
    });
  };

  if (status === 'generating-speech') {
    return (
      <div className="flex items-center gap-2">
        <div className="whitespace-pre-wrap">{parseMarkdown(content)}</div>
        <span className="text-xs italic opacity-70">Gerando áudio...</span>
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap">{parseMarkdown(content)}</div>
  );
};