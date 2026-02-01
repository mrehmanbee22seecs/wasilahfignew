/**
 * TableRowSkeleton Component
 * 
 * Skeleton loader for table rows.
 * Can be used individually or in groups to simulate full tables.
 * 
 * Features:
 * - Configurable number of columns
 * - Optional checkbox column
 * - Optional actions column
 * - Responsive column widths
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <TableRowSkeleton columns={5} />
 * <TableRowSkeleton columns={4} showCheckbox={true} showActions={true} />
 * // Multiple rows:
 * {Array.from({ length: 5 }).map((_, i) => (
 *   <TableRowSkeleton key={i} columns={4} />
 * ))}
 * ```
 * 
 * @module components/skeletons/TableRowSkeleton
 * @estimated-time 15 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export interface TableRowSkeletonProps {
  /** Number of data columns */
  columns?: number;
  /** Show checkbox column */
  showCheckbox?: boolean;
  /** Show actions column */
  showActions?: boolean;
  /** Rows to render (when used as table group) */
  rows?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Single table row skeleton
 */
const SingleRow: React.FC<Omit<TableRowSkeletonProps, 'rows'>> = ({
  columns = 4,
  showCheckbox = false,
  showActions = false,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-4 py-3 px-4 border-b border-border ${className}`}
      role="row"
    >
      {/* Checkbox column */}
      {showCheckbox && (
        <div className="flex-shrink-0">
          <BaseSkeleton width="20px" height="20px" rounded="sm" />
        </div>
      )}

      {/* Data columns */}
      {Array.from({ length: columns }).map((_, index) => {
        // Vary widths for natural look
        const widths = ['120px', '180px', '150px', '100px', '200px'];
        const width = widths[index % widths.length];
        
        return (
          <div key={index} className="flex-1 min-w-0">
            <BaseSkeleton width={width} height="16px" rounded="sm" className="max-w-full" />
          </div>
        );
      })}

      {/* Actions column */}
      {showActions && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <BaseSkeleton width="24px" height="24px" rounded="md" />
          <BaseSkeleton width="24px" height="24px" rounded="md" />
        </div>
      )}
    </div>
  );
};

/**
 * Table row skeleton component for loading table rows
 */
export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  rows = 1,
  ...props
}) => {
  if (rows === 1) {
    return <SingleRow {...props} />;
  }

  return (
    <div role="status" aria-label="Loading table">
      {Array.from({ length: rows }).map((_, index) => (
        <SingleRow key={index} {...props} />
      ))}
    </div>
  );
};

export default TableRowSkeleton;
