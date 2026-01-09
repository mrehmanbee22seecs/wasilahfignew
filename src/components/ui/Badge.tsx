import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    danger: 'bg-red-600 text-white',
    info: 'bg-cyan-600 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
