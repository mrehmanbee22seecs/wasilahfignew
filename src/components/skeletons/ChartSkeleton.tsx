/**
 * ChartSkeleton Component
 * 
 * Skeleton loader for chart and graph components.
 * Simulates various chart types with animated placeholders.
 * 
 * Features:
 * - Multiple chart types (bar, line, pie, area)
 * - Legend placeholder
 * - Axis labels simulation
 * - Responsive sizing
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <ChartSkeleton type="bar" />
 * <ChartSkeleton type="line" height={300} />
 * <ChartSkeleton type="pie" showLegend={true} />
 * ```
 * 
 * @module components/skeletons/ChartSkeleton
 * @estimated-time 25 minutes
 */

import React from 'react';
import { BaseSkeleton } from './BaseSkeleton';

export interface ChartSkeletonProps {
  /** Chart type */
  type?: 'bar' | 'line' | 'pie' | 'area' | 'donut';
  /** Chart height in pixels */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show title */
  showTitle?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Chart skeleton component for loading charts and graphs
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  type = 'bar',
  height = 300,
  showLegend = true,
  showTitle = true,
  className = '',
}) => {
  const renderChartContent = () => {
    switch (type) {
      case 'pie':
      case 'donut':
        return (
          <div className="flex items-center justify-center h-full">
            <BaseSkeleton
              width="200px"
              height="200px"
              rounded="full"
              className="max-w-full max-h-full"
            />
          </div>
        );

      case 'line':
      case 'area':
        return (
          <div className="flex items-end justify-between gap-2 h-full px-4 pb-8">
            {/* Simulated line chart with varying heights */}
            {Array.from({ length: 12 }).map((_, i) => {
              const heights = [60, 75, 65, 80, 70, 85, 75, 90, 80, 85, 78, 88];
              return (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <BaseSkeleton
                    width="100%"
                    height={`${heights[i]}%`}
                    rounded="sm"
                  />
                </div>
              );
            })}
          </div>
        );

      case 'bar':
      default:
        return (
          <div className="flex items-end justify-between gap-2 h-full px-4 pb-8">
            {/* Simulated bar chart with varying heights */}
            {Array.from({ length: 8 }).map((_, i) => {
              const heights = [50, 70, 60, 85, 65, 75, 80, 70];
              return (
                <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                  <BaseSkeleton
                    width="100%"
                    height={`${heights[i]}%`}
                    rounded="sm"
                  />
                  {/* X-axis label */}
                  <BaseSkeleton width="30px" height="10px" rounded="sm" />
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 ${className}`}
      role="status"
      aria-label="Loading chart"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        {showTitle && (
          <div className="space-y-2">
            <BaseSkeleton width="180px" height="20px" rounded="md" />
            <BaseSkeleton width="120px" height="14px" rounded="sm" />
          </div>
        )}
        
        {/* Optional controls */}
        <div className="flex items-center gap-2">
          <BaseSkeleton width="80px" height="32px" rounded="md" />
        </div>
      </div>

      {/* Chart area */}
      <div style={{ height: `${height}px` }} className="relative">
        {/* Y-axis labels (for bar/line charts) */}
        {(type === 'bar' || type === 'line' || type === 'area') && (
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <BaseSkeleton key={i} width="30px" height="10px" rounded="sm" />
            ))}
          </div>
        )}

        {/* Chart content */}
        {renderChartContent()}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-4">
            {Array.from({ length: type === 'pie' || type === 'donut' ? 5 : 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <BaseSkeleton width="12px" height="12px" rounded="sm" />
                <BaseSkeleton width="60px" height="12px" rounded="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartSkeleton;
