import React from 'react';
import { useRealtimeDashboard } from '../../hooks/useRealtimeDashboard';
import { RealtimeIndicator } from './RealtimeIndicator';
import { TrendingUp, Users, Building, DollarSign } from 'lucide-react';

interface RealtimeDashboardStatsProps {
  userId: string | null;
  role: string | null;
}

export function RealtimeDashboardStats({ userId, role }: RealtimeDashboardStatsProps) {
  const { stats, loading } = useRealtimeDashboard(userId, role);

  if (loading) {
    return <div className="text-slate-500">Loading stats...</div>;
  }

  const getStatsForRole = () => {
    switch (role) {
      case 'corporate':
        return [
          {
            label: 'Total Projects',
            value: stats.totalProjects,
            icon: Building,
            color: 'blue',
          },
          {
            label: 'Active Projects',
            value: stats.activeProjects,
            icon: TrendingUp,
            color: 'emerald',
          },
          {
            label: 'Total Budget',
            value: `PKR ${(stats.totalBudget / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: 'purple',
          },
        ];
      case 'volunteer':
        return [
          {
            label: 'Active Applications',
            value: stats.activeProjects,
            icon: TrendingUp,
            color: 'blue',
          },
          {
            label: 'Approved Projects',
            value: stats.totalProjects,
            icon: Building,
            color: 'emerald',
          },
          {
            label: 'Total Hours',
            value: stats.totalHours || 0,
            icon: Users,
            color: 'purple',
          },
        ];
      case 'admin':
        return [
          {
            label: 'Total Projects',
            value: stats.totalProjects,
            icon: Building,
            color: 'blue',
          },
          {
            label: 'Total NGOs',
            value: stats.totalNGOs,
            icon: Building,
            color: 'emerald',
          },
          {
            label: 'Total Volunteers',
            value: stats.totalVolunteers,
            icon: Users,
            color: 'purple',
          },
        ];
      default:
        return [];
    }
  };

  const statsToDisplay = getStatsForRole();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Dashboard Overview</h3>
        <RealtimeIndicator isConnected={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsToDisplay.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-50`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
