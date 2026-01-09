import React from 'react';
import { X, Clock, User, Eye, RotateCcw, Download, FileText } from 'lucide-react';

export interface PlanVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
  status: 'draft' | 'published' | 'archived';
  objectivesCount: number;
  sdgsCount: number;
  totalBudget: number;
}

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: PlanVersion[];
  currentVersionId: string;
  onViewVersion: (versionId: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onDownloadVersion: (versionId: string) => void;
}

export function VersionHistoryDrawer({
  isOpen,
  onClose,
  versions,
  currentVersionId,
  onViewVersion,
  onRestoreVersion,
  onDownloadVersion
}: VersionHistoryDrawerProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: PlanVersion['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'archived':
        return 'bg-amber-100 text-amber-700 border-amber-300';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-slate-900 text-lg">Version History</h2>
              <p className="text-slate-600 text-sm">
                {versions.length} version{versions.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close version history"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Version List */}
        <div className="p-6 space-y-4">
          {versions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No version history yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Versions will appear here when you publish your plan
              </p>
            </div>
          )}

          {versions.map((version, index) => {
            const isCurrent = version.id === currentVersionId;
            const isLatest = index === 0;

            return (
              <div
                key={version.id}
                className={`border-2 rounded-xl p-5 transition-all ${
                  isCurrent
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Version Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-900 font-medium">
                        Version {version.versionNumber}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {isLatest && !isCurrent && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Latest
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(version.status)}`}>
                        {version.status.charAt(0).toUpperCase() + version.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(version.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {version.createdBy}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Changes Summary */}
                <p className="text-slate-700 text-sm mb-4 border-l-4 border-teal-600 pl-3 py-1">
                  {version.changesSummary}
                </p>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-4 mb-4 bg-slate-50 rounded-lg p-3">
                  <div>
                    <div className="text-xs text-slate-600">Objectives</div>
                    <div className="text-slate-900 font-medium">{version.objectivesCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Target SDGs</div>
                    <div className="text-slate-900 font-medium">{version.sdgsCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Budget</div>
                    <div className="text-slate-900 font-medium">
                      {(version.totalBudget / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewVersion(version.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>

                  {!isCurrent && (
                    <button
                      onClick={() => onRestoreVersion(version.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                  )}

                  <button
                    onClick={() => onDownloadVersion(version.id)}
                    className="p-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
                    aria-label="Download version"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="sticky bottom-0 bg-slate-50 border-t-2 border-slate-200 px-6 py-4">
          <p className="text-slate-600 text-sm">
            💡 <strong>Tip:</strong> You can restore any previous version to create a new draft based on it.
          </p>
        </div>
      </div>
    </>
  );
}
