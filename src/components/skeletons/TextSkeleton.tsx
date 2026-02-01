/**
 * TextSkeleton Component
 * 
 * Skeleton loader for text content with varying line widths.
 * Simulates lines of text with realistic proportions.
 * 
 * Features:
 * - Configurable number of lines
 * - Automatic width variation for natural look
 * - Custom line heights and spacing
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <TextSkeleton lines={3} />
 * <TextSkeleton lines={1} width="60%" />
 * ```
 * 
 * @module components/skeletons/TextSkeleton
 * @estimated-time 15 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export interface TextSkeletonProps {
  /** Number of lines to display */
  lines?: number;
  /** Width of single line (used when lines=1) */
  width?: string;
  /** Line height in pixels */
  lineHeight?: number;
  /** Spacing between lines in pixels */
  spacing?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Text skeleton component for loading text content
 */
export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  width,
  lineHeight = 16,
  spacing = 8,
  className = '',
}) => {
  // Generate width percentages for a natural look
  const getLineWidth = (index: number, total: number): string => {
    if (width && total === 1) return width;
    if (index === total - 1) return '60%'; // Last line is shorter
    return '100%';
  };

  return (
    <div className={`space-y-${spacing / 4} ${className}`} role="status" aria-label="Loading text">
      {Array.from({ length: lines }).map((_, index) => (
        <BaseSkeleton
          key={index}
          height={`${lineHeight}px`}
          width={getLineWidth(index, lines)}
          rounded="sm"
        />
      ))}
    </div>
  );
};

export default TextSkeleton;
