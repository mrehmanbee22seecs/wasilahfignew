import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export type BulkJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'partial';

export type BulkJob = {
  jobId: string;
  type: string;
  description: string;
  status: BulkJobStatus;
  totalItems: number;
  processedItems: number;
  successCount: number;
  failedCount: number;
  startedAt: string;
  completedAt?: string;
  errors?: { id: string; error: string }[];
  createdBy: string;
};

type BulkJobTrackerProps = {
  jobs: BulkJob[];
  onRefresh?: () => void;
  onDownloadReport?: (jobId: string) => void;
};

const statusConfig: Record<BulkJobStatus, {
  label: string;
  color: string;
  icon: React.ReactNode;
}> = {
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <Clock className="w-4 h-4" />,
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Loader className="w-4 h-4 animate-spin" />,
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-4 h-4" />,
  },
  partial: {
    label: 'Partial Success',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

export function BulkJobTracker({ jobs, onRefresh, onDownloadReport }: BulkJobTrackerProps) {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const hasActiveJobs = jobs.some(
      (job) => job.status === 'pending' || job.status === 'processing'
    );

    if (hasActiveJobs) {
      const interval = setInterval(() => {
        onRefresh();
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [jobs, autoRefresh, onRefresh]);

  const toggleExpand = (jobId: string) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getProgressPercentage = (job: BulkJob) => {
    if (job.totalItems === 0) return 0;
    return Math.round((job.processedItems / job.totalItems) * 100);
  };

  const getDuration = (job: BulkJob) => {
    const start = new Date(job.startedAt);
    const end = job.completedAt ? new Date(job.completedAt) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No background jobs running</p>
        <p className="text-sm text-gray-500 mt-1">
          Bulk operations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Background Jobs</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            {jobs.filter((j) => j.status === 'processing').length} active jobs
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Auto-refresh
        </label>
      </div>

      {/* Job List */}
      <div className="space-y-2">
        {jobs.map((job) => {
          const config = statusConfig[job.status];
          const isExpanded = expandedJobs.has(job.jobId);
          const progress = getProgressPercentage(job);

          return (
            <div
              key={job.jobId}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Job Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-gray-900">{job.description}</h4>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${config.color}`}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Started {new Date(job.startedAt).toLocaleTimeString()}</span>
                      <span>•</span>
                      <span>Duration: {getDuration(job)}</span>
                      <span>•</span>
                      <span>By {job.createdBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === 'completed' && onDownloadReport && (
                      <button
                        onClick={() => onDownloadReport(job.jobId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Download report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {job.errors && job.errors.length > 0 && (
                      <button
                        onClick={() => toggleExpand(job.jobId)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>
                      {job.processedItems} / {job.totalItems} items
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        job.status === 'completed' || job.status === 'partial'
                          ? 'bg-emerald-500'
                          : job.status === 'failed'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  {job.successCount > 0 && (
                    <div className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>{job.successCount} succeeded</span>
                    </div>
                  )}
                  {job.failedCount > 0 && (
                    <div className="flex items-center gap-1 text-red-700">
                      <XCircle className="w-4 h-4" />
                      <span>{job.failedCount} failed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Details (Expandable) */}
              {isExpanded && job.errors && job.errors.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Failed Items ({job.errors.length}):
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {job.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-white border border-red-200 rounded text-xs"
                      >
                        <p className="text-gray-900">
                          <strong>ID:</strong> {error.id}
                        </p>
                        <p className="text-red-700 mt-1">{error.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
