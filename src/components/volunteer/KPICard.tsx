import React, { ReactNode } from 'react';

export type KPICardProps = {
  title: string;
  value: string | number;
  trend?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function KPICard({ title, value, trend, icon, onClick, className = '' }: KPICardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-lg p-6
        ${isClickable ? 'cursor-pointer hover:border-emerald-500 transition-colors' : ''}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={`${title}: ${value}${trend ? `, ${trend}` : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl text-gray-900">{value}</p>
          {trend && <p className="text-xs text-emerald-600 mt-2">{trend}</p>}
        </div>
        {icon && (
          <div className="flex-shrink-0 text-emerald-600 w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
