import React from 'react';
import { X, Download, ExternalLink, FileText, Film } from 'lucide-react';
import type { NGODocument } from '../../../types/ngo';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: NGODocument | null;
}

export function DocumentPreviewModal({ isOpen, onClose, document }: DocumentPreviewModalProps) {
  if (!isOpen || !document) return null;

  const isPDF = document.mime_type === 'application/pdf';
  const isImage = document.mime_type.startsWith('image/');
  const isVideo = document.mime_type.startsWith('video/');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = document.thumbnail_url || document.storage_path;
    link.download = document.filename;
    link.click();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-[60] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b-2 border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex-1 min-w-0">
              <h3 id="preview-title" className="text-slate-900 truncate">{document.filename}</h3>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">
                {document.type.replace(/_/g, ' ')} • {(document.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                aria-label="Download document"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-slate-900">
            {isImage && document.thumbnail_url && (
              <div className="p-8 flex items-center justify-center min-h-full">
                <img 
                  src={document.thumbnail_url} 
                  alt={document.filename}
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                />
              </div>
            )}

            {isVideo && document.thumbnail_url && (
              <div className="p-8 flex items-center justify-center min-h-full">
                <video 
                  src={document.thumbnail_url}
                  controls
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {isPDF && (
              <div className="h-full">
                {/* Try to embed PDF, fallback to download prompt */}
                <iframe
                  src={`${document.storage_path}#toolbar=0`}
                  className="w-full h-full"
                  title={document.filename}
                  style={{ minHeight: '600px' }}
                />
              </div>
            )}

            {!isImage && !isVideo && !isPDF && (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-white mb-4">Preview not available for this file type</p>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Download to View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}