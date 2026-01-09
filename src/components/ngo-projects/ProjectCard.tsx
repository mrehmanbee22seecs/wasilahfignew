import React from 'react';
import { Building2, Calendar, MapPin, Users, TrendingUp, FileText, ExternalLink } from 'lucide-react';
import type { ProjectCardProps } from '../../types/ngo-projects';

export function ProjectCard({ project, onSubmitUpdate, onViewDetails }: ProjectCardProps) {
  const getStatusConfig = () => {
    switch (project.status) {
      case 'active':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Active' };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Completed' };
      case 'pending_review':
        return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending Review' };
      case 'on_hold':
        return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: 'On Hold' };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="p-6 border-b-2 border-slate-100">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
          </div>
          <span className={`flex-shrink-0 px-3 py-1 rounded-lg border-2 text-xs ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Corporate Partner */}
        <div className="flex items-center gap-3 pt-3 border-t-2 border-slate-100">
          {project.corporate_partner.logo_url && (
            <img
              src={project.corporate_partner.logo_url}
              alt={project.corporate_partner.name}
              className="w-10 h-10 rounded-lg object-cover border-2 border-slate-200"
            />
          )}
          <div>
            <p className="text-xs text-slate-500">Corporate Partner</p>
            <p className="text-sm text-slate-900">{project.corporate_partner.name}</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-6 bg-slate-50">
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-700">Overall Progress</span>
            <span className="text-slate-900">{project.progress}%</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${project.progress}%` }}
              role="progressbar"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-white rounded-lg border-2 border-slate-200">
            <p className="text-xs text-slate-600 mb-0.5">Tasks</p>
            <p className="text-lg text-slate-900">{project.tasks_completed}/{project.tasks_total}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border-2 border-slate-200">
            <p className="text-xs text-slate-600 mb-0.5">Beneficiaries</p>
            <p className="text-lg text-slate-900">{project.beneficiaries_reached.toLocaleString()}</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{project.location.city}, {project.location.province}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>Last update: {getTimeAgo(project.last_update)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 flex items-center gap-3">
        <button
          onClick={() => onSubmitUpdate(project.id)}
          disabled={project.status === 'completed'}
          className={`
            flex-1 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2
            ${project.status === 'completed'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg'
            }
          `}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{project.status === 'completed' ? 'Completed' : 'Submit Update'}</span>
        </button>
        <button
          onClick={() => onViewDetails(project.id)}
          className="px-4 py-3 border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-all"
          aria-label="View project details"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
