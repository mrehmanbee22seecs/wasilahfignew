/**
 * ProfileSkeleton Component
 * 
 * Skeleton loader for user/organization profile pages.
 * Includes avatar, header info, stats, and content sections.
 * 
 * Features:
 * - Large avatar/image placeholder
 * - Profile header with name and details
 * - Stats/metrics section
 * - Bio/description area
 * - Action buttons
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <ProfileSkeleton />
 * <ProfileSkeleton showStats={true} />
 * <ProfileSkeleton variant="organization" />
 * ```
 * 
 * @module components/skeletons/ProfileSkeleton
 * @estimated-time 25 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { TextSkeleton } from './TextSkeleton';
import { ButtonSkeleton } from './ButtonSkeleton';

export interface ProfileSkeletonProps {
  /** Show stats section */
  showStats?: boolean;
  /** Profile variant */
  variant?: 'user' | 'organization';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Profile skeleton component for loading profile pages
 */
export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  showStats = true,
  variant = 'user',
  className = '',
}) => {
  const avatarSize = variant === 'organization' ? '120px' : '100px';

  return (
    <div className={`space-y-6 ${className}`} role="status" aria-label="Loading profile">
      {/* Header with avatar and info */}
      <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-card border border-border rounded-lg">
        {/* Avatar */}
        <BaseSkeleton
          width={avatarSize}
          height={avatarSize}
          rounded={variant === 'user' ? 'full' : 'lg'}
          className="flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 space-y-4 w-full">
          {/* Name and role */}
          <div className="space-y-2">
            <BaseSkeleton width="250px" height="28px" rounded="md" className="max-w-full" />
            <BaseSkeleton width="180px" height="18px" rounded="sm" className="max-w-full" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <ButtonSkeleton size="md" width="120px" />
            <ButtonSkeleton size="md" width="100px" />
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-lg">
              <BaseSkeleton width="60px" height="24px" rounded="md" className="mb-2" />
              <BaseSkeleton width="80px" height="14px" rounded="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Bio/About section */}
      <div className="p-6 bg-card border border-border rounded-lg space-y-3">
        <BaseSkeleton width="100px" height="20px" rounded="md" />
        <TextSkeleton lines={4} lineHeight={16} />
      </div>

      {/* Additional content sections */}
      <div className="space-y-4">
        <BaseSkeleton width="150px" height="24px" rounded="md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-lg">
              <BaseSkeleton width="70%" height="18px" rounded="sm" className="mb-2" />
              <TextSkeleton lines={2} lineHeight={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
