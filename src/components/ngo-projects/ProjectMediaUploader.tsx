import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, CheckCircle, AlertCircle, Loader, MapPin, Tag } from 'lucide-react';
import type { MediaUploaderProps, MediaItem, ProjectTask } from '../../types/ngo-projects';
import { toast } from 'sonner@2.0.3';

interface FileUploadState {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'queued';
  error?: string;
  uploadedMedia?: MediaItem;
  taskId?: string;
  caption?: string;
}

const MAX_SIZE_MB = 50;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

export function ProjectMediaUploader({
  projectId,
  onUploadComplete,
  onUploadError,
  maxSizeMb = MAX_SIZE_MB,
  allowedTypes = ['image', 'video'],
  requireTaskLink = false,
  availableTasks = []
}: MediaUploaderProps & { availableTasks?: ProjectTask[] }) {
  const [uploadStates, setUploadStates] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedTypes = () => {
    const types: string[] = [];
    if (allowedTypes.includes('image')) types.push(...ACCEPTED_IMAGE_TYPES);
    if (allowedTypes.includes('video')) types.push(...ACCEPTED_VIDEO_TYPES);
    return types;
  };

  const validateFile = (file: File): string | null => {
    const acceptedTypes = getAcceptedTypes();
    
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} not accepted. Please upload ${allowedTypes.join(' or ')} files.`;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxSizeMb) {
      return `File size ${sizeMb.toFixed(1)}MB exceeds maximum ${maxSizeMb}MB.`;
    }

    return null;
  };

  const generateFileId = () => {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getGeolocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  };

  const simulateUpload = async (fileState: FileUploadState): Promise<void> => {
    const id = fileState.id;

    // Get geolocation
    const coordinates = await getGeolocation();

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));

      setUploadStates(prev =>
        prev.map(state =>
          state.id === id ? { ...state, progress, status: 'uploading' } : state
        )
      );
    }

    // Create mock media item
    const mockMedia: MediaItem = {
      id: `media_${Date.now()}`,
      project_id: projectId,
      task_id: fileState.taskId,
      type: fileState.file.type.startsWith('image/') ? 'image' : 'video',
      filename: fileState.file.name,
      storage_path: `projects/${projectId}/media/${fileState.file.name}`,
      mime_type: fileState.file.type,
      size: fileState.file.size,
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'current_user',
      thumbnail_url: fileState.file.type.startsWith('image/')
        ? URL.createObjectURL(fileState.file)
        : undefined,
      metadata: {
        timestamp: new Date().toISOString(),
        location: coordinates
          ? {
              coordinates,
              city: 'Detected Location' // In production: reverse geocode
            }
          : undefined,
        device: navigator.userAgent,
        caption: fileState.caption
      }
    };

    setUploadStates(prev =>
      prev.map(state =>
        state.id === id
          ? { ...state, status: 'success', progress: 100, uploadedMedia: mockMedia }
          : state
      )
    );

    onUploadComplete(mockMedia);
    toast.success('File uploaded successfully');
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newUploadStates: FileUploadState[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);

      if (error) {
        toast.error(error);
        onUploadError?.(new Error(error));
        return;
      }

      const fileState: FileUploadState = {
        file,
        id: generateFileId(),
        progress: 0,
        status: 'pending'
      };

      newUploadStates.push(fileState);

      setTimeout(() => simulateUpload(fileState), 100);
    });

    setUploadStates(prev => [...prev, ...newUploadStates]);
  }, [projectId, onUploadComplete, onUploadError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setUploadStates(prev => prev.filter(state => state.id !== id));
  };

  const retryUpload = (fileState: FileUploadState) => {
    setUploadStates(prev =>
      prev.map(state =>
        state.id === fileState.id
          ? { ...state, status: 'pending', progress: 0, error: undefined }
          : state
      )
    );

    setTimeout(() => simulateUpload(fileState), 100);
  };

  const updateTaskLink = (id: string, taskId: string) => {
    setUploadStates(prev =>
      prev.map(state => {
        if (state.id === id) {
          if (state.uploadedMedia) {
            return {
              ...state,
              taskId,
              uploadedMedia: { ...state.uploadedMedia, task_id: taskId }
            };
          }
          return { ...state, taskId };
        }
        return state;
      })
    );
  };

  const updateCaption = (id: string, caption: string) => {
    setUploadStates(prev =>
      prev.map(state => {
        if (state.id === id) {
          if (state.uploadedMedia) {
            return {
              ...state,
              caption,
              uploadedMedia: {
                ...state.uploadedMedia,
                metadata: { ...state.uploadedMedia.metadata, caption }
              }
            };
          }
          return { ...state, caption };
        }
        return state;
      })
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload media files"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptedTypes().join(',')}
          onChange={handleFileInputChange}
          className="sr-only"
          aria-label="Select media files"
        />

        <div className="flex flex-col items-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
            ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
          </div>

          <h4 className="text-slate-900 mb-1">
            {isDragging ? 'Drop files here' : 'Upload Photos & Videos'}
          </h4>
          <p className="text-sm text-slate-600 mb-4">
            Drag & drop or click to browse
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Select Files
          </button>

          <p className="text-xs text-slate-500 mt-4">
            Accepted: {allowedTypes.join(', ').toUpperCase()} • Max {maxSizeMb}MB per file
          </p>
        </div>
      </div>

      {/* Upload List */}
      {uploadStates.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-sm text-slate-700">
            Uploads ({uploadStates.length})
          </h5>

          {uploadStates.map((fileState) => {
            const isImage = fileState.file.type.startsWith('image/');
            const isVideo = fileState.file.type.startsWith('video/');

            return (
              <div
                key={fileState.id}
                className="bg-white border-2 border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Preview/Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {fileState.status === 'success' && fileState.uploadedMedia?.thumbnail_url ? (
                      <img
                        src={fileState.uploadedMedia.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : isImage ? (
                      <ImageIcon className="w-6 h-6 text-indigo-600" />
                    ) : isVideo ? (
                      <Video className="w-6 h-6 text-purple-600" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm text-slate-900 truncate">{fileState.file.name}</h6>
                        <p className="text-xs text-slate-500">{formatFileSize(fileState.file.size)}</p>
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {fileState.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        )}
                        {fileState.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-rose-600" />
                        )}
                        {(fileState.status === 'uploading' || fileState.status === 'pending') && (
                          <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
                        )}
                      </div>

                      <button
                        onClick={() => removeFile(fileState.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {(fileState.status === 'uploading' || fileState.status === 'pending') && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>{fileState.status === 'uploading' ? 'Uploading...' : 'Preparing...'}</span>
                          <span>{fileState.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                            style={{ width: `${fileState.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Success State - Task Link & Caption */}
                    {fileState.status === 'success' && (
                      <div className="space-y-2">
                        {/* Location Info */}
                        {fileState.uploadedMedia?.metadata.location && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                            <MapPin className="w-3 h-3" />
                            <span>Location captured</span>
                          </div>
                        )}

                        {/* Task Linking */}
                        {availableTasks && availableTasks.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <select
                              value={fileState.taskId || ''}
                              onChange={(e) => updateTaskLink(fileState.id, e.target.value)}
                              className="flex-1 text-xs px-3 py-1.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                              aria-label="Link to task"
                            >
                              <option value="">Link to task (optional)</option>
                              {availableTasks.map(task => (
                                <option key={task.id} value={task.id}>
                                  {task.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Caption */}
                        <input
                          type="text"
                          value={fileState.caption || ''}
                          onChange={(e) => updateCaption(fileState.id, e.target.value)}
                          placeholder="Add caption (optional)"
                          className="w-full text-xs px-3 py-1.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Error State */}
                    {fileState.status === 'error' && (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-rose-600">{fileState.error || 'Upload failed'}</p>
                        <button
                          onClick={() => retryUpload(fileState)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
