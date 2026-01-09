import React from 'react';
import { Check } from 'lucide-react';

interface MultiSelectChipsProps {
  label: string;
  name: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hint?: string;
  maxSelections?: number;
  required?: boolean;
}

export function MultiSelectChips({
  label,
  name,
  options,
  selected,
  onChange,
  hint,
  maxSelections = 5,
  required = false
}: MultiSelectChipsProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      if (selected.length < maxSelections) {
        onChange([...selected, option]);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-slate-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {hint && (
        <p className="text-slate-600 text-sm mb-3">{hint}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && selected.length >= maxSelections;
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg border-2 text-sm transition-all
                ${isSelected
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : isDisabled
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {isSelected && <Check className="w-4 h-4" />}
                {option}
              </span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-slate-500 text-sm mt-2">
          {selected.length} of {maxSelections} selected
        </p>
      )}
    </div>
  );
}
