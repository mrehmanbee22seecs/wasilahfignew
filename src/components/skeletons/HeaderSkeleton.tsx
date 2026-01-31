/**
 * HeaderSkeleton Component
 * 
 * Skeleton loader for page headers.
 * Typically includes a title, subtitle, and optional action buttons.
 * 
 * Features:
 * - Title and subtitle text skeletons
 * - Optional action button placeholders
 * - Breadcrumb placeholder
 * - Responsive layout
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <HeaderSkeleton />
 * <HeaderSkeleton showActions={true} />
 * <HeaderSkeleton showBreadcrumb={true} />
 * ```
 * 
 * @module components/skeletons/HeaderSkeleton
 * @estimated-time 15 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { ButtonSkeleton } from './ButtonSkeleton';

export interface HeaderSkeletonProps {
  /** Show action buttons */
  showActions?: boolean;
  /** Show breadcrumb */
  showBreadcrumb?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Header skeleton component for loading page headers
 */
export const HeaderSkeleton: React.FC<HeaderSkeletonProps> = ({
  showActions = false,
  showBreadcrumb = false,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading header">
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <div className="flex items-center gap-2">
          <BaseSkeleton width="60px" height="16px" rounded="sm" />
          <BaseSkeleton width="8px" height="8px" rounded="full" />
          <BaseSkeleton width="80px" height="16px" rounded="sm" />
        </div>
      )}

      {/* Header content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Title */}
          <BaseSkeleton width="300px" height="32px" rounded="md" className="max-w-full" />
          
          {/* Subtitle */}
          <BaseSkeleton width="200px" height="20px" rounded="sm" className="max-w-full" />
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            <ButtonSkeleton size="md" />
            <ButtonSkeleton size="md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSkeleton;
