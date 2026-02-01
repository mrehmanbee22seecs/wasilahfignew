/**
 * ButtonSkeleton Component
 * 
 * Skeleton loader for button placeholders.
 * Simulates various button sizes and styles.
 * 
 * Features:
 * - Multiple size variants (sm, md, lg)
 * - Full-width or fixed width options
 * - Rounded corners matching button styles
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <ButtonSkeleton size="md" />
 * <ButtonSkeleton width="200px" />
 * ```
 * 
 * @module components/skeletons/ButtonSkeleton
 * @estimated-time 10 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export interface ButtonSkeletonProps {
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom width (overrides size preset) */
  width?: string;
  /** Make button full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button skeleton component for loading buttons
 */
export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  size = 'md',
  width,
  fullWidth = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: { height: '32px', width: width || '80px' },
    md: { height: '40px', width: width || '120px' },
    lg: { height: '48px', width: width || '160px' },
  };

  const { height, width: defaultWidth } = sizeStyles[size];

  return (
    <BaseSkeleton
      height={height}
      width={fullWidth ? '100%' : width || defaultWidth}
      rounded="lg"
      className={className}
      aria-label="Loading button"
    />
  );
};

export default ButtonSkeleton;
