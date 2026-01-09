import React from 'react';
import { 
  Users, Award, School, Clock, Droplets, Home, Wrench, 
  Store, DollarSign, Briefcase, TrendingUp, TrendingDown,
  TreePine, Sprout, Cloud, Heart, Tent, Pill, ArrowRight, CheckCircle
} from 'lucide-react';
import type { KPI } from '../../types/impact';

interface KPIStatTileProps {
  kpi: KPI;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  Award,
  School,
  Clock,
  Droplets,
  Home,
  Wrench,
  Store,
  DollarSign,
  Briefcase,
  TrendingUp,
  TrendingDown,
  TreePine,
  Sprout,
  Cloud,
  Heart,
  Tent,
  Pill,
  ArrowRight,
  CheckCircle,
};

const TREND_COLORS: Record<string, string> = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  stable: 'text-slate-600',
};

const TREND_BG: Record<string, string> = {
  up: 'bg-emerald-50',
  down: 'bg-red-50',
  stable: 'bg-slate-50',
};

export function KPIStatTile({ kpi }: KPIStatTileProps) {
  const Icon = kpi.icon ? ICON_MAP[kpi.icon] : null;
  const trendColor = kpi.trend ? TREND_COLORS[kpi.trend] : 'text-slate-600';
  const trendBg = kpi.trend ? TREND_BG[kpi.trend] : 'bg-slate-50';

  return (
    <div className={`${trendBg} rounded-xl p-6 border-2 border-slate-200 hover:border-teal-300 transition-all group`}>
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`w-12 h-12 ${trendBg} rounded-lg flex items-center justify-center ${trendColor} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <div className={`text-3xl ${trendColor} mb-2`}>
        {kpi.value}
      </div>
      
      <div className="text-slate-600 text-sm">
        {kpi.label}
      </div>
    </div>
  );
}
