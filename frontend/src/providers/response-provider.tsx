"use client";

import { ClusteringResponseObject } from '@/lib/constants';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ResponseContextType {
  response: ClusteringResponseObject | null;
  setResponse: (response: ClusteringResponseObject | null) => void;
}

const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

export const useResponse = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponse must be used within a ResponseProvider');
  }
  return context;
};

export const ResponseProvider = ({ children }: { children: ReactNode }) => {
  const [response, setResponse] = useState<ClusteringResponseObject | null>(null);
  
  return (
    <ResponseContext.Provider value={{ response, setResponse }}>
      {children}
    </ResponseContext.Provider>
  );
};
