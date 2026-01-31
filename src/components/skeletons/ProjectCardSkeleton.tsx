/**
 * ProjectCardSkeleton Component
 * 
 * Specialized skeleton loader for project cards.
 * Includes image, title, description, tags, stats, and actions.
 * 
 * Features:
 * - Project image placeholder
 * - Title and description
 * - Tag/category badges
 * - Project statistics (funding, volunteers, etc.)
 * - Action buttons
 * - Responsive layout
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <ProjectCardSkeleton />
 * <ProjectCardSkeleton variant="compact" />
 * <ProjectCardSkeleton showStats={true} />
 * ```
 * 
 * @module components/skeletons/ProjectCardSkeleton
 * @estimated-time 25 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { TextSkeleton } from './TextSkeleton';
import { ButtonSkeleton } from './ButtonSkeleton';

export interface ProjectCardSkeletonProps {
  /** Card variant */
  variant?: 'default' | 'compact';
  /** Show project stats */
  showStats?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Project card skeleton component for loading project cards
 */
export const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = ({
  variant = 'default',
  showStats = true,
  className = '',
}) => {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${className}`}
      role="status"
      aria-label="Loading project card"
    >
      {/* Project image */}
      <BaseSkeleton
        width="100%"
        height={isCompact ? '140px' : '200px'}
        rounded="none"
        className="rounded-t-lg"
      />

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Header: Title and organization */}
        <div className="space-y-2">
          <BaseSkeleton width="85%" height={isCompact ? '20px' : '24px'} rounded="md" />
          <div className="flex items-center gap-2">
            <BaseSkeleton width="24px" height="24px" rounded="full" />
            <BaseSkeleton width="120px" height="14px" rounded="sm" />
          </div>
        </div>

        {/* Description */}
        {!isCompact && <TextSkeleton lines={2} lineHeight={14} />}

        {/* Tags/Categories */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <BaseSkeleton key={i} width="80px" height="24px" rounded="full" />
          ))}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-1">
                <BaseSkeleton width="40px" height="18px" rounded="sm" className="mx-auto" />
                <BaseSkeleton width="60px" height="12px" rounded="sm" className="mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Footer: Location and actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <BaseSkeleton width="16px" height="16px" rounded="sm" />
            <BaseSkeleton width="100px" height="14px" rounded="sm" />
          </div>
          <ButtonSkeleton size="sm" width="80px" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
