import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPICardProps } from '../../types/ngo';

export function KPICard({ label, value, subtitle, trend, trendValue, icon: Icon }: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-rose-600" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-rose-600';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-indigo-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-3xl text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t-2 border-slate-100">
          {getTrendIcon()}
          <span className={`text-sm ${getTrendColor()}`}>
            {trendValue}
          </span>
          <span className="text-xs text-slate-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
