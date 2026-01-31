/**
 * BaseSkeleton Component
 * 
 * A foundational skeleton component with shimmer animation effect.
 * Provides the base building block for all other skeleton components.
 * 
 * Features:
 * - Shimmer animation with CSS keyframes
 * - Dark mode support via Tailwind's dark: prefix
 * - Configurable dimensions and shapes
 * - Composable for building complex skeletons
 * 
 * Usage:
 * ```tsx
 * <BaseSkeleton width="200px" height="20px" />
 * <BaseSkeleton className="w-full h-40 rounded-xl" />
 * ```
 * 
 * @module components/skeletons/BaseSkeleton
 * @estimated-time 15 minutes
 */

import React from 'react';

export interface BaseSkeletonProps {
  /** Width of the skeleton (CSS value) */
  width?: string;
  /** Height of the skeleton (CSS value) */
  height?: string;
  /** Border radius variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional CSS classes */
  className?: string;
  /** Animation style */
  animation?: 'shimmer' | 'pulse' | 'none';
}

/**
 * Base skeleton component with shimmer animation
 */
export const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  width,
  height,
  rounded = 'md',
  className = '',
  animation = 'shimmer',
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const animationClasses = {
    shimmer: 'animate-shimmer',
    pulse: 'animate-pulse',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`
        bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
        dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
        bg-[length:200%_100%]
        ${roundedClasses[rounded]} 
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
      role="presentation"
    />
  );
};

// Export for convenience
export default BaseSkeleton;
