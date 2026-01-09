import React from 'react';
import { Calendar, MapPin, Users, ExternalLink, Clock } from 'lucide-react';
import type { NGOProject } from '../../types/ngo';

interface ProjectCardProps {
  project: NGOProject;
  onViewDetails?: (projectId: string) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const getStatusColor = (status: NGOProject['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) {
      return `PKR ${(amount / 1000000).toFixed(1)}M`;
    }
    return `PKR ${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div 
      className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all group cursor-pointer"
      onClick={() => onViewDetails?.(project.id)}
      role="article"
      aria-label={`Project: ${project.title}`}
    >
      {/* Thumbnail */}
      {project.thumbnail_url && (
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          <img 
            src={project.thumbnail_url} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className={`inline-flex px-3 py-1 rounded-full border-2 text-xs capitalize ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span>Progress</span>
            <span className="font-medium text-slate-900">{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
              role="progressbar"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{project.location.city}, {project.location.province}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{project.volunteers_count} volunteers</span>
          </div>
        </div>

        {/* Budget & Action */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Budget</p>
            <p className="text-sm text-slate-900">{formatBudget(project.budget)}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(project.id);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            aria-label={`View details for ${project.title}`}
          >
            View Details
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
