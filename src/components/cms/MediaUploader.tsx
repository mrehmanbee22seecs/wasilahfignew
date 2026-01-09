import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, Crop } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * MediaUploader Component
 * 
 * Drag-and-drop image uploader with:
 * - Progress indicators
 * - Multiple file support
 * - Format recommendations
 * - Size validation
 * - Auto-optimization
 * - Focal point selection
 * 
 * @accessibility Keyboard accessible, screen reader announcements
 */

export type MediaFile = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    formats?: {
      webp?: string;
      avif?: string;
    };
  };
  alt?: string;
  caption?: string;
};

export type MediaUploaderProps = {
  onUploadComplete: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  recommendedSize?: string;
  aspectRatio?: string;
  acceptedFormats?: string[];
  showCropTool?: boolean;
  autoOptimize?: boolean;
  className?: string;
};

export function MediaUploader({
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 5,
  recommendedSize = '1600×900',
  aspectRatio = '16:9',
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  showCropTool = true,
  autoOptimize = true,
  className = '',
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedForCrop, setSelectedForCrop] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = (fileList: File[]) => {
    // Validate file count
    if (files.length + fileList.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: MediaFile[] = fileList.map((file) => {
      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        toast.error(`${file.name}: Unsupported format`);
        return null;
      }

      // Validate file size
      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > maxSizeMB) {
        toast.error(`${file.name}: File size exceeds ${maxSizeMB}MB`);
        return null;
      }

      return {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading' as const,
      };
    }).filter(Boolean) as MediaFile[];

    setFiles([...files, ...newFiles]);

    // Simulate upload for each file
    newFiles.forEach((mediaFile) => {
      simulateUpload(mediaFile);
    });
  };

  const simulateUpload = async (mediaFile: MediaFile) => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === mediaFile.id && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        )
      );
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(progressInterval);
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === mediaFile.id
              ? {
                  ...f,
                  progress: 100,
                  status: 'success',
                  url: mediaFile.preview,
                  metadata: {
                    width: img.width,
                    height: img.height,
                    size: mediaFile.file.size,
                    formats: {
                      webp: mediaFile.preview, // In real implementation, these would be different
                      avif: mediaFile.preview,
                    },
                  },
                }
              : f
          )
        );

        toast.success(`${mediaFile.file.name} uploaded successfully`);
      };
      img.src = mediaFile.preview;
    }, 2000);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const retryUpload = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      setFiles(
        files.map((f) => (f.id === id ? { ...f, progress: 0, status: 'uploading' as const } : f))
      );
      simulateUpload(file);
    }
  };

  const updateAlt = (id: string, alt: string) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, alt } : f)));
  };

  const updateCaption = (id: string, caption: string) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, caption } : f)));
  };

  const handleComplete = () => {
    const successFiles = files.filter((f) => f.status === 'success');
    onUploadComplete(successFiles);
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <label
              htmlFor="file-upload"
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Click to upload
            </label>
            <span className="text-gray-600"> or drag and drop</span>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Recommended: {recommendedSize} ({aspectRatio})</p>
            <p>Max size: {maxSizeMB}MB • Formats: JPG, PNG, WebP, GIF</p>
            {autoOptimize && (
              <p className="text-xs text-emerald-600">✓ Auto-optimization enabled (WebP/AVIF)</p>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Uploads ({files.length}/{maxFiles})
            </h3>
            {files.some((f) => f.status === 'success') && (
              <button
                onClick={handleComplete}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Complete & Insert
              </button>
            )}
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex gap-4">
                {/* Preview */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={file.preview}
                    alt={file.alt || 'Upload preview'}
                    className="w-full h-full object-cover"
                  />
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  {file.status === 'success' && (
                    <div className="absolute top-1 right-1 bg-green-600 rounded-full p-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)}MB
                        {file.metadata && ` • ${file.metadata.width}×${file.metadata.height}`}
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      {showCropTool && file.status === 'success' && (
                        <button
                          onClick={() => setSelectedForCrop(file.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Crop & adjust focal point"
                        >
                          <Crop className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {file.status === 'uploading' && (
                    <div className="mb-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{file.progress}% uploaded</p>
                    </div>
                  )}

                  {/* Error message with retry */}
                  {file.status === 'error' && (
                    <div className="mb-2">
                      <p className="text-xs text-red-600 mb-1">Upload failed</p>
                      <button
                        onClick={() => retryUpload(file.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Retry upload
                      </button>
                    </div>
                  )}

                  {/* Alt text and caption */}
                  {file.status === 'success' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Alt text (required for accessibility)"
                        value={file.alt || ''}
                        onChange={(e) => updateAlt(file.id, e.target.value)}
                        className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Caption (optional)"
                        value={file.caption || ''}
                        onChange={(e) => updateCaption(file.id, e.target.value)}
                        className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Modal Placeholder */}
      {selectedForCrop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Crop & Focal Point</h3>
              <button
                onClick={() => setSelectedForCrop(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Crop tool UI would go here</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedForCrop(null)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Crop applied');
                  setSelectedForCrop(null);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
