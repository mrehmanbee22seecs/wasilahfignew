import React from 'react';

interface ValidatedCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  description?: string;
}

export function ValidatedCheckbox({
  label,
  error,
  touched,
  required,
  description,
  className = '',
  ...props
}: ValidatedCheckboxProps) {
  const showError = touched && error;
  
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className={`mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
            showError ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 cursor-pointer">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
          
          {showError && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
