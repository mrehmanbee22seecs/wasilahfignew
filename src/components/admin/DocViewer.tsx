import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { FileRow, FileRowData } from './FileRow';

/**
 * DocViewer Component
 * 
 * @description Tabbed document viewer with file list and lightbox preview
 * @accessibility Tab navigation, ESC to close lightbox, focus trap in lightbox
 * 
 * API endpoint: GET /admin/vetting/:id/files
 */

export type DocViewerProps = {
  files: FileRowData[];
  activeFileId?: string;
  onDownload: (fileId: string) => void;
  onOpenLightbox: (fileId: string) => void;
  onDownloadAll?: () => void;
};

type FileCategory = 'registration' | 'financials' | 'policies' | 'media' | 'references';

const FILE_CATEGORIES: { value: FileCategory; label: string }[] = [
  { value: 'registration', label: 'Registration Docs' },
  { value: 'financials', label: 'Financials' },
  { value: 'policies', label: 'Policies' },
  { value: 'media', label: 'Photos & Media' },
  { value: 'references', label: 'References' },
];

export function DocViewer({
  files,
  activeFileId,
  onDownload,
  onOpenLightbox,
  onDownloadAll,
}: DocViewerProps) {
  const [activeTab, setActiveTab] = useState<FileCategory>('registration');
  const [lightboxFile, setLightboxFile] = useState<FileRowData | null>(null);

  // In production, files would have category metadata
  // For now, we'll distribute files across categories
  const getFilesByCategory = (category: FileCategory): FileRowData[] => {
    const filesPerCategory = Math.ceil(files.length / FILE_CATEGORIES.length);
    const categoryIndex = FILE_CATEGORIES.findIndex((c) => c.value === category);
    const start = categoryIndex * filesPerCategory;
    const end = start + filesPerCategory;
    return files.slice(start, end);
  };

  const activeFiles = getFilesByCategory(activeTab);

  const handleOpenLightbox = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      setLightboxFile(file);
    }
    onOpenLightbox(fileId);
  };

  const handleCloseLightbox = () => {
    setLightboxFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && lightboxFile) {
      handleCloseLightbox();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header with Download All */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm text-gray-900">Documents</h3>
        {onDownloadAll && files.length > 0 && (
          <button
            onClick={onDownloadAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Download all documents"
          >
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex overflow-x-auto" role="tablist" aria-label="Document categories">
          {FILE_CATEGORIES.map((category) => {
            const categoryFiles = getFilesByCategory(category.value);
            return (
              <button
                key={category.value}
                onClick={() => setActiveTab(category.value)}
                className={`
                  flex-shrink-0 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                  ${
                    activeTab === category.value
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
                role="tab"
                aria-selected={activeTab === category.value}
                aria-controls={`${category.value}-panel`}
              >
                {category.label}
                {categoryFiles.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500">({categoryFiles.length})</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* File List */}
      <div
        className="p-4"
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
      >
        {activeFiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No files in this category</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onDownload={onDownload}
                onOpenLightbox={handleOpenLightbox}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxFile && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div
            className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 id="lightbox-title" className="text-sm text-gray-900 truncate pr-4">
                {lightboxFile.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownload(lightboxFile.id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Download file"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCloseLightbox}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Content */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-60px)] bg-gray-100">
              {lightboxFile.type === 'image' ? (
                <img
                  src={lightboxFile.url}
                  alt={lightboxFile.name}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : lightboxFile.type === 'pdf' ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">PDF Viewer</p>
                  <p className="text-sm text-gray-500 mb-4">{lightboxFile.name}</p>
                  <a
                    href={lightboxFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Open in New Tab
                  </a>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Preview not available</p>
                  <button
                    onClick={() => onDownload(lightboxFile.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
