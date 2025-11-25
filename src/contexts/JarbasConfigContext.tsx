
import React, { createContext, useContext, ReactNode } from 'react';
import { useJarbasAgentSetup } from '@/hooks/useJarbasAgentSetup';
import { JarbasConfigContextType } from '@/types/jarbas';

const JarbasConfigContext = createContext<JarbasConfigContextType | undefined>(undefined);

export const JarbasConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const jarbasSetup = useJarbasAgentSetup();

  return (
    <JarbasConfigContext.Provider value={jarbasSetup}>
      {children}
    </JarbasConfigContext.Provider>
  );
};

export const useJarbasConfig = () => {
  const context = useContext(JarbasConfigContext);
  if (context === undefined) {
    throw new Error('useJarbasConfig must be used within a JarbasConfigProvider');
  }
  return context;
};
