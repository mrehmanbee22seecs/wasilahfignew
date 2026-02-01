/**
 * DashboardSkeleton Component
 * 
 * Comprehensive skeleton loader for full dashboard layouts.
 * Combines multiple skeleton components for a complete dashboard view.
 * 
 * Features:
 * - Header with title and actions
 * - Stats/metrics cards grid
 * - Chart sections
 * - Data table or list
 * - Sidebar integration (optional)
 * - Fully responsive layout
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <DashboardSkeleton />
 * <DashboardSkeleton variant="ngo" />
 * <DashboardSkeleton showSidebar={true} />
 * ```
 * 
 * @module components/skeletons/DashboardSkeleton
 * @estimated-time 30 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';
import { HeaderSkeleton } from './HeaderSkeleton';
import { CardSkeleton } from './CardSkeleton';
import { ChartSkeleton } from './ChartSkeleton';
import { TableRowSkeleton } from './TableRowSkeleton';
import { SidebarSkeleton } from './SidebarSkeleton';

export interface DashboardSkeletonProps {
  /** Dashboard variant */
  variant?: 'default' | 'ngo' | 'volunteer' | 'corporate';
  /** Show sidebar */
  showSidebar?: boolean;
  /** Number of stat cards */
  statCards?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dashboard skeleton component for loading full dashboard layouts
 */
export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  variant = 'default',
  showSidebar = false,
  statCards = 4,
  className = '',
}) => {
  const dashboardContent = (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <HeaderSkeleton showActions={true} />

      {/* Stats cards */}
      <div className={`grid gap-4 ${
        statCards === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
        statCards === 3 ? 'grid-cols-1 sm:grid-cols-3' :
        'grid-cols-1 sm:grid-cols-2'
      }`}>
        {Array.from({ length: statCards }).map((_, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <BaseSkeleton width="100px" height="14px" rounded="sm" />
              <BaseSkeleton width="24px" height="24px" rounded="md" />
            </div>
            <BaseSkeleton width="80px" height="28px" rounded="md" />
            <BaseSkeleton width="60px" height="12px" rounded="sm" />
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ChartSkeleton type="bar" height={280} showTitle={true} />
        <ChartSkeleton type="line" height={280} showTitle={true} />
      </div>

      {/* Recent activity or data section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BaseSkeleton width="180px" height="24px" rounded="md" />
          <BaseSkeleton width="100px" height="32px" rounded="md" />
        </div>

        {variant === 'ngo' || variant === 'corporate' ? (
          // Table view for NGO/Corporate
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="bg-muted/50 border-b border-border px-4 py-3">
              <div className="flex items-center gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-1">
                    <BaseSkeleton width="80px" height="14px" rounded="sm" />
                  </div>
                ))}
              </div>
            </div>
            {/* Table rows */}
            <TableRowSkeleton columns={5} rows={6} />
          </div>
        ) : (
          // Card grid for volunteer/default
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} showImage={true} lines={2} imageHeight={140} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`flex min-h-screen bg-background ${className}`}
      role="status"
      aria-label="Loading dashboard"
    >
      {/* Sidebar */}
      {showSidebar && <SidebarSkeleton />}

      {/* Main content */}
      {dashboardContent}
    </div>
  );
};

export default DashboardSkeleton;
