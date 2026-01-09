import React, { useState } from 'react';
import { Grid, List, Search, Filter, FileText, FolderKanban } from 'lucide-react';
import { ProjectCard } from '../ProjectCard';
import { ReportsTab } from './ReportsTab';
import type { NGOAssignedProject, ProjectReport } from '../../../types/ngo-projects';

interface ProjectsTabProps {
  projects: NGOAssignedProject[];
  reports: ProjectReport[];
  onSubmitUpdate: (projectId: string) => void;
  onViewDetails: (projectId: string) => void;
  onDownloadReport: (reportId: string, format: 'pdf' | 'docx') => void;
}

export function ProjectsTab({ projects, reports, onSubmitUpdate, onViewDetails, onDownloadReport }: ProjectsTabProps) {
  const [subTab, setSubTab] = useState<'projects' | 'reports'>('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending_review: projects.filter(p => p.status === 'pending_review').length
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-4">
        <button
          onClick={() => setSubTab('projects')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg transition-all
            ${subTab === 'projects'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300'
            }
          `}
        >
          <FolderKanban className="w-5 h-5" />
          <span>My Projects</span>
          <span className={`
            px-2 py-0.5 rounded text-xs
            ${subTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}
          `}>
            {projects.length}
          </span>
        </button>
        <button
          onClick={() => setSubTab('reports')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg transition-all
            ${subTab === 'reports'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300'
            }
          `}
        >
          <FileText className="w-5 h-5" />
          <span>Reports</span>
          <span className={`
            px-2 py-0.5 rounded text-xs
            ${subTab === 'reports' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}
          `}>
            {reports.length}
          </span>
        </button>
      </div>

      {/* Projects View */}
      {subTab === 'projects' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                filterStatus === 'all'
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              All Projects ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                filterStatus === 'active'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              Active ({statusCounts.active})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                filterStatus === 'completed'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              Completed ({statusCounts.completed})
            </button>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSubmitUpdate={onSubmitUpdate}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600">
                {searchQuery ? 'Try adjusting your search terms' : 'No projects match the selected filters'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reports View */}
      {subTab === 'reports' && (
        <ReportsTab
          reports={reports}
          onDownloadReport={onDownloadReport}
        />
      )}
    </div>
  );
}