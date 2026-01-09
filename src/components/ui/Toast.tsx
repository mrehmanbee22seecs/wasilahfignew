import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  onUndo?: () => void;
  undoLabel?: string;
}

export function Toast({ 
  id, 
  type, 
  message, 
  description, 
  duration = 5000, 
  onClose, 
  onUndo,
  undoLabel = 'Undo'
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration && duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          handleClose();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  const handleUndo = () => {
    onUndo?.();
    handleClose();
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const Icon = icons[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`
        relative flex items-start gap-3 p-4 pr-12 rounded-lg border-2 shadow-lg
        transition-all duration-200 min-w-[320px] max-w-md
        ${colors[type]}
        ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.2, 1)'
      }}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm mb-1">{message}</p>
        {description && (
          <p className="text-xs opacity-80">{description}</p>
        )}
        
        {/* Undo Button */}
        {onUndo && (
          <button
            onClick={handleUndo}
            className={`
              mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg 
              transition-colors border-2
              ${type === 'success' ? 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800' : ''}
              ${type === 'error' ? 'bg-red-100 hover:bg-red-200 border-red-300 text-red-800' : ''}
              ${type === 'warning' ? 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800' : ''}
              ${type === 'info' ? 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800' : ''}
            `}
          >
            <RotateCcw className="w-3 h-3" />
            {undoLabel}
          </button>
        )}
      </div>
      
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress Bar */}
      {duration && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all ${progressColors[type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {/* ARIA live region for screen readers */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {toasts.map(toast => (
          <div key={toast.id}>
            {toast.type === 'error' ? 'Error: ' : ''}
            {toast.type === 'success' ? 'Success: ' : ''}
            {toast.type === 'warning' ? 'Warning: ' : ''}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Visual toasts */}
      <div 
        className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-auto"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </>
  );
}
