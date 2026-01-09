import React from 'react';

export type ApplicationStatus =
  | 'not_applied'
  | 'applied'
  | 'selected'
  | 'rejected'
  | 'open'
  | 'closed'
  | 'reviewing'
  | 'accepted';

export type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
};

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; colorClass: string; bgClass: string }
> = {
  not_applied: {
    label: 'Not Applied',
    colorClass: 'text-gray-700',
    bgClass: 'bg-gray-100',
  },
  applied: {
    label: 'Applied',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-100',
  },
  selected: {
    label: 'Selected',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-100',
  },
  rejected: {
    label: 'Rejected',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-100',
  },
  open: {
    label: 'Open',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-100',
  },
  closed: {
    label: 'Closed',
    colorClass: 'text-gray-700',
    bgClass: 'bg-gray-100',
  },
  reviewing: {
    label: 'Under Review',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-100',
  },
  accepted: {
    label: 'Accepted',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-100',
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs
        ${config.bgClass} ${config.colorClass}
        ${className}
      `}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
