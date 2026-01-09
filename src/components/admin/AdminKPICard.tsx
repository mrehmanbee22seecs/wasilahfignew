import React, { useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * AdminKPICard Component
 * 
 * @description Display key performance indicators with trend data and sparkline
 * @accessibility Includes aria-label for screen readers, keyboard accessible
 * 
 * Props:
 * - id: unique identifier
 * - title: KPI label
 * - value: main numeric value (string or number)
 * - trend: trend text (e.g., "+3 in 7d")
 * - trendDirection: 'up' | 'down' | 'neutral'
 * - sparklineData: array of numbers for micro-sparkline
 * - icon: Lucide icon component
 * - onClick: optional click handler
 * - className: additional CSS classes
 */

export type AdminKPICardProps = {
  id: string;
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
};

export function AdminKPICard({
  id,
  title,
  value,
  trend,
  trendDirection = 'neutral',
  sparklineData = [],
  icon: Icon,
  onClick,
  className = '',
}: AdminKPICardProps) {
  const [showSparkline, setShowSparkline] = useState(false);

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Simple sparkline SVG generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length === 0) return null;

    const width = 120;
    const height = 40;
    const padding = 2;

    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData
      .map((value, index) => {
        const x = (index / (sparklineData.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="absolute top-full left-0 mt-2 bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl z-10 pointer-events-none">
        <div className="text-xs mb-1">Last 7 days</div>
        <svg width={width} height={height} className="opacity-80">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div
      id={id}
      className={`
        relative bg-white border border-gray-200 rounded-lg p-4
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''}
        transition-all duration-200
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => sparklineData.length > 0 && setShowSparkline(true)}
      onMouseLeave={() => setShowSparkline(false)}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${title}: ${value}${trend ? `, ${trend}` : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">{title}</span>
        {Icon && (
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="text-2xl text-gray-900">{value}</div>
      </div>

      {/* Trend */}
      {trend && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{trend}</span>
        </div>
      )}

      {/* Sparkline Tooltip */}
      {showSparkline && renderSparkline()}
    </div>
  );
}
