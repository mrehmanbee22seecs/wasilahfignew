import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import {
  validateImageFile,
  compressImage,
  formatFileSize,
  MAX_FILE_SIZES,
  ALLOWED_IMAGE_FORMATS,
  type OptimizedImageResult,
} from '@/utils/imageOptimization';

/**
 * Enhanced MediaUploader Component with Client-Side Optimization
 * 
 * Features:
 * - Automatic image compression before upload
 * - File validation (type, size, dimensions)
 * - Progress indicators
 * - Multiple file support
 * - Size reduction display
 * - WebP/AVIF format conversion
 * 
 * @accessibility Keyboard accessible, screen reader announcements
 */

export type OptimizedMediaFile = {
  id: string;
  originalFile: File;
  optimizedFile: File;
  preview: string;
  progress: number;
  status: 'validating' | 'compressing' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata?: {
    width: number;
    height: number;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  };
  alt?: string;
  caption?: string;
};

export type EnhancedMediaUploaderProps = {
  onUploadComplete: (files: OptimizedMediaFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  category?: keyof typeof MAX_FILE_SIZES;
  recommendedSize?: string;
  acceptedFormats?: string[];
  autoOptimize?: boolean;
  compressionQuality?: number;
  className?: string;
};

export function EnhancedMediaUploader({
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB,
  category = 'GALLERY',
  recommendedSize = '1600×900',
  acceptedFormats = ALLOWED_IMAGE_FORMATS,
  autoOptimize = true,
  compressionQuality = 0.85,
  className = '',
}: EnhancedMediaUploaderProps) {
  const [files, setFiles] = useState<OptimizedMediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const maxSize = maxSizeMB || MAX_FILE_SIZES[category];

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
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, [processFiles]);

  const processFiles = useCallback(async (fileList: File[]) => {
    // Validate file count - use functional update to access current state
    setFiles(prevFiles => {
      if (prevFiles.length + fileList.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return prevFiles; // Return without modification
      }

      // Create initial file entries
      const newFiles: OptimizedMediaFile[] = fileList.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        originalFile: file,
        optimizedFile: file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'validating' as const,
      }));

      // Process each file asynchronously
      newFiles.forEach(mediaFile => {
        processFile(mediaFile);
      });

      return [...prevFiles, ...newFiles];
    });
  }, [maxFiles, processFile]);

  const updateFile = useCallback((id: string, updates: Partial<OptimizedMediaFile>) => {
    setFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const processFile = useCallback(async (mediaFile: OptimizedMediaFile) => {
    try {
      // Step 1: Validate
      updateFile(mediaFile.id, { status: 'validating', progress: 10 });
      
      const validation = await validateImageFile(mediaFile.originalFile, {
        maxSizeMB: maxSize,
        allowedFormats: acceptedFormats,
      });

      if (!validation.valid) {
        updateFile(mediaFile.id, {
          status: 'error',
          error: validation.error,
          progress: 0,
        });
        toast.error(`${mediaFile.originalFile.name}: ${validation.error}`);
        return;
      }

      // Show warnings if any
      if (validation.warnings && validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          toast.warning(warning);
        });
      }

      // Step 2: Compress (if enabled)
      if (autoOptimize) {
        updateFile(mediaFile.id, { status: 'compressing', progress: 30 });

        const result: OptimizedImageResult = await compressImage(
          mediaFile.originalFile,
          {
            maxSizeMB: maxSize,
            quality: compressionQuality,
            maxWidthOrHeight: 1920,
          }
        );

        updateFile(mediaFile.id, {
          optimizedFile: result.file,
          metadata: {
            width: result.width,
            height: result.height,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            compressionRatio: result.compressionRatio,
          },
          progress: 60,
        });

        if (result.compressionRatio > 10) {
          toast.success(
            `${mediaFile.originalFile.name}: Reduced by ${result.compressionRatio.toFixed(0)}%`
          );
        }
      }

      // Step 3: Simulate upload
      updateFile(mediaFile.id, { status: 'uploading', progress: 70 });

      // Simulate upload progress
      await simulateUpload(mediaFile.id);

      // Step 4: Success
      updateFile(mediaFile.id, { status: 'success', progress: 100 });
      toast.success(`${mediaFile.originalFile.name} uploaded successfully`);

    } catch (error) {
      console.error('File processing error:', error);
      updateFile(mediaFile.id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Processing failed',
        progress: 0,
      });
      toast.error(`Failed to process ${mediaFile.originalFile.name}`);
    }
  }, [maxSize, acceptedFormats, autoOptimize, compressionQuality, updateFile]);

  const simulateUpload = useCallback((fileId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 70;
      const interval = setInterval(() => {
        progress += 10;
        updateFile(fileId, { progress });
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  }, [updateFile]);

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(files.filter(f => f.id !== id));
  };

  const retryFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      updateFile(id, { status: 'validating', progress: 0, error: undefined });
      processFile(file);
    }
  };

  const updateAlt = (id: string, alt: string) => {
    updateFile(id, { alt });
  };

  const updateCaption = (id: string, caption: string) => {
    updateFile(id, { caption });
  };

  const handleComplete = () => {
    const successFiles = files.filter(f => f.status === 'success');
    if (successFiles.length === 0) {
      toast.error('No files ready to upload');
      return;
    }
    onUploadComplete(successFiles);
  };

  const getStatusColor = (status: OptimizedMediaFile['status']) => {
    switch (status) {
      case 'validating':
      case 'compressing':
      case 'uploading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: OptimizedMediaFile['status']) => {
    switch (status) {
      case 'validating':
        return 'Validating...';
      case 'compressing':
        return 'Optimizing...';
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Ready';
      case 'error':
        return 'Failed';
      default:
        return '';
    }
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
          id="file-upload-enhanced"
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
              htmlFor="file-upload-enhanced"
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Click to upload
            </label>
            <span className="text-gray-600"> or drag and drop</span>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Recommended: {recommendedSize}</p>
            <p>Max size: {maxSize}MB • Formats: JPG, PNG, WebP, GIF</p>
            {autoOptimize && (
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-600">
                <Zap className="w-3 h-3" />
                <span>Auto-optimization enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Files ({files.filter(f => f.status === 'success').length}/{files.length} ready)
            </h3>
            {files.some(f => f.status === 'success') && (
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
                  {(file.status === 'validating' || file.status === 'compressing' || file.status === 'uploading') && (
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
                        {file.originalFile.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.originalFile.size)}</span>
                        {file.metadata && file.metadata.compressionRatio > 0 && (
                          <>
                            <span>→</span>
                            <span className="text-green-600 font-medium">
                              {formatFileSize(file.metadata.compressedSize)} 
                              (-{file.metadata.compressionRatio.toFixed(0)}%)
                            </span>
                          </>
                        )}
                        {file.metadata && (
                          <span>• {file.metadata.width}×{file.metadata.height}</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {file.status !== 'error' && file.status !== 'success' && (
                    <div className="mb-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${getStatusColor(file.status)}`}>
                        {getStatusText(file.status)}
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {file.status === 'error' && (
                    <div className="mb-2">
                      <p className="text-xs text-red-600 mb-1">{file.error || 'Upload failed'}</p>
                      <button
                        onClick={() => retryFile(file.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Retry
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
    </div>
  );
}
