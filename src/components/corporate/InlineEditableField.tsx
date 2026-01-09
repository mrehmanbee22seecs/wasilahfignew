import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

interface InlineEditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function InlineEditableField({
  value,
  onSave,
  multiline = false,
  placeholder = 'Click to edit...',
  label,
  className = ''
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        (inputRef.current as HTMLTextAreaElement).setSelectionRange(
          editValue.length,
          editValue.length
        );
      } else {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isEditing) {
    return (
      <div
        className={`group relative cursor-pointer ${className}`}
        onClick={() => setIsEditing(true)}
      >
        {label && (
          <label className="block text-slate-700 mb-2">{label}</label>
        )}
        <div className="relative">
          <div className={`
            ${multiline ? 'min-h-[100px] whitespace-pre-wrap' : ''}
            ${!value.trim() ? 'text-slate-400 italic' : 'text-slate-900'}
            px-4 py-3 border-2 border-transparent rounded-lg 
            group-hover:border-teal-600 group-hover:bg-teal-50 
            transition-all duration-200
          `}>
            {value.trim() || placeholder}
          </div>
          <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Edit2 className="w-4 h-4 text-teal-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-slate-700 mb-2">{label}</label>
      )}
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-4 py-3 border-2 border-teal-600 rounded-lg focus:ring-4 focus:ring-teal-100 transition-all resize-none"
            rows={6}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-4 py-3 border-2 border-teal-600 rounded-lg focus:ring-4 focus:ring-teal-100 transition-all"
            placeholder={placeholder}
          />
        )}
        
        {/* Action Buttons */}
        <div className="absolute right-2 top-2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Save (Enter)"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Cancel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {multiline && (
        <p className="text-xs text-slate-500 mt-1">
          Press Ctrl+Enter to save, Esc to cancel
        </p>
      )}
    </div>
  );
}

// Simpler inline text variant
interface InlineEditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
}

export function InlineEditableText({
  value,
  onSave,
  className = ''
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value && editValue.trim() !== '') {
      onSave(editValue.trim());
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:text-teal-600 hover:underline transition-colors ${className}`}
      >
        {value}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleSave}
      className={`border-b-2 border-teal-600 bg-transparent focus:outline-none ${className}`}
      style={{ width: `${Math.max(editValue.length, 10)}ch` }}
    />
  );
}
