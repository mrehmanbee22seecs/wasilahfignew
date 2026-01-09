import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Video, File, Download, ExternalLink, X } from 'lucide-react';

export interface EvidenceItem {
  id: string;
  type: 'image' | 'video' | 'document' | 'link';
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size?: string;
  thumbnail?: string;
  caption?: string;
}

interface EvidenceGalleryProps {
  items: EvidenceItem[];
  onDownload: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function EvidenceGallery({ items, onDownload, onRemove }: EvidenceGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const getIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'document':
        return FileText;
      case 'link':
        return ExternalLink;
      default:
        return File;
    }
  };

  const handleView = (item: EvidenceItem) => {
    setSelectedItem(item);
    setViewerOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">No evidence uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
            >
              {/* Thumbnail/Preview */}
              <button
                onClick={() => handleView(item)}
                className="w-full aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View ${item.name}`}
              >
                {item.thumbnail && item.type === 'image' ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon className="w-12 h-12 text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm">
                    View
                  </span>
                </div>
              </button>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm text-gray-900 truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.size && `${item.size} • `}
                  {item.uploadedBy}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item.id);
                  }}
                  className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Download"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screen Viewer Modal */}
      {viewerOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setViewerOpen(false)}
        >
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          <div
            className="max-w-6xl max-h-[90vh] w-full flex flex-col bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Viewer Content */}
            <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-8">
              {selectedItem.type === 'image' && selectedItem.url && (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {selectedItem.type === 'video' && selectedItem.url && (
                <video
                  src={selectedItem.url}
                  controls
                  className="max-w-full max-h-full"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {selectedItem.type === 'document' && (
                <div className="text-center">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 mb-2">{selectedItem.name}</p>
                  <button
                    onClick={() => onDownload(selectedItem.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download Document
                  </button>
                </div>
              )}
              {selectedItem.type === 'link' && (
                <div className="text-center">
                  <ExternalLink className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 mb-2">{selectedItem.name}</p>
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Open Link
                  </a>
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <h3 className="text-gray-900 mb-1">{selectedItem.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Uploaded by {selectedItem.uploadedBy}</span>
                <span>•</span>
                <span>{new Date(selectedItem.uploadedAt).toLocaleString()}</span>
                {selectedItem.size && (
                  <>
                    <span>•</span>
                    <span>{selectedItem.size}</span>
                  </>
                )}
              </div>
              {selectedItem.caption && (
                <p className="text-sm text-gray-700 mt-2">{selectedItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
