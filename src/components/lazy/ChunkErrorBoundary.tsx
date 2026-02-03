/**
 * Chunk Error Boundary
 * 
 * Error boundary specifically designed to handle chunk loading failures
 * that occur during code-splitting with React.lazy.
 * 
 * Provides automatic retry and user-friendly error messages.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Optional fallback component to show on error
   */
  fallback?: ReactNode;
  /**
   * Called when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if this is a chunk loading error
    const isChunkError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('ChunkLoadError') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      return {
        hasError: true,
        error,
      };
    }

    // For non-chunk errors, let them bubble up to parent error boundary
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chunk loading error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < MAX_RETRIES) {
      // Increment retry count and reset error
      this.setState({
        hasError: false,
        error: null,
        retryCount: retryCount + 1,
      });
      
      // Force a page reload to fetch the updated chunks
      window.location.reload();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Failed to Load Content
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're having trouble loading this part of the application. 
              This might be due to a network issue or an outdated cache.
            </p>

            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                Retry attempt: {retryCount} of {MAX_RETRIES}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {retryCount < MAX_RETRIES && (
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Retry Loading
                </button>
              )}
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go to Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}
