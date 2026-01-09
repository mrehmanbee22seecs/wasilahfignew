import React from 'react';
import { CheckCircle, XCircle, AlertCircle, UserPlus, FileText, Download } from 'lucide-react';

/**
 * AuditLogEntry Component
 * 
 * @description Display audit log entry with icon, actor, action, and timestamp
 * @accessibility Semantic HTML, proper time element
 * 
 * Supabase mapping:
 * - audit_logs table
 * - Fields: id, resource_type, resource_id, action, actor_id, actor_name, timestamp, details (jsonb)
 * 
 * Details JSON should include:
 * {
 *   "previousStatus": "pending",
 *   "newStatus": "approved",
 *   "reason": "All docs verified",
 *   "conditions": [],
 *   "deadline": null,
 *   "filesChecked": ["reg.pdf"],
 *   "force": false,
 *   "notifyClients": true
 * }
 */

export type AuditLogEntryData = {
  id: string;
  resourceType: 'vetting' | 'project' | 'ngo';
  resourceId: string;
  action: 'approve' | 'conditional' | 'reject' | 'assign' | 'note' | 'download';
  actorId: string;
  actorName: string;
  timestamp: string;
  details?: Record<string, any>;
};

export type AuditLogEntryProps = {
  entry: AuditLogEntryData;
  compact?: boolean;
};

export function AuditLogEntry({ entry, compact = false }: AuditLogEntryProps) {
  const getActionIcon = () => {
    switch (entry.action) {
      case 'approve':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'reject':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'conditional':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'assign':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'note':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = () => {
    switch (entry.action) {
      case 'approve':
        return 'bg-emerald-50 border-emerald-200';
      case 'reject':
        return 'bg-red-50 border-red-200';
      case 'conditional':
        return 'bg-amber-50 border-amber-200';
      case 'assign':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getActionText = () => {
    const actionMap: Record<string, string> = {
      approve: 'Approved',
      reject: 'Rejected',
      conditional: 'Marked as Conditional',
      assign: 'Assigned',
      note: 'Added Note',
      download: 'Downloaded Files',
    };
    return actionMap[entry.action] || entry.action;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (compact) {
    return (
      <div className="flex items-start gap-2 py-2" role="article">
        <div className="flex-shrink-0 mt-0.5">{getActionIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{entry.actorName}</span>{' '}
            <span className="text-gray-600">{getActionText().toLowerCase()}</span>
          </p>
          <time
            dateTime={entry.timestamp}
            className="text-xs text-gray-500"
            aria-label={`Timestamp: ${new Date(entry.timestamp).toLocaleString()}`}
          >
            {formatTimestamp(entry.timestamp)}
          </time>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 border rounded-lg ${getActionColor()}`}
      role="article"
      aria-label={`Audit log: ${getActionText()} by ${entry.actorName}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
          {getActionIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">{entry.actorName}</span>{' '}
                <span className="text-gray-600">{getActionText().toLowerCase()}</span>
              </p>
              <time
                dateTime={entry.timestamp}
                className="text-xs text-gray-500"
                aria-label={`Timestamp: ${new Date(entry.timestamp).toLocaleString()}`}
              >
                {formatTimestamp(entry.timestamp)} •{' '}
                {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>

          {/* Details */}
          {entry.details && (
            <div className="mt-2 space-y-1">
              {entry.details.reason && (
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Reason:</span> {entry.details.reason}
                </p>
              )}

              {entry.details.conditions && entry.details.conditions.length > 0 && (
                <div className="text-xs text-gray-700">
                  <span className="font-medium">Conditions:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {entry.details.conditions.map((condition: string, index: number) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.details.deadline && (
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Deadline:</span>{' '}
                  {new Date(entry.details.deadline).toLocaleDateString()}
                </p>
              )}

              {entry.details.force && (
                <p className="text-xs text-red-700 font-medium">⚠️ Force approved (override)</p>
              )}

              {entry.details.previousStatus && entry.details.newStatus && (
                <p className="text-xs text-gray-600">
                  Status: {entry.details.previousStatus} → {entry.details.newStatus}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
