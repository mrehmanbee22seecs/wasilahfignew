import React from 'react';

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  hint?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function ValidatedTextarea({
  label,
  error,
  touched,
  required,
  hint,
  showCharCount,
  maxLength,
  className = '',
  value,
  ...props
}: ValidatedTextareaProps) {
  const showError = touched && error;
  const charCount = typeof value === 'string' ? value.length : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {showCharCount && maxLength && (
          <span className={`text-xs ${charCount > maxLength ? 'text-red-600' : 'text-slate-500'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      <textarea
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          showError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
        } ${className}`}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      
      {hint && !showError && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      
      {showError && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
