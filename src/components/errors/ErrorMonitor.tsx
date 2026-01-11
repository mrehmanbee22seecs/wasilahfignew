import React, { useEffect, useState } from 'react';
import { errorLogger } from '../../lib/errors/errorLogger';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export function ErrorMonitor() {
  const [stats, setStats] = useState({
    total: 0,
    bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
    byCategory: {} as Record<string, number>,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const errorStats = await errorLogger.getErrorStats();
      setStats(errorStats);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  if (stats.total === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">Error Monitor (Last 24h)</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-xs text-slate-600">Total</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.bySeverity.critical}</div>
          <div className="text-xs text-slate-600">Critical</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.bySeverity.high}</div>
          <div className="text-xs text-slate-600">High</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.bySeverity.medium}</div>
          <div className="text-xs text-slate-600">Medium</div>
        </div>
      </div>

      {stats.bySeverity.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <span className="font-semibold">{stats.bySeverity.critical} critical error(s)</span> detected in the last 24 hours
          </div>
        </div>
      )}
    </div>
  );
}
