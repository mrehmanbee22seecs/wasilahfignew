import React from 'react';
import { Eye, Edit, Pause, Play, MoreVertical, Clock, Users, DollarSign } from 'lucide-react';

interface ProjectCardProps {
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
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onTogglePause: (id: string) => void;
}

export function ProjectCard({
  id,
  title,
  status,
  ngoName,
  startDate,
  endDate,
  progress,
  volunteersCount,
  budget,
  spent,
  thumbnail,
  onView,
  onEdit,
  onTogglePause
}: ProjectCardProps) {
  const statusColors = {
    draft: 'bg-slate-100 text-slate-700 border-slate-300',
    active: 'bg-green-100 text-green-700 border-green-300',
    completed: 'bg-blue-100 text-blue-700 border-blue-300',
    'on-hold': 'bg-amber-100 text-amber-700 border-amber-300'
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const budgetPercentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  return (
    <div 
      className="bg-white rounded-xl border-2 border-slate-200 hover:border-teal-600 transition-all overflow-hidden group"
      onClick={() => onView(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView(id);
        }
      }}
    >
      {/* Thumbnail */}
      {thumbnail && (
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs border-2 backdrop-blur-sm ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-slate-900 text-lg line-clamp-2">{title}</h3>
            {!thumbnail && (
              <span className={`px-3 py-1 rounded-full text-xs border-2 flex-shrink-0 ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
          <p className="text-slate-600 text-sm">{ngoName}</p>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>{formatDate(startDate)} — {formatDate(endDate)}</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 to-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-slate-100">
          {/* Volunteers */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Volunteers</div>
              <div className="text-slate-900 font-medium">{volunteersCount}</div>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Budget</div>
              <div className="text-slate-900 font-medium text-sm">{budgetPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Budget Details */}
        <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3">
          <div className="flex justify-between">
            <span>Spent: {formatCurrency(spent)}</span>
            <span>Budget: {formatCurrency(budget)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t-2 border-slate-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(id);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            className="p-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
            aria-label="Edit project"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePause(id);
            }}
            className="p-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
            aria-label={status === 'on-hold' ? 'Resume project' : 'Pause project'}
          >
            {status === 'on-hold' ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
