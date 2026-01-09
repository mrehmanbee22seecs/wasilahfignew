import React from 'react';
import { FileText, Calendar, Building } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { DownloadButton } from './DownloadButton';
import type { Report } from '../../types/resources';

interface ReportRowProps {
  report: Report;
}

export function ReportRow({ report }: ReportRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: Report['status']) => {
    const configs = {
      final: { bg: 'bg-green-100', text: 'text-green-700', label: 'Final' },
      draft: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Draft' },
      sample: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sample' }
    };
    
    const config = configs[status];
    
    return (
      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="group bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Status & Meta */}
          <div className="flex items-center gap-3 mb-3">
            {getStatusBadge(report.status)}
            <span className="text-xs text-slate-500">{report.fileSize}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{formatDate(report.publishedAt)}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {report.title}
          </h3>

          {/* Project Name */}
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{report.projectName}</span>
          </div>

          {/* Period */}
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{report.period}</span>
          </div>

          {/* Tags & SDGs */}
          <div className="flex flex-wrap gap-2">
            <TagBadge label={report.sector} />
            {report.sdgs.length > 0 && (
              <TagBadge 
                label={`SDG ${report.sdgs.join(', ')}`} 
                variant="sdg" 
              />
            )}
            {report.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Download Action */}
        <div className="flex-shrink-0">
          <DownloadButton
            fileUrl={report.downloadUrl}
            fileName={report.title}
            variant="primary"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}

// Skeleton loading state
export function ReportRowSkeleton() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-6 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-12 bg-slate-200 rounded" />
            <div className="h-4 w-20 bg-slate-200 rounded" />
          </div>
          <div className="h-6 bg-slate-200 rounded mb-2" />
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
          <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />
          <div className="h-5 bg-slate-200 rounded w-2/3 mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="h-12 w-40 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
