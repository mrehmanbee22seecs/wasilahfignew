import React, { useState } from 'react';
import { X, Package, Download, CheckCircle, Loader2, File, Image, FileText } from 'lucide-react';

export interface ExportJob {
  jobId: string;
  type: 'evidence_package' | 'audit_log' | 'financial_report' | 'compliance_report';
  status: 'queued' | 'processing' | 'ready' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: string;
  caseId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

interface ExportPackageGeneratorProps {
  isOpen: boolean;
  caseId?: string;
  caseName?: string;
  onClose: () => void;
  onGenerate: (config: ExportConfig) => Promise<void>;
}

interface ExportConfig {
  type: 'evidence_package' | 'audit_log' | 'financial_report' | 'compliance_report';
  caseId?: string;
  includeDocuments: boolean;
  includeImages: boolean;
  includeAuditLog: boolean;
  includeTimeline: boolean;
  format: 'zip' | 'pdf';
  dateRange?: {
    from: string;
    to: string;
  };
}

export function ExportPackageGenerator({
  isOpen,
  caseId,
  caseName,
  onClose,
  onGenerate,
}: ExportPackageGeneratorProps) {
  const [exportType, setExportType] = useState<ExportConfig['type']>('evidence_package');
  const [includeDocuments, setIncludeDocuments] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeAuditLog, setIncludeAuditLog] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [format, setFormat] = useState<'zip' | 'pdf'>('zip');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const config: ExportConfig = {
        type: exportType,
        caseId,
        includeDocuments,
        includeImages,
        includeAuditLog,
        includeTimeline,
        format,
        dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
      };
      await onGenerate(config);
      onClose();
    } catch (error) {
      console.error('Error generating export:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 id="modal-title" className="text-lg text-gray-900">
                  Generate Export Package
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {caseId && caseName && (
              <p className="text-sm text-gray-600 mt-1">
                For Case: {caseName} (#{caseId})
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Export Type */}
            <div>
              <label className="text-sm text-gray-700 block mb-3">
                Export Type <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    value: 'evidence_package',
                    label: 'Evidence Package',
                    description: 'All evidence files, documents, and case notes',
                  },
                  {
                    value: 'audit_log',
                    label: 'Audit Log',
                    description: 'Complete audit trail for date range',
                  },
                  {
                    value: 'financial_report',
                    label: 'Financial Report',
                    description: 'Payment holds and releases',
                  },
                  {
                    value: 'compliance_report',
                    label: 'Compliance Report',
                    description: 'NGO vetting and compliance data',
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                      ${
                        exportType === option.value
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={exportType === option.value}
                      onChange={(e) => setExportType(e.target.value as ExportConfig['type'])}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Include Options (for evidence package) */}
            {exportType === 'evidence_package' && (
              <div>
                <label className="text-sm text-gray-700 block mb-3">Include in Package</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDocuments}
                      onChange={(e) => setIncludeDocuments(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Documents (PDF, DOC, etc.)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeImages}
                      onChange={(e) => setIncludeImages(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <Image className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Images & Photos</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAuditLog}
                      onChange={(e) => setIncludeAuditLog(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <File className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Audit Log (CSV)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTimeline}
                      onChange={(e) => setIncludeTimeline(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <File className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Timeline Summary (PDF)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Date Range (for audit log) */}
            {exportType === 'audit_log' && (
              <div>
                <label className="text-sm text-gray-700 block mb-3">
                  Date Range <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Format */}
            <div>
              <label className="text-sm text-gray-700 block mb-3">
                Output Format <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-3">
                <label
                  className={`
                    flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors
                    ${
                      format === 'zip'
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value="zip"
                    checked={format === 'zip'}
                    onChange={(e) => setFormat(e.target.value as 'zip' | 'pdf')}
                    className="sr-only"
                  />
                  <Package className="w-4 h-4" />
                  <span className="text-sm">ZIP Archive</span>
                </label>
                <label
                  className={`
                    flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors
                    ${
                      format === 'pdf'
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value="pdf"
                    checked={format === 'pdf'}
                    onChange={(e) => setFormat(e.target.value as 'zip' | 'pdf')}
                    className="sr-only"
                  />
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">PDF Report</span>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Export packages are generated asynchronously. You'll receive a notification when it's
                ready for download.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (exportType === 'audit_log' && (!dateFrom || !dateTo))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
