import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Loader } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: number | string;
  currency?: string;
  trendPct?: number;
  trendLabel?: string;
  sparklineData?: number[];
  status?: 'default' | 'loading' | 'error';
  variant?: 'default' | 'compact';
  onRetry?: () => void;
}

export function KpiCard({
  label,
  value,
  currency,
  trendPct,
  trendLabel = 'vs last quarter',
  sparklineData = [],
  status = 'default',
  variant = 'default',
  onRetry
}: KpiCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Format value with proper currency/number formatting
  const formattedValue = currency 
    ? `${currency} ${Number(value).toLocaleString('en-PK')}`
    : Number(value).toLocaleString();

  // Determine trend direction
  const trendDirection = trendPct === 0 ? 'neutral' : trendPct! > 0 ? 'up' : 'down';
  const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-slate-600';

  // Loading skeleton
  if (status === 'loading') {
    return (
      <div className={`bg-white rounded-xl border-2 border-slate-200 ${variant === 'compact' ? 'p-4' : 'p-6'} animate-pulse`}>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className={`bg-white rounded-xl border-2 border-red-200 ${variant === 'compact' ? 'p-4' : 'p-6'}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-slate-700 text-sm mb-2">{label}</p>
            <p className="text-red-700 text-sm mb-3">Failed to load data</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border-2 border-slate-200 ${variant === 'compact' ? 'p-4' : 'p-6'} hover:border-teal-600 hover:shadow-lg transition-all duration-200 cursor-pointer relative group`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${formattedValue}`}
    >
      {/* Label */}
      <div className="text-slate-600 text-sm mb-2">{label}</div>

      {/* Value */}
      <div className={`text-slate-900 ${variant === 'compact' ? 'text-2xl' : 'text-3xl'} mb-2`}>
        {formattedValue}
      </div>

      {/* Trend */}
      {trendPct !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          {trendDirection === 'up' && <TrendingUp className="w-4 h-4" />}
          {trendDirection === 'down' && <TrendingDown className="w-4 h-4" />}
          {trendDirection === 'neutral' && <Minus className="w-4 h-4" />}
          <span>
            {trendPct > 0 ? '+' : ''}{trendPct}% {trendLabel}
          </span>
        </div>
      )}

      {/* Mini Sparkline (decorative) */}
      {sparklineData.length > 0 && (
        <div className="absolute bottom-3 right-3 opacity-20">
          <svg width="60" height="24" viewBox="0 0 60 24">
            <polyline
              points={sparklineData.map((val, i) => `${(i / (sparklineData.length - 1)) * 60},${24 - (val / Math.max(...sparklineData)) * 24}`).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg z-50 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-2 border-b border-slate-700 pb-2">
            <span className="text-slate-300">Last 3 months</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">This quarter:</span>
              <span className="font-medium">{formattedValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Last quarter:</span>
              <span>
                {currency 
                  ? `${currency} ${Math.round(Number(value) / (1 + (trendPct || 0) / 100)).toLocaleString()}`
                  : Math.round(Number(value) / (1 + (trendPct || 0) / 100)).toLocaleString()
                }
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700 text-slate-400 text-xs">
            Last refreshed: 2 min ago
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      )}
    </div>
  );
}
