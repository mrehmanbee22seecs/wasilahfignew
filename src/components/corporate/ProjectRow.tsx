import React from 'react';
import { Calendar, Users, DollarSign, Eye, Edit, Pause, Play, MoreVertical } from 'lucide-react';

interface ProjectRowProps {
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
  viewMode?: 'table' | 'card';
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onTogglePause: (id: string) => void;
}

export function ProjectRow({
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
  viewMode = 'table',
  onViewDetails,
  onEdit,
  onTogglePause
}: ProjectRowProps) {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-300' },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    'on-hold': { label: 'On Hold', color: 'bg-amber-100 text-amber-700 border-amber-300' }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const budgetUtilization = budget > 0 ? (spent / budget) * 100 : 0;

  // Card View
  if (viewMode === 'card') {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-teal-600 hover:shadow-lg transition-all p-6 group">
        <div className="flex gap-4">
          {/* Thumbnail */}
          {thumbnail && (
            <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-900 mb-1 truncate group-hover:text-teal-600 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-600 text-sm">{ngoName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs ${statusConfig[status].color} flex-shrink-0 ml-3`}>
                {statusConfig[status].label}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{volunteersCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>PKR {spent.toLocaleString()} / {budget.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onViewDetails(id)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => onEdit(id)}
                className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onTogglePause(id)}
                className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors text-sm"
              >
                {status === 'on-hold' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Table View
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
      {/* Title & NGO */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {thumbnail && (
            <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0">
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-slate-900 truncate group-hover:text-teal-600 transition-colors">
              {title}
            </div>
            <div className="text-slate-600 text-sm truncate">{ngoName}</div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span className={`px-3 py-1 rounded-full border text-xs ${statusConfig[status].color} inline-block`}>
          {statusConfig[status].label}
        </span>
      </td>

      {/* Timeline */}
      <td className="py-4 px-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(startDate)}</span>
        </div>
      </td>

      {/* Progress */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-slate-600 w-12 text-right">{progress}%</span>
        </div>
      </td>

      {/* Volunteers */}
      <td className="py-4 px-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{volunteersCount}</span>
        </div>
      </td>

      {/* Budget */}
      <td className="py-4 px-4 text-sm text-slate-600">
        <div>
          <div className="text-slate-900">PKR {spent.toLocaleString()}</div>
          <div className="text-xs text-slate-500">of {budget.toLocaleString()}</div>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onViewDetails(id)}
            className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
            title="View Details"
            aria-label="View project details"
          >
            <Eye className="w-4 h-4 text-teal-600" />
          </button>
          <button
            onClick={() => onEdit(id)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="Edit"
            aria-label="Edit project"
          >
            <Edit className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => onTogglePause(id)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title={status === 'on-hold' ? 'Resume' : 'Pause'}
            aria-label={status === 'on-hold' ? 'Resume project' : 'Pause project'}
          >
            {status === 'on-hold' 
              ? <Play className="w-4 h-4 text-slate-600" />
              : <Pause className="w-4 h-4 text-slate-600" />
            }
          </button>
        </div>
      </td>
    </tr>
  );
}
