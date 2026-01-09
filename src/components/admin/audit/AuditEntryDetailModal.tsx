import React, { useState } from 'react';
import { X, User, Calendar, FileText, Code, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  metadata: Record<string, any>;
  changes?: {
    field: string;
    before: any;
    after: any;
  }[];
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure';
  errorMessage?: string;
};

type AuditEntryDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  entry: AuditEntry;
  onNavigateToResource?: (resourceType: string, resourceId: string) => void;
};

export function AuditEntryDetailModal({
  isOpen,
  onClose,
  entry,
  onNavigateToResource,
}: AuditEntryDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'changes' | 'metadata'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'text-emerald-700 bg-emerald-100';
    if (action.includes('update')) return 'text-blue-700 bg-blue-100';
    if (action.includes('delete')) return 'text-red-700 bg-red-100';
    if (action.includes('approve')) return 'text-emerald-700 bg-emerald-100';
    if (action.includes('reject')) return 'text-red-700 bg-red-100';
    return 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl text-gray-900">Audit Log Entry</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {new Date(entry.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="px-6 flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            {entry.changes && entry.changes.length > 0 && (
              <button
                onClick={() => setActiveTab('changes')}
                className={`py-3 text-sm border-b-2 transition-colors ${
                  activeTab === 'changes'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Changes ({entry.changes.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab('metadata')}
              className={`py-3 text-sm border-b-2 transition-colors ${
                activeTab === 'metadata'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Metadata
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Action Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Action Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Action</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getActionColor(
                        entry.action
                      )}`}
                    >
                      {entry.action}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Outcome</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        entry.outcome === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {entry.outcome}
                    </span>
                  </div>
                  {entry.errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-900">{entry.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actor Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Actor Information</h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{entry.actor.name}</p>
                    <p className="text-xs text-gray-600">{entry.actor.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Role: <span className="text-gray-700">{entry.actor.role}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Resource Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Resource</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm text-gray-900">{entry.resourceType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {entry.resourceId}
                      </code>
                      <button
                        onClick={() => handleCopy(entry.resourceId, 'Resource ID')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedField === 'Resource ID' ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  {entry.resourceName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Name</span>
                      <span className="text-sm text-gray-900">{entry.resourceName}</span>
                    </div>
                  )}
                  {onNavigateToResource && (
                    <button
                      onClick={() => onNavigateToResource(entry.resourceType, entry.resourceId)}
                      className="w-full mt-2 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Resource
                    </button>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Technical Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IP Address</span>
                    <code className="text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {entry.ipAddress}
                    </code>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">User Agent</span>
                    <code className="text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded max-w-md text-right">
                      {entry.userAgent}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Changes Tab */}
          {activeTab === 'changes' && entry.changes && (
            <div className="space-y-3">
              {entry.changes.map((change, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm text-gray-900 mb-3">{change.field}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Before */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Before</p>
                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <pre className="text-xs text-red-900 overflow-x-auto">
                          {formatValue(change.before)}
                        </pre>
                      </div>
                    </div>
                    {/* After */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">After</p>
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                        <pre className="text-xs text-emerald-900 overflow-x-auto">
                          {formatValue(change.after)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === 'metadata' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-600">Full Metadata</h3>
                <button
                  onClick={() =>
                    handleCopy(JSON.stringify(entry.metadata, null, 2), 'Metadata')
                  }
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedField === 'Metadata' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy JSON
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs text-gray-900 bg-gray-50 p-4 rounded overflow-x-auto">
                {JSON.stringify(entry.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
