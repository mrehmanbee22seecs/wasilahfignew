import React from 'react';
import { CheckCircle, Circle, Lock, AlertCircle, Image } from 'lucide-react';
import type { TaskChecklistItemProps } from '../../types/ngo-projects';

export function TaskChecklistItem({ task, onToggle, onViewEvidence, disabled }: TaskChecklistItemProps) {
  const isCompleted = task.status === 'completed';
  const isBlocked = task.status === 'blocked';
  const canToggle = !disabled && !isBlocked;

  const handleToggle = () => {
    if (!canToggle) return;
    
    // If task requires evidence and has none, prevent completion
    if (!isCompleted && task.evidence_required && (task.evidence_count || 0) === 0) {
      return; // Will show warning in UI
    }
    
    onToggle(task.id, !isCompleted);
  };

  const needsEvidence = task.evidence_required && (task.evidence_count || 0) === 0 && !isCompleted;

  return (
    <div
      className={`
        p-4 rounded-xl border-2 transition-all
        ${isCompleted ? 'bg-emerald-50/30 border-emerald-200' : ''}
        ${isBlocked ? 'bg-slate-50/50 border-slate-200' : ''}
        ${!isCompleted && !isBlocked ? 'bg-white border-slate-200 hover:border-indigo-200' : ''}
        ${canToggle && !needsEvidence ? 'cursor-pointer' : ''}
      `}
      onClick={canToggle && !needsEvidence ? handleToggle : undefined}
      role="checkbox"
      aria-checked={isCompleted}
      aria-disabled={!canToggle || needsEvidence}
      tabIndex={canToggle && !needsEvidence ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canToggle && !needsEvidence) {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          ) : isBlocked ? (
            <Lock className="w-6 h-6 text-slate-400" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-400 transition-colors" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h4 className={`text-sm ${isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
              {task.title}
            </h4>
            
            {/* Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.evidence_required && (
                <span className={`
                  px-2 py-0.5 rounded text-xs border
                  ${(task.evidence_count || 0) > 0 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                  }
                `}>
                  Evidence {(task.evidence_count || 0) > 0 ? `(${task.evidence_count})` : 'Required'}
                </span>
              )}
            </div>
          </div>

          <p className={`text-xs mb-2 ${isCompleted ? 'text-slate-500' : 'text-slate-600'}`}>
            {task.description}
          </p>

          {/* Evidence Required Warning */}
          {needsEvidence && !isBlocked && (
            <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Upload evidence before marking this task complete
              </p>
            </div>
          )}

          {/* Blocked Reason */}
          {isBlocked && task.blocked_reason && (
            <div className="flex items-start gap-2 p-2 bg-slate-100 border border-slate-200 rounded-lg mb-2">
              <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">{task.blocked_reason}</p>
            </div>
          )}

          {/* Actions */}
          {task.evidence_count && task.evidence_count > 0 && onViewEvidence && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewEvidence(task.id);
              }}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <Image className="w-3.5 h-3.5" />
              <span>View {task.evidence_count} evidence file{task.evidence_count > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Completion Timestamp */}
          {isCompleted && task.completed_at && (
            <p className="text-xs text-emerald-600 mt-2">
              ✓ Completed {new Date(task.completed_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
