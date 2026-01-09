import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default'
}: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { height: 'h-1.5', text: 'text-xs' };
      case 'md':
        return { height: 'h-2', text: 'text-sm' };
      case 'lg':
        return { height: 'h-3', text: 'text-base' };
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'from-emerald-500 to-emerald-600';
      case 'warning':
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-indigo-500 to-indigo-600';
    }
  };

  const { height, text } = getSizeClasses();
  const colorClass = getVariantColor();

  return (
    <div>
      {(label || showPercentage) && (
        <div className={`flex items-center justify-between mb-1.5 ${text}`}>
          {label && <span className="text-slate-700">{label}</span>}
          {showPercentage && (
            <span className="text-slate-900 font-medium">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden border border-slate-200`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || `${current} of ${total}`}
        />
      </div>

      {total > 0 && (
        <p className={`${text} text-slate-500 mt-1`}>
          {current} of {total} {label ? label.toLowerCase() : 'items'}
        </p>
      )}
    </div>
  );
}
