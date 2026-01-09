import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface FormCheckboxProps {
  label: string | React.ReactNode;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  required = false,
  error,
  disabled = false
}: FormCheckboxProps) {
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <label htmlFor={name} className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            required={required}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 border-2 rounded transition-all
              ${checked 
                ? 'bg-teal-600 border-teal-600' 
                : hasError
                  ? 'bg-white border-red-500'
                  : 'bg-white border-slate-300 group-hover:border-teal-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {checked && <Check className="w-4 h-4 text-white m-0.5" strokeWidth={3} />}
          </div>
        </div>
        <span className="text-slate-700 text-sm leading-relaxed select-none">
          {label} {required && <span className="text-red-600">*</span>}
        </span>
      </label>
      {hasError && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm ml-8">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
