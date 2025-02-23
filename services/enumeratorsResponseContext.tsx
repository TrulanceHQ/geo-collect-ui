import { createContext, useContext, useState, ReactNode } from "react";

interface Response {
  surveyId: string;
  enumeratorId: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  submittedAt: string;
}

interface ResponsesContextProps {
  responses: Response[];
  setResponses: (responses: Response[]) => void;
}

const ResponsesContext = createContext<ResponsesContextProps | undefined>(undefined);

export const useResponses = () => {
  const context = useContext(ResponsesContext);
  if (!context) {
    throw new Error("useResponses must be used within a ResponsesProvider");
  }
  return context;
};

export const ResponsesProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<Response[]>([]);

  return (
    <ResponsesContext.Provider value={{ responses, setResponses }}>
      {children}
    </ResponsesContext.Provider>
  );
};