/**
 * ListSkeleton Component
 * 
 * Skeleton loader for list views with items.
 * Simulates various list layouts (simple, detailed, with avatars).
 * 
 * Features:
 * - Configurable number of items
 * - Multiple variants (simple, detailed, avatar)
 * - Dividers between items
 * - Responsive layout
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <ListSkeleton items={5} />
 * <ListSkeleton variant="avatar" items={3} />
 * <ListSkeleton variant="detailed" showDivider={true} />
 * ```
 * 
 * @module components/skeletons/ListSkeleton
 * @estimated-time 20 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { TextSkeleton } from './TextSkeleton';

export interface ListSkeletonProps {
  /** Number of list items */
  items?: number;
  /** List variant */
  variant?: 'simple' | 'detailed' | 'avatar';
  /** Show dividers between items */
  showDivider?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * List skeleton component for loading list views
 */
export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  variant = 'simple',
  showDivider = false,
  className = '',
}) => {
  const renderListItem = (index: number) => {
    switch (variant) {
      case 'avatar':
        return (
          <div key={index} className="flex items-center gap-3 py-3">
            <BaseSkeleton width="40px" height="40px" rounded="full" />
            <div className="flex-1">
              <BaseSkeleton width="120px" height="16px" rounded="sm" className="mb-1" />
              <BaseSkeleton width="180px" height="14px" rounded="sm" />
            </div>
          </div>
        );

      case 'detailed':
        return (
          <div key={index} className="py-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <BaseSkeleton width="200px" height="20px" rounded="md" />
              <BaseSkeleton width="80px" height="18px" rounded="sm" />
            </div>
            <TextSkeleton lines={2} lineHeight={14} />
          </div>
        );

      case 'simple':
      default:
        return (
          <div key={index} className="py-2">
            <BaseSkeleton width="100%" height="18px" rounded="sm" />
          </div>
        );
    }
  };

  return (
    <div className={className} role="status" aria-label="Loading list">
      {Array.from({ length: items }).map((_, index) => (
        <React.Fragment key={index}>
          {renderListItem(index)}
          {showDivider && index < items - 1 && (
            <div className="border-b border-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ListSkeleton;
