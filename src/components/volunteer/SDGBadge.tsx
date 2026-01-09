import React from 'react';

export type SDGBadgeProps = {
  id: string;
  label: string;
  iconUrl?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
};

export function SDGBadge({
  id,
  label,
  iconUrl,
  size = 'md',
  showLabel = true,
  className = '',
}: SDGBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-8 px-3 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        bg-blue-50 text-blue-700 border border-blue-200
        ${sizeClasses[size]}
        ${className}
      `}
      title={label}
      aria-label={`SDG: ${label}`}
    >
      {iconUrl && (
        <img
          src={iconUrl}
          alt=""
          className="w-4 h-4 object-contain"
          aria-hidden="true"
        />
      )}
      {showLabel && <span className="truncate">{label}</span>}
      {!showLabel && !iconUrl && <span className="truncate">{id}</span>}
    </span>
  );
}
