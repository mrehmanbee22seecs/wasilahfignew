import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
}

export function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  maxLength,
  autoFocus = false
}: FormInputProps) {
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-slate-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`w-full px-4 py-3 bg-white border-2 rounded-lg transition-all text-slate-900 placeholder:text-slate-400
          ${hasError 
            ? 'border-red-500 focus:border-red-600 animate-shake' 
            : 'border-slate-200 focus:border-teal-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-slate-300'}
          focus:outline-none focus:ring-2 focus:ring-teal-100
        `}
      />
      {hasError && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
