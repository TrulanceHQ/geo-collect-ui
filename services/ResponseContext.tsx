'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Response {
  questionId: string;
  answer: string | string[];
}

interface SurveyResponse {
  mediaUrl: string;
  location: string;
  _id: string;
  surveyId?: { _id: string; title: string } | null;
  enumeratorId: string;
  responses: Response[];
  submittedAt: string;
}

interface ResponseContextType {
  responses: SurveyResponse[];
  setResponses: (data: SurveyResponse[]) => void;
}

const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

export const ResponseProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  return (
    <ResponseContext.Provider value={{ responses, setResponses }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponseContext = () => {
  const context = useContext(ResponseContext);
  if (!context) throw new Error('useResponseContext must be used within a ResponseProvider');
  return context;
};
