import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppError } from '../lib/errors/types';
import { errorHandler } from '../lib/errors/errorHandler';

interface ErrorContextType {
  globalError: AppError | null;
  setGlobalError: (error: AppError | null) => void;
  handleError: (error: Error | AppError, showToast?: boolean) => Promise<void>;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [globalError, setGlobalError] = useState<AppError | null>(null);

  const handleError = useCallback(async (error: Error | AppError, showToast: boolean = true) => {
    await errorHandler.handle(error, showToast);
    
    // Set global error for components that need it
    if ('category' in error && 'userMessage' in error) {
      setGlobalError(error as AppError);
    }
  }, []);

  const clearError = useCallback(() => {
    setGlobalError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ globalError, setGlobalError, handleError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}
