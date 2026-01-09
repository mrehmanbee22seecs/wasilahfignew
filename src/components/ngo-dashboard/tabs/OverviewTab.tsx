import React from 'react';
import { FolderKanban, Users, TrendingUp, Clock } from 'lucide-react';
import { KPICard } from '../KPICard';
import { ProjectCard } from '../ProjectCard';
import { ActivityFeed } from '../ActivityFeed';
import { RightColumn } from '../RightColumn';
import type { NGODashboardData } from '../../../types/ngo';

interface OverviewTabProps {
  data: NGODashboardData;
  onViewProject?: (projectId: string) => void;
}

export function OverviewTab({ data, onViewProject }: OverviewTabProps) {
  const { stats, projects, activity_feed, recent_uploads } = data;

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
          trend="up"
          trendValue="+2 this month"
        />
        <KPICard
          label="Total Volunteers"
          value={stats.volunteers}
          icon={Users}
          trend="up"
          trendValue="+8 this month"
        />
        <KPICard
          label="Last Vetting Score"
          value={stats.lastVettingScore || 'N/A'}
          subtitle={stats.lastVettingScore ? '/100' : ''}
          icon={TrendingUp}
        />
        <KPICard
          label="Avg Response Time"
          value={stats.avgResponseTime ? `${stats.avgResponseTime}` : 'N/A'}
          subtitle={stats.avgResponseTime ? 'days' : ''}
          icon={Clock}
        />
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900">Active Projects</h2>
          <a 
            href="#projects" 
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.filter(p => p.status === 'active').map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onViewDetails={onViewProject}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout with Activity Feed and Right Column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity Feed (Left - 2 columns) */}
        <div className="xl:col-span-2">
          <h2 className="text-slate-900 mb-4">Recent Activity</h2>
          <ActivityFeed activities={activity_feed} limit={7} />
        </div>

        {/* Right Column (1 column) */}
        <div>
          <RightColumn recent_uploads={recent_uploads} />
        </div>
      </div>
    </div>
  );
}