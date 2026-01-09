import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  showCharCount?: boolean;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  maxLength = 1000,
  rows = 4,
  showCharCount = true
}: FormTextareaProps) {
  const hasError = Boolean(error);
  const charCount = value.length;

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-slate-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={`w-full px-4 py-3 bg-white border-2 rounded-lg transition-all text-slate-900 placeholder:text-slate-400 resize-none
          ${hasError 
            ? 'border-red-500 focus:border-red-600' 
            : 'border-slate-200 focus:border-teal-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-slate-300'}
          focus:outline-none focus:ring-2 focus:ring-teal-100
        `}
      />
      <div className="flex items-center justify-between mt-2">
        {hasError ? (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div />
        )}
        {showCharCount && (
          <span className={`text-sm ${charCount > maxLength * 0.9 ? 'text-orange-600' : 'text-slate-500'}`}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
