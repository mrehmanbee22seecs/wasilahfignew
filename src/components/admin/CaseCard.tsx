import React from 'react';
import { AlertTriangle, FileText, Clock, User, ChevronRight } from 'lucide-react';

export type CaseStatus = 'open' | 'investigating' | 'resolved' | 'escalated';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';

export interface CaseData {
  caseId: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string;
  assignedTo?: string;
  relatedEntity: {
    type: 'ngo' | 'project' | 'volunteer';
    id: string;
    name: string;
  };
  evidenceCount: number;
  lastUpdate: string;
}

interface CaseCardProps {
  case: CaseData;
  onClick: (caseId: string) => void;
}

const statusColors: Record<CaseStatus, string> = {
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  investigating: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  escalated: 'bg-red-100 text-red-700 border-red-200',
};

const priorityColors: Record<CasePriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export function CaseCard({ case: caseData, onClick }: CaseCardProps) {
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(caseData.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <button
      onClick={() => onClick(caseData.caseId)}
      className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Open case ${caseData.caseId}: ${caseData.title}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">#{caseData.caseId}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${
                statusColors[caseData.status]
              }`}
            >
              {caseData.status}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                priorityColors[caseData.priority]
              }`}
            >
              {caseData.priority}
            </span>
          </div>
          <h3 className="text-gray-900 truncate">{caseData.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{caseData.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{caseData.evidenceCount} evidence</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>
            {daysSinceCreated === 0 ? 'Today' : `${daysSinceCreated}d ago`}
          </span>
        </div>
        {caseData.assignedTo && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{caseData.assignedTo}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Related: {caseData.relatedEntity.type} - {caseData.relatedEntity.name}
          </span>
          <span className="text-gray-400">
            Updated {new Date(caseData.lastUpdate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </button>
  );
}
