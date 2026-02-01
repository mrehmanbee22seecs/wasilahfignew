/**
 * CardSkeleton Component
 * 
 * Generic skeleton loader for card components.
 * Flexible and composable for various card layouts.
 * 
 * Features:
 * - Optional image/media placeholder
 * - Configurable content lines
 * - Optional footer with actions
 * - Flexible height and padding
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <CardSkeleton />
 * <CardSkeleton showImage={true} lines={4} />
 * <CardSkeleton showFooter={true} />
 * ```
 * 
 * @module components/skeletons/CardSkeleton
 * @estimated-time 20 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { TextSkeleton } from './TextSkeleton';
import { ButtonSkeleton } from './ButtonSkeleton';

export interface CardSkeletonProps {
  /** Show image/media placeholder */
  showImage?: boolean;
  /** Number of content text lines */
  lines?: number;
  /** Show footer with actions */
  showFooter?: boolean;
  /** Image height in pixels */
  imageHeight?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card skeleton component for loading card layouts
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  lines = 3,
  showFooter = false,
  imageHeight = 200,
  className = '',
}) => {
  return (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}
      role="status"
      aria-label="Loading card"
    >
      {/* Image placeholder */}
      {showImage && (
        <BaseSkeleton
          height={`${imageHeight}px`}
          width="100%"
          rounded="none"
          className="rounded-t-lg"
        />
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <BaseSkeleton width="70%" height="24px" rounded="md" />

        {/* Description lines */}
        <TextSkeleton lines={lines} lineHeight={16} />
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="px-4 pb-4 flex items-center gap-2">
          <ButtonSkeleton size="sm" />
          <ButtonSkeleton size="sm" />
        </div>
      )}
    </div>
  );
};

export default CardSkeleton;
