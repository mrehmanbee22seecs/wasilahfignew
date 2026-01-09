import React, { useState } from 'react';
import { X, MapPin, Camera, Calendar, Info, AlertTriangle, ExternalLink } from 'lucide-react';

/**
 * EXIF Metadata Viewer
 * 
 * Displays detailed EXIF metadata for images including:
 * - GPS coordinates with map link
 * - Camera information
 * - Timestamp data
 * - File properties
 * - Authenticity indicators
 */

export type ExifData = {
  // GPS Data
  latitude?: number;
  longitude?: number;
  altitude?: number;
  gpsTimestamp?: string;

  // Camera Data
  make?: string;
  model?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;

  // Timestamp Data
  dateTaken?: string;
  dateModified?: string;

  // File Properties
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;

  // Authenticity
  hasBeenEdited?: boolean;
  software?: string;
  originalHash?: string;
};

export type ExifViewerProps = {
  isOpen: boolean;
  fileName: string;
  imageUrl: string;
  exifData: ExifData;
  onClose: () => void;
};

export function ExifViewer({ isOpen, fileName, imageUrl, exifData, onClose }: ExifViewerProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'location' | 'camera' | 'metadata'>('image');

  if (!isOpen) return null;

  const hasGPS = exifData.latitude !== undefined && exifData.longitude !== undefined;

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getGoogleMapsLink = () => {
    if (!hasGPS) return '';
    return `https://www.google.com/maps?q=${exifData.latitude},${exifData.longitude}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exif-viewer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0 pr-4">
            <h2 id="exif-viewer-title" className="text-lg text-gray-900 truncate">
              {fileName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">EXIF Metadata & Authenticity Check</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-6">
          {[
            { id: 'image', label: 'Image', icon: Camera },
            { id: 'location', label: 'Location', icon: MapPin },
            { id: 'camera', label: 'Camera', icon: Camera },
            { id: 'metadata', label: 'Metadata', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Image Tab */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                <img
                  src={imageUrl}
                  alt={fileName}
                  className="max-h-96 object-contain rounded"
                />
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Dimensions</p>
                  <p className="text-sm text-gray-900">
                    {exifData.width && exifData.height
                      ? `${exifData.width} × ${exifData.height}`
                      : 'Unknown'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">File Size</p>
                  <p className="text-sm text-gray-900">{formatBytes(exifData.fileSize)}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Format</p>
                  <p className="text-sm text-gray-900">{exifData.format || 'Unknown'}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Date Taken</p>
                  <p className="text-sm text-gray-900">
                    {exifData.dateTaken
                      ? new Date(exifData.dateTaken).toLocaleDateString()
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Authenticity Check */}
              <div
                className={`p-4 border rounded-lg ${
                  exifData.hasBeenEdited
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {exifData.hasBeenEdited ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`text-sm ${
                        exifData.hasBeenEdited ? 'text-amber-900' : 'text-emerald-900'
                      }`}
                    >
                      {exifData.hasBeenEdited
                        ? 'This image has been edited'
                        : 'This appears to be an original image'}
                    </p>
                    {exifData.software && (
                      <p className="text-xs text-gray-600 mt-1">
                        Software: {exifData.software}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {hasGPS ? (
                <>
                  {/* GPS Coordinates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">Latitude</p>
                      <p className="text-sm text-gray-900">{exifData.latitude?.toFixed(6)}°</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">Longitude</p>
                      <p className="text-sm text-gray-900">{exifData.longitude?.toFixed(6)}°</p>
                    </div>
                    {exifData.altitude && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase mb-1">Altitude</p>
                        <p className="text-sm text-gray-900">{exifData.altitude.toFixed(1)} m</p>
                      </div>
                    )}
                  </div>

                  {/* Map Link */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <a
                      href={getGoogleMapsLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>View location on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* GPS Timestamp */}
                  {exifData.gpsTimestamp && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">GPS Timestamp</p>
                      <p className="text-sm text-gray-900">{formatDate(exifData.gpsTimestamp)}</p>
                    </div>
                  )}

                  {/* Embedded Map Placeholder */}
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Map preview</p>
                      <p className="text-xs text-gray-500">
                        {exifData.latitude?.toFixed(4)}, {exifData.longitude?.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No GPS data available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This image does not contain location information
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <div className="space-y-6">
              {exifData.make || exifData.model ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exifData.make && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase mb-1">Camera Make</p>
                        <p className="text-sm text-gray-900">{exifData.make}</p>
                      </div>
                    )}
                    {exifData.model && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase mb-1">Camera Model</p>
                        <p className="text-sm text-gray-900">{exifData.model}</p>
                      </div>
                    )}
                    {exifData.lens && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase mb-1">Lens</p>
                        <p className="text-sm text-gray-900">{exifData.lens}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-700 mb-3">Camera Settings</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {exifData.focalLength && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase mb-1">Focal Length</p>
                          <p className="text-sm text-gray-900">{exifData.focalLength}</p>
                        </div>
                      )}
                      {exifData.aperture && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase mb-1">Aperture</p>
                          <p className="text-sm text-gray-900">{exifData.aperture}</p>
                        </div>
                      )}
                      {exifData.shutterSpeed && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase mb-1">Shutter Speed</p>
                          <p className="text-sm text-gray-900">{exifData.shutterSpeed}</p>
                        </div>
                      )}
                      {exifData.iso && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase mb-1">ISO</p>
                          <p className="text-sm text-gray-900">{exifData.iso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No camera data available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This image does not contain camera information
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetadataRow label="File Name" value={fileName} />
                <MetadataRow
                  label="File Size"
                  value={formatBytes(exifData.fileSize)}
                />
                <MetadataRow label="Format" value={exifData.format || 'Unknown'} />
                <MetadataRow
                  label="Dimensions"
                  value={
                    exifData.width && exifData.height
                      ? `${exifData.width} × ${exifData.height} px`
                      : 'Unknown'
                  }
                />
                <MetadataRow label="Date Taken" value={formatDate(exifData.dateTaken)} />
                <MetadataRow label="Date Modified" value={formatDate(exifData.dateModified)} />
                <MetadataRow
                  label="Has Been Edited"
                  value={exifData.hasBeenEdited ? 'Yes' : 'No'}
                  highlight={exifData.hasBeenEdited}
                />
                <MetadataRow label="Software" value={exifData.software || 'None'} />
              </div>

              {exifData.originalHash && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-2">File Hash (SHA-256)</p>
                  <p className="text-xs text-gray-900 font-mono break-all">
                    {exifData.originalHash}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            EXIF data is extracted directly from the image file
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function MetadataRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 border rounded-lg ${
        highlight ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <p className="text-xs text-gray-500 uppercase mb-1">{label}</p>
      <p className={`text-sm ${highlight ? 'text-amber-900' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
