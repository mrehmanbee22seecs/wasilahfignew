import React from 'react';
import { FileText, Image as ImageIcon, Download, ExternalLink, File } from 'lucide-react';

/**
 * FileRow Component
 * 
 * @description Display file information with preview and download actions
 * @accessibility Keyboard accessible, proper ARIA labels
 * 
 * Supabase mapping:
 * - vetting_files table
 * - Fields: id, vetting_id, file_name, file_url, file_type, uploaded_by, uploaded_at, size_bytes, meta
 */

export type FileRowData = {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  sizeBytes: number;
  geoTag?: { lat: number; lng: number } | null;
};

export type FileRowProps = {
  file: FileRowData;
  onDownload: (fileId: string) => void;
  onOpenLightbox: (fileId: string) => void;
};

export function FileRow({ file, onDownload, onOpenLightbox }: FileRowProps) {
  const getFileIcon = () => {
    switch (file.type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
      role="article"
      aria-label={`File: ${file.name}, ${formatFileSize(file.sizeBytes)}`}
    >
      {/* File Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        {getFileIcon()}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm text-gray-900 truncate">{file.name}</h4>
          {file.geoTag && (
            <span 
              className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded"
              aria-label="File has location data"
            >
              GeoTagged
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatFileSize(file.sizeBytes)}</span>
          <span>•</span>
          <span>Uploaded by {file.uploadedBy}</span>
          <span>•</span>
          <span>{formatDate(file.uploadedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onOpenLightbox(file.id)}
          className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Open ${file.name} in viewer`}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDownload(file.id)}
          className="p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label={`Download ${file.name}`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
