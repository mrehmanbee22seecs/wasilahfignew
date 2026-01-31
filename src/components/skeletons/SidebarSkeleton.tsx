/**
 * SidebarSkeleton Component
 * 
 * Skeleton loader for navigation sidebars.
 * Simulates menu items, sections, and profile area.
 * 
 * Features:
 * - Logo/branding area
 * - Multiple menu sections
 * - Navigation items with icons
 * - User profile section at bottom
 * - Collapsible/compact mode
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <SidebarSkeleton />
 * <SidebarSkeleton compact={true} />
 * <SidebarSkeleton sections={3} itemsPerSection={5} />
 * ```
 * 
 * @module components/skeletons/SidebarSkeleton
 * @estimated-time 25 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export interface SidebarSkeletonProps {
  /** Number of menu sections */
  sections?: number;
  /** Items per section */
  itemsPerSection?: number;
  /** Compact mode (narrower sidebar) */
  compact?: boolean;
  /** Show user profile section */
  showProfile?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Sidebar skeleton component for loading navigation sidebars
 */
export const SidebarSkeleton: React.FC<SidebarSkeletonProps> = ({
  sections = 2,
  itemsPerSection = 6,
  compact = false,
  showProfile = true,
  className = '',
}) => {
  const width = compact ? '64px' : '256px';

  return (
    <div
      className={`h-screen bg-card border-r border-border flex flex-col ${className}`}
      style={{ width }}
      role="status"
      aria-label="Loading sidebar"
    >
      {/* Logo/Header */}
      <div className="p-4 border-b border-border">
        {compact ? (
          <BaseSkeleton width="40px" height="40px" rounded="md" className="mx-auto" />
        ) : (
          <div className="flex items-center gap-3">
            <BaseSkeleton width="40px" height="40px" rounded="md" />
            <BaseSkeleton width="120px" height="24px" rounded="md" />
          </div>
        )}
      </div>

      {/* Navigation sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Array.from({ length: sections }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {/* Section title */}
            {!compact && (
              <BaseSkeleton width="80px" height="14px" rounded="sm" className="mb-3" />
            )}

            {/* Menu items */}
            {Array.from({ length: itemsPerSection }).map((_, itemIndex) => (
              <div
                key={itemIndex}
                className={`flex items-center gap-3 py-2 ${compact ? 'justify-center' : ''}`}
              >
                {/* Icon */}
                <BaseSkeleton width="20px" height="20px" rounded="sm" className="flex-shrink-0" />
                
                {/* Label */}
                {!compact && (
                  <BaseSkeleton width="100px" height="16px" rounded="sm" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* User profile section */}
      {showProfile && (
        <div className="p-4 border-t border-border">
          {compact ? (
            <BaseSkeleton width="40px" height="40px" rounded="full" className="mx-auto" />
          ) : (
            <div className="flex items-center gap-3">
              <BaseSkeleton width="40px" height="40px" rounded="full" />
              <div className="flex-1 min-w-0">
                <BaseSkeleton width="100px" height="14px" rounded="sm" className="mb-1" />
                <BaseSkeleton width="80px" height="12px" rounded="sm" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarSkeleton;
