import React from 'react';

interface TagBadgeProps {
  label: string;
  variant?: 'default' | 'sdg' | 'primary';
  size?: 'sm' | 'md';
}

export function TagBadge({ label, variant = 'default', size = 'sm' }: TagBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors';
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    sdg: 'bg-gradient-to-r from-teal-100 to-blue-100 text-blue-700 border border-blue-200',
    primary: 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
  };
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
