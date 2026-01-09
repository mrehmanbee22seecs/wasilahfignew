import React from 'react';
import { Eye, UserPlus, AlertTriangle, Circle } from 'lucide-react';

/**
 * QueueRow Component
 * 
 * @description Row component for moderation queue displaying NGO vetting request
 * @accessibility Keyboard navigable, focus indicators, aria-labels
 * 
 * Props defined in type below
 * 
 * Supabase mapping:
 * - vetting_requests table
 * - Fields: id, ngo_id, submitted_by, status, score, risk_level, assigned_to
 */

export type QueueRowProps = {
  vettingId: string;
  ngoName: string;
  regNumber?: string;
  submittedAt: string;
  score: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'conditional' | 'approved' | 'rejected';
  assignedTo?: string; // reviewer name
  notesPreview?: string;
  isSelected?: boolean;
  onPreview: (vettingId: string) => void;
  onAssign: (vettingId: string) => void;
  onMarkUrgent: (vettingId: string) => void;
  onSelect?: (vettingId: string, selected: boolean) => void;
};

export function QueueRow({
  vettingId,
  ngoName,
  regNumber,
  submittedAt,
  score,
  riskLevel,
  status,
  assignedTo,
  notesPreview,
  isSelected = false,
  onPreview,
  onAssign,
  onMarkUrgent,
  onSelect,
}: QueueRowProps) {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'conditional':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getScoreColor = () => {
    if (score >= 75) return 'text-emerald-600 border-emerald-600';
    if (score >= 50) return 'text-amber-600 border-amber-600';
    return 'text-red-600 border-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <tr
      className={`
        group relative bg-white transition-all duration-150
        hover:bg-blue-50
        ${isSelected ? 'bg-blue-50' : ''}
      `}
      role="row"
      aria-label={`Vetting request for ${ngoName}, score ${score}, ${riskLevel} risk`}
    >
      {/* Checkbox for bulk selection */}
      {onSelect && (
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(vettingId, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            aria-label={`Select ${ngoName}`}
          />
        </td>
      )}

      {/* NGO Name & Registration */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{ngoName}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {regNumber && (
              <span className="text-xs text-gray-500">#{regNumber}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </td>

      {/* Submitted Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formatDate(submittedAt)}
      </td>

      {/* SLA (placeholder - can calculate based on submitted date) */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs text-gray-500">2d left</span>
      </td>

      {/* Score Circle */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          className={`
            inline-flex items-center justify-center w-10 h-10 rounded-full border-2
            ${getScoreColor()}
          `}
          aria-label={`Score: ${score} out of 100`}
        >
          <span className="text-sm font-medium">{score}</span>
        </div>
      </td>

      {/* Risk Level */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-xs px-2 py-1 border rounded-full ${getRiskColor()}`}>
          {riskLevel.toUpperCase()}
        </span>
      </td>

      {/* Assigned To */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {assignedTo ? (
          <span className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-current text-emerald-500" />
            {assignedTo}
          </span>
        ) : (
          <span className="text-gray-400">Unassigned</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onPreview(vettingId)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Preview vetting for ${ngoName}`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAssign(vettingId)}
            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label={`Assign vetting for ${ngoName}`}
            title="Assign"
          >
            <UserPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMarkUrgent(vettingId)}
            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={`Mark urgent for ${ngoName}`}
            title="Mark Urgent"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}