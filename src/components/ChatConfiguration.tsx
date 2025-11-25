import React from 'react';
import { JarbasState } from '@/hooks/useJarbasState';
interface ChatConfigurationProps {
  jarbasState: JarbasState | null;
}
export const ChatConfiguration: React.FC<ChatConfigurationProps> = ({
  jarbasState
}) => {
  if (!jarbasState) return null;
  return;
};