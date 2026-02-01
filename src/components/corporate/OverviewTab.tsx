import React, { useState } from 'react';
import { KpiCard } from './KpiCard';
import { ProjectRow } from './ProjectRow';
import { ProjectCard } from './ProjectCard';
import { ActivityFeed } from './ActivityFeed';
import { Plus, FileText, LayoutGrid, LayoutList, Search } from 'lucide-react';
import { CardSkeleton, ProjectCardSkeleton, ListSkeleton } from '../skeletons';

interface OverviewTabProps {
  kpiData: {
    activeProjects: number;
    beneficiariesYtd: number;
    csrSpendYtd: { amount: number; currency: string };
    upcomingEvents: number;
    trends: {
      activeProjects: { pct: number; period: string };
      beneficiariesYtd: { pct: number; period: string };
      csrSpendYtd: { pct: number; period: string };
      upcomingEvents: { pct: number; period: string };
    };
  };
  projects: Array<{
    id: string;
    title: string;
    status: 'draft' | 'active' | 'completed' | 'on-hold';
    ngoName: string;
    startDate: string;
    endDate: string;
    progress: number;
    volunteersCount: number;
    budget: number;
    spent: number;
    thumbnail?: string;
  }>;
  activities: Array<{
    id: string;
    type: 'media_upload' | 'payment' | 'volunteer_join' | 'project_update' | 'milestone' | 'alert';
    user: string;
    message: string;
    projectId?: string;
    projectName?: string;
    timestamp: string;
    read?: boolean;
  }>;
  onCreateProject: () => void;
  onRequestReport: () => void;
  onViewProjectDetails: (id: string) => void;
  onEditProject: (id: string) => void;
  onTogglePauseProject: (id: string) => void;
  onNavigateToProject: (id: string) => void;
  onMarkActivityAsRead?: (activityId: string) => void;
  loading?: boolean;
}

export function OverviewTab({
  kpiData,
  projects,
  activities,
  onCreateProject,
  onRequestReport,
  onViewProjectDetails,
  onEditProject,
  onTogglePauseProject,
  onNavigateToProject,
  onMarkActivityAsRead,
  loading
}: OverviewTabProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedCount, setDisplayedCount] = useState(6);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.ngoName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedProjects = filteredProjects.slice(0, displayedCount);
  const hasMore = displayedCount < filteredProjects.length;

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + 6);
  };

  // Show skeleton loading state
  if (loading) {
    return (
      <div className="space-y-8">
        {/* KPI Row Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Projects (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Right: Activity Feed (1/3) */}
          <div className="lg:col-span-1">
            <ListSkeleton items={8} showAvatar={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          label="Active Projects"
          value={kpiData.activeProjects}
          trendPct={kpiData.trends.activeProjects.pct}
          trendLabel={kpiData.trends.activeProjects.period}
          sparklineData={[10, 12, 11, 13, 12]}
        />
        <KpiCard
          label="Beneficiaries YTD"
          value={kpiData.beneficiariesYtd}
          trendPct={kpiData.trends.beneficiariesYtd.pct}
          trendLabel={kpiData.trends.beneficiariesYtd.period}
          sparklineData={[4000, 4100, 4200, 4300, 4385]}
        />
        <KpiCard
          label="CSR Spend YTD"
          value={kpiData.csrSpendYtd.amount}
          currency={kpiData.csrSpendYtd.currency}
          trendPct={kpiData.trends.csrSpendYtd.pct}
          trendLabel={kpiData.trends.csrSpendYtd.period}
          sparklineData={[1000000, 1100000, 1150000, 1200000, 1250000]}
        />
        <KpiCard
          label="Upcoming Events"
          value={kpiData.upcomingEvents}
          trendPct={kpiData.trends.upcomingEvents.pct}
          trendLabel={kpiData.trends.upcomingEvents.period}
          sparklineData={[2, 3, 3, 3, 3]}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Projects (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onCreateProject}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
              data-analytics="dashboard_create_project"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
            <button
              onClick={onRequestReport}
              className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
              data-analytics="dashboard_request_report"
            >
              <FileText className="w-5 h-5" />
              <span>Request Report</span>
            </button>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900">Recent Projects</h2>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-10 pr-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors text-sm"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 border-2 border-slate-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'card'
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-label="Card view"
                    title="Card view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'table'
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-label="Table view"
                    title="Table view"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects List */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-900 mb-2">No projects yet</h3>
                <p className="text-slate-600 mb-6">Create your first CSR project to get started</p>
                <button
                  onClick={onCreateProject}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Project
                </button>
              </div>
            )}

            {viewMode === 'card' && displayedProjects.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {displayedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onView={onViewProjectDetails}
                    onEdit={onEditProject}
                    onTogglePause={onTogglePauseProject}
                  />
                ))}
              </div>
            )}

            {viewMode === 'table' && displayedProjects.length > 0 && (
              <div className="overflow-x-auto -mx-6">
                <table className="w-full">
                  <thead className="border-b-2 border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Project</th>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Status</th>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Start Date</th>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Progress</th>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Volunteers</th>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Budget</th>
                      <th className="py-3 px-4 text-left text-slate-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProjects.map((project) => (
                      <ProjectRow
                        key={project.id}
                        {...project}
                        viewMode="table"
                        onViewDetails={onViewProjectDetails}
                        onEdit={onEditProject}
                        onTogglePause={onTogglePauseProject}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {filteredProjects.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-slate-600 text-sm">
                  Showing {displayedProjects.length} of {filteredProjects.length} projects
                </p>
                {hasMore && (
                  <button 
                    onClick={handleLoadMore}
                    className="px-4 py-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors text-sm"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity Feed (1/3) */}
        <div className="lg:col-span-1">
          <ActivityFeed
            activities={activities}
            onNavigateToProject={onNavigateToProject}
            onMarkActivityAsRead={onMarkActivityAsRead}
          />
        </div>
      </div>
    </div>
  );
}