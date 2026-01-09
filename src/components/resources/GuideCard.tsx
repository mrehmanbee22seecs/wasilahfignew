import React, { useState } from 'react';
import { FileText, Download, Eye, X, Check } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { DownloadButton } from './DownloadButton';
import type { CSRGuide } from '../../types/resources';

interface GuideCardProps {
  guide: CSRGuide;
}

export function GuideCard({ guide }: GuideCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileTypeIcon = () => {
    switch (guide.fileType) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'xlsx':
        return '📊';
      default:
        return '📁';
    }
  };

  return (
    <>
      <div className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all">
        {guide.coverImage && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
            <img 
              src={guide.coverImage} 
              alt="" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* File Type Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getFileTypeIcon()}</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded uppercase">
              {guide.fileType}
            </span>
            <span className="text-xs text-slate-500">{guide.fileSize}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg text-slate-900 mb-2 line-clamp-2">
            {guide.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {guide.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} label={tag} size="sm" />
            ))}
            {guide.sdgs.length > 0 && (
              <TagBadge 
                label={`SDG ${guide.sdgs.join(', ')}`} 
                variant="sdg" 
                size="sm"
              />
            )}
          </div>

          {/* Meta */}
          <div className="text-xs text-slate-500 mb-4">
            Last updated: {formatDate(guide.updatedAt)}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <DownloadButton
              fileUrl={guide.fileUrl}
              fileName={guide.title}
              variant="primary"
              className="flex-1"
            />
            {guide.tableOfContents && (
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && guide.tableOfContents && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl text-slate-900 mb-1">{guide.title}</h3>
                <p className="text-sm text-slate-600">{guide.fileType.toUpperCase()} • {guide.fileSize}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {guide.coverImage && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img src={guide.coverImage} alt={guide.title} className="w-full" />
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Table of Contents</h4>
                <ol className="space-y-2">
                  {guide.tableOfContents.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <DownloadButton
                fileUrl={guide.fileUrl}
                fileName={guide.title}
                variant="primary"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Skeleton loading state
export function GuideCardSkeleton() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
        <div className="h-6 bg-slate-200 rounded mb-2" />
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-slate-200 rounded mb-2" />
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 bg-slate-200 rounded-full" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-slate-200 rounded-lg" />
          <div className="h-10 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
