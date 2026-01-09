import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  Filter,
} from 'lucide-react';
import { ExportJob, ExportStatus } from './types';
import { formatFileSize } from '../../utils/exportUtils';

type ExportHistoryPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  jobs: ExportJob[];
  onDelete: (jobId: string) => void;
  onClearAll: () => void;
  onRefresh: () => void;
};

const statusConfig: Record<
  ExportStatus,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    label: 'Pending',
  },
  processing: {
    icon: <RefreshCw className="w-4 h-4 animate-spin" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    label: 'Processing',
  },
  completed: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    label: 'Completed',
  },
  failed: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: 'Failed',
  },
  cancelled: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    label: 'Cancelled',
  },
};

export function ExportHistoryPanel({
  isOpen,
  onClose,
  jobs,
  onDelete,
  onClearAll,
  onRefresh,
}: ExportHistoryPanelProps) {
  const [filterStatus, setFilterStatus] = useState<ExportStatus | 'all'>('all');

  const filteredJobs =
    filterStatus === 'all' ? jobs : jobs.filter((job) => job.status === filterStatus);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Export History</h2>
              <p className="text-sm text-gray-500">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'export' : 'exports'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex-shrink-0 ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({jobs.length})
            </button>
            {(Object.keys(statusConfig) as ExportStatus[]).map((status) => {
              const count = jobs.filter((j) => j.status === status).length;
              if (count === 0) return null;

              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex-shrink-0 ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {statusConfig[status].label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-gray-900 mb-2">No Exports Found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {filterStatus === 'all'
                  ? 'Your export history will appear here once you create an export.'
                  : `No exports with status "${statusConfig[filterStatus]?.label}".`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => {
                const config = statusConfig[job.status];

                return (
                  <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgColor} ${config.color} flex items-center justify-center`}
                      >
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm text-gray-900 truncate mb-1">{job.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{formatDate(job.createdAt)}</span>
                              <span>•</span>
                              <span className="uppercase">{job.config.format}</span>
                              {job.rowCount !== undefined && (
                                <>
                                  <span>•</span>
                                  <span>{job.rowCount.toLocaleString()} rows</span>
                                </>
                              )}
                              {job.fileSize !== undefined && (
                                <>
                                  <span>•</span>
                                  <span>{formatFileSize(job.fileSize)}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-2 py-1 text-xs rounded ${config.bgColor} ${config.color} flex items-center gap-1.5 flex-shrink-0`}
                          >
                            {config.icon}
                            {config.label}
                          </span>
                        </div>

                        {/* Progress Bar (for processing) */}
                        {job.status === 'processing' && job.progress !== undefined && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Processing...</span>
                              <span>{job.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {job.status === 'failed' && job.error && (
                          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded mb-2">
                            Error: {job.error}
                          </p>
                        )}

                        {/* Details */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Entity: {job.config.entityType}</span>
                          <span>•</span>
                          <span>{job.config.includeColumns.length} columns</span>
                          {job.createdBy && (
                            <>
                              <span>•</span>
                              <span>By: {job.createdBy}</span>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        {job.status === 'completed' && (
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => {
                                /* Re-download logic */
                              }}
                              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download Again
                            </button>
                            <button
                              onClick={() => onDelete(job.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {job.status === 'failed' && (
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => {
                                /* Retry logic */
                              }}
                              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Retry
                            </button>
                            <button
                              onClick={() => onDelete(job.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredJobs.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <p className="text-sm text-gray-600">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'export' : 'exports'} shown
            </p>
            <button
              onClick={onClearAll}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </>
  );
}
