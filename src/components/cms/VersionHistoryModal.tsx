import React, { useState } from 'react';
import { X, History, RotateCcw, User, Clock, FileText, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

/**
 * VersionHistoryModal - View and restore content versions
 * 
 * Features:
 * - List of snapshots with metadata
 * - Diff view (highlight changes)
 * - Restore previous version
 * - Audit trail integration
 * 
 * @accessibility Keyboard accessible, focus management
 */

type ContentVersion = {
  versionId: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  note: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  isCurrent?: boolean;
};

type VersionHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (versionId: string) => void;
  versions: ContentVersion[];
  contentTitle: string;
};

export function VersionHistoryModal({
  isOpen,
  onClose,
  onRestore,
  versions,
  contentTitle,
}: VersionHistoryModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleRestore = (versionId: string, versionNote: string) => {
    if (confirm(`Restore this version?\n\n"${versionNote}"\n\nCurrent version will be saved before restoring.`)) {
      onRestore(versionId);
      toast.success('Version restored successfully');
      onClose();
    }
  };

  const toggleExpand = (versionId: string) => {
    if (expandedVersions.includes(versionId)) {
      setExpandedVersions(expandedVersions.filter(id => id !== versionId));
    } else {
      setExpandedVersions([...expandedVersions, versionId]);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const renderDiff = (oldValue: string, newValue: string) => {
    // Simple word-level diff
    const oldWords = oldValue.split(' ');
    const newWords = newValue.split(' ');
    
    return (
      <div className="space-y-2">
        {/* Old version */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 font-medium mb-1">Previous:</p>
          <p className="text-sm text-gray-900">
            {oldWords.map((word, i) => {
              const isRemoved = !newWords.includes(word);
              return (
                <span
                  key={i}
                  className={isRemoved ? 'bg-red-200 text-red-900 px-0.5' : ''}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>

        {/* New version */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-700 font-medium mb-1">Updated:</p>
          <p className="text-sm text-gray-900">
            {newWords.map((word, i) => {
              const isAdded = !oldWords.includes(word);
              return (
                <span
                  key={i}
                  className={isAdded ? 'bg-green-200 text-green-900 px-0.5' : ''}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    );
  };

  // Handle ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
              <p className="text-sm text-gray-500">{contentTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showDiff}
                onChange={(e) => setShowDiff(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Show changes</span>
            </label>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {versions.map((version, index) => {
              const isExpanded = expandedVersions.includes(version.versionId);
              const hasChanges = version.changes && version.changes.length > 0;

              return (
                <div
                  key={version.versionId}
                  className={`border-2 rounded-lg transition-all ${
                    version.isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Version Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Timeline connector */}
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            version.isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {version.isCurrent ? (
                              <FileText className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-medium">{versions.length - index}</span>
                            )}
                          </div>
                          {index < versions.length - 1 && (
                            <div className="absolute top-8 left-4 w-0.5 h-8 bg-gray-200" />
                          )}
                        </div>

                        <div className="flex-1">
                          {/* Version meta */}
                          <div className="flex items-center gap-2 mb-2">
                            {version.isCurrent && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                                Current
                              </span>
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(version.createdAt)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({getTimeAgo(version.createdAt)})
                            </span>
                          </div>

                          {/* Author */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4" />
                            <span>{version.authorName}</span>
                          </div>

                          {/* Audit note */}
                          {version.note && (
                            <p className="text-sm text-gray-700 bg-gray-50 rounded p-2 border border-gray-200">
                              "{version.note}"
                            </p>
                          )}

                          {/* Change summary */}
                          {hasChanges && (
                            <div className="mt-3">
                              <button
                                onClick={() => toggleExpand(version.versionId)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                {version.changes.length} field{version.changes.length !== 1 ? 's' : ''} changed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {!version.isCurrent && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedVersion(version.versionId);
                              // In real app, would show full preview
                              toast.info('Full preview would open here');
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            title="Preview this version"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRestore(version.versionId, version.note)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restore
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expanded changes */}
                    {isExpanded && hasChanges && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {version.changes.map((change, i) => (
                          <div key={i}>
                            <p className="text-xs font-medium text-gray-700 mb-2 uppercase">
                              {change.field}
                            </p>
                            {showDiff ? (
                              renderDiff(change.oldValue, change.newValue)
                            ) : (
                              <div className="space-y-2">
                                <div className="text-sm bg-gray-50 rounded p-2 border border-gray-200">
                                  <p className="text-xs text-gray-600 mb-1">Before:</p>
                                  <p className="text-gray-900 line-clamp-2">{change.oldValue}</p>
                                </div>
                                <div className="text-sm bg-blue-50 rounded p-2 border border-blue-200">
                                  <p className="text-xs text-blue-700 mb-1">After:</p>
                                  <p className="text-gray-900 line-clamp-2">{change.newValue}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {versions.length === 0 && (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No version history available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{versions.length} version{versions.length !== 1 ? 's' : ''} saved</span>
          </div>
          <span>Versions are automatically created when content is published</span>
        </div>
      </div>
    </div>
  );
}

// Sample data generator for testing
export const mockVersions: ContentVersion[] = [
  {
    versionId: 'v4',
    createdAt: new Date().toISOString(),
    authorId: 'user1',
    authorName: 'Sarah Ahmed',
    note: 'Updated meta description and added new section on SDG alignment',
    isCurrent: true,
    changes: [
      {
        field: 'Meta Description',
        oldValue: 'Learn about CSR programs in Pakistan',
        newValue: 'Learn how to create impactful CSR programs aligned with UN SDGs in Pakistan',
      },
      {
        field: 'Body Content',
        oldValue: 'Corporate Social Responsibility is important for businesses.',
        newValue: 'Corporate Social Responsibility is essential for sustainable business growth and community impact.',
      },
    ],
  },
  {
    versionId: 'v3',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    authorId: 'user2',
    authorName: 'Ali Khan',
    note: 'Added case studies and updated statistics',
    changes: [
      {
        field: 'Title',
        oldValue: 'CSR Programs Guide',
        newValue: 'How to Create Impactful CSR Programs in Pakistan',
      },
    ],
  },
  {
    versionId: 'v2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    authorId: 'user1',
    authorName: 'Sarah Ahmed',
    note: 'Fixed typos and improved readability',
    changes: [],
  },
  {
    versionId: 'v1',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    authorId: 'user1',
    authorName: 'Sarah Ahmed',
    note: 'Initial draft created',
    changes: [],
  },
];
