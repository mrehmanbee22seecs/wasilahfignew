import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ label, children, error, helperText, required, className = '' }: FormFieldProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block mb-2 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200 resize-vertical ${
        error 
          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
      } outline-none ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ error, options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200 ${
        error 
          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
      } outline-none bg-white ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 ${className}`}
        {...props}
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Radio({ label, className = '', ...props }: RadioProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-200 ${className}`}
        {...props}
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
