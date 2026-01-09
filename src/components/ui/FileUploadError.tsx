import React from 'react';
import { AlertCircle, ExternalLink, XCircle } from 'lucide-react';

interface FileUploadErrorProps {
  fileName: string;
  errorType: 'unsupported' | 'size' | 'network' | 'generic';
  maxSize?: number;
  supportedFormats?: string[];
  onDismiss?: () => void;
}

export function FileUploadError({ 
  fileName, 
  errorType, 
  maxSize = 10,
  supportedFormats = ['PDF', 'JPG', 'PNG', 'DOCX'],
  onDismiss 
}: FileUploadErrorProps) {
  const getErrorContent = () => {
    switch (errorType) {
      case 'unsupported':
        return {
          title: 'Unsupported file format',
          message: `"${fileName}" is not a supported file type. Please upload one of the following formats: ${supportedFormats.join(', ')}.`,
          helpLink: 'https://help.wasilah.com/file-formats',
          helpText: 'Learn about supported file formats'
        };
      case 'size':
        return {
          title: 'File too large',
          message: `"${fileName}" exceeds the maximum file size of ${maxSize}MB. Please compress the file or upload a smaller version.`,
          helpLink: 'https://help.wasilah.com/file-compression',
          helpText: 'How to compress large files'
        };
      case 'network':
        return {
          title: 'Upload failed',
          message: `Could not upload "${fileName}" due to a network error. Please check your internet connection and try again.`,
          helpLink: 'https://help.wasilah.com/troubleshooting',
          helpText: 'Troubleshooting upload issues'
        };
      default:
        return {
          title: 'Upload failed',
          message: `An error occurred while uploading "${fileName}". Please try again.`,
          helpLink: 'https://help.wasilah.com/uploads',
          helpText: 'Get help with uploads'
        };
    }
  };

  const content = getErrorContent();

  return (
    <div 
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg"
    >
      {/* Icon */}
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-red-900 mb-1">{content.title}</h4>
        <p className="text-xs text-red-800 mb-3">{content.message}</p>
        
        {/* Help Link */}
        <a
          href={content.helpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 underline transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {content.helpText}
        </a>
      </div>
      
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 text-red-600 hover:text-red-800 transition-colors"
          aria-label="Dismiss error"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Hook to manage file upload errors
export function useFileUploadErrors() {
  const [errors, setErrors] = React.useState<Array<FileUploadErrorProps & { id: string }>>([]);

  const addError = (error: Omit<FileUploadErrorProps, 'onDismiss'>) => {
    const id = Date.now().toString();
    setErrors(prev => [...prev, { ...error, id, onDismiss: () => removeError(id) }]);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return { errors, addError, removeError, clearErrors };
}
