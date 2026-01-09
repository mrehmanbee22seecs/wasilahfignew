import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Info } from 'lucide-react';
import type { DocumentChecklistItem } from '../../types/ngo';

interface DocumentChecklistProps {
  items: DocumentChecklistItem[];
  onItemClick?: (item: DocumentChecklistItem) => void;
  highlightMissing?: boolean;
}

export function DocumentChecklist({ items, onItemClick, highlightMissing = false }: DocumentChecklistProps) {
  const getStatusIcon = (status: DocumentChecklistItem['status']) => {
    switch (status) {
      case 'uploaded':
        return { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'under_review':
        return { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' };
      case 'accepted':
        return { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
      case 'expired':
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'missing':
        return { icon: XCircle, color: 'text-slate-400', bgColor: 'bg-slate-50' };
      default:
        return { icon: Clock, color: 'text-slate-400', bgColor: 'bg-slate-50' };
    }
  };

  const getStatusLabel = (status: DocumentChecklistItem['status']) => {
    switch (status) {
      case 'uploaded':
        return 'Uploaded';
      case 'under_review':
        return 'Under Review';
      case 'accepted':
        return 'Accepted';
      case 'expired':
        return 'Expired';
      case 'missing':
        return 'Missing';
      default:
        return status;
    }
  };

  const requiredCount = items.filter(item => item.required).length;
  const completedCount = items.filter(item => item.required && (item.status === 'uploaded' || item.status === 'accepted')).length;
  const completionPercentage = (completedCount / requiredCount) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-900">Document Checklist</h3>
          <span className="text-sm text-indigo-700">
            {completedCount} of {requiredCount} required
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-indigo-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Document checklist ${completionPercentage.toFixed(0)}% complete`}
          />
        </div>
        
        <p className="text-xs text-indigo-600 mt-2">
          {completionPercentage === 100 
            ? '✓ All required documents uploaded!' 
            : `${(100 - completionPercentage).toFixed(0)}% remaining`
          }
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item, index) => {
          const { icon: Icon, color, bgColor } = getStatusIcon(item.status);
          const isComplete = item.status === 'uploaded' || item.status === 'accepted';
          const isExpired = item.status === 'expired';
          const isMissing = item.status === 'missing';

          return (
            <div
              key={index}
              onClick={() => onItemClick?.(item)}
              className={`
                p-4 rounded-xl border-2 transition-all cursor-pointer
                ${isComplete ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300' : ''}
                ${isExpired ? 'bg-red-50/30 border-red-200 hover:border-red-300' : ''}
                ${isMissing && !highlightMissing ? 'bg-white border-slate-200 hover:border-indigo-300' : ''}
                ${isMissing && highlightMissing ? 'bg-rose-50 border-rose-400 animate-pulse' : ''}
              `}
              role="button"
              tabIndex={0}
              aria-label={`${item.label} - ${getStatusLabel(item.status)}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onItemClick?.(item);
                }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm text-slate-900">{item.label}</h4>
                        {item.required && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                    </div>

                    {/* Status Badge */}
                    <span className={`
                      flex-shrink-0 text-xs px-2 py-1 rounded-lg font-medium
                      ${isComplete ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${isExpired ? 'bg-red-100 text-red-700' : ''}
                      ${isMissing ? 'bg-slate-100 text-slate-600' : ''}
                    `}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  {/* Document Count */}
                  {item.documents && item.documents.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>{item.documents.length} document{item.documents.length > 1 ? 's' : ''} uploaded</span>
                    </div>
                  )}

                  {/* Expiry Warning */}
                  {isExpired && (
                    <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                      <AlertCircle className="w-3 h-3" />
                      <span>Document expired - please upload a new one</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm text-blue-900 mb-1">Need help with documents?</h4>
          <p className="text-xs text-blue-700">
            All documents should be clear, legible, and current. If you have questions about specific requirements, 
            please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}