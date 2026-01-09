import React, { useState } from 'react';
import { FileText, Download, Eye, Trash2, Tag, MoreVertical, CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, Edit2 } from 'lucide-react';
import type { NGODocument, DocumentType } from '../../types/ngo';

interface DocumentRowProps {
  document: NGODocument;
  onPreview?: (doc: NGODocument) => void;
  onDownload?: (doc: NGODocument) => void;
  onDelete?: (doc: NGODocument) => void;
  onTag?: (doc: NGODocument, type: DocumentType) => void;
  onReplace?: (doc: NGODocument) => void;
  onEditMetadata?: (doc: NGODocument) => void;
}

export function DocumentRow({ document, onPreview, onDownload, onDelete, onTag, onReplace, onEditMetadata }: DocumentRowProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusConfig = () => {
    switch (document.status) {
      case 'accepted':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600 bg-emerald-50',
          label: 'Accepted',
          borderColor: 'border-emerald-200'
        };
      case 'under_review':
        return {
          icon: Clock,
          color: 'text-amber-600 bg-amber-50',
          label: 'Under Review',
          borderColor: 'border-amber-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-rose-600 bg-rose-50',
          label: 'Rejected',
          borderColor: 'border-rose-200'
        };
      case 'expired':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50',
          label: 'Expired',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: Clock,
          color: 'text-slate-600 bg-slate-50',
          label: 'Uploaded',
          borderColor: 'border-slate-200'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = () => {
    if (document.mime_type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-600" />;
    }
    if (document.mime_type.includes('image')) {
      return document.thumbnail_url ? (
        <img src={document.thumbnail_url} alt="" className="w-10 h-10 rounded object-cover" />
      ) : (
        <FileText className="w-5 h-5 text-indigo-600" />
      );
    }
    return <FileText className="w-5 h-5 text-slate-600" />;
  };

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = document.expiry_date && 
    new Date(document.expiry_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 &&
    new Date(document.expiry_date).getTime() > Date.now();

  const isExpired = document.expiry_date && new Date(document.expiry_date) < new Date();

  return (
    <div className={`bg-white border-2 rounded-xl p-4 hover:border-indigo-200 transition-all ${statusConfig.borderColor}`}>
      <div className="flex items-start gap-4">
        {/* File Icon/Thumbnail */}
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg">
          {getFileIcon()}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-slate-900 truncate mb-0.5">{document.filename}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatFileSize(document.size)}</span>
                <span>•</span>
                <span>Uploaded {formatDate(document.uploaded_at)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${statusConfig.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </div>
          </div>

          {/* Document Type Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
              <Tag className="w-3 h-3" />
              {document.type.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Expiry Warning */}
          {isExpired && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-2 border-red-200 rounded-lg text-xs text-red-700 mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Document expired on {formatDate(document.expiry_date!)}</span>
            </div>
          )}

          {isExpiringSoon && !isExpired && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border-2 border-amber-200 rounded-lg text-xs text-amber-700 mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Expires on {formatDate(document.expiry_date!)}</span>
            </div>
          )}

          {/* Document Dates */}
          {(document.issued_at || document.expiry_date) && (
            <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
              {document.issued_at && (
                <span>Issued: {formatDate(document.issued_at)}</span>
              )}
              {document.expiry_date && !isExpired && !isExpiringSoon && (
                <span>Expires: {formatDate(document.expiry_date)}</span>
              )}
            </div>
          )}

          {/* Notes */}
          {document.notes && (
            <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg mb-3">
              {document.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview?.(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label={`Preview ${document.filename}`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => onDownload?.(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={`Download ${document.filename}`}
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={() => onDelete?.(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              aria-label={`Delete ${document.filename}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
            <button
              onClick={() => onReplace?.(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label={`Replace ${document.filename}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              onClick={() => onEditMetadata?.(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label={`Edit Metadata ${document.filename}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Metadata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}