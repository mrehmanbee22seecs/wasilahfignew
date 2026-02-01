import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Check, AlertCircle, Loader, Star, GripVertical } from 'lucide-react';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  isCover?: boolean;
  uploadedBytes?: number;
}

interface FileUploaderProps {
  accept: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  label?: string;
  helpText?: string;
  allowReorder?: boolean;
  allowCoverSelect?: boolean;
}

export function FileUploader({
  accept,
  maxFiles = 10,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  files,
  onFilesChange,
  label = 'Upload Files',
  helpText,
  allowReorder = true,
  allowCoverSelect = true
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${formatFileSize(maxSizeBytes)} limit`;
    }
    
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      return mimeType.match(new RegExp(type.replace('*', '.*')));
    });
    
    if (!isAccepted) {
      return `File type not supported. Accepted: ${accept}`;
    }
    
    return null;
  };

  const simulateUpload = (file: File, uploadedFile: UploadedFile) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update to success
        onFilesChange(files.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'success', progress: 100, url: URL.createObjectURL(file) }
            : f
        ));
      } else {
        // Update progress
        onFilesChange(files.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, progress }
            : f
        ));
      }
    }, 300);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const remainingSlots = maxFiles - files.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const filesToAdd = Array.from(newFiles).slice(0, remainingSlots);
    
    const uploadedFiles: UploadedFile[] = filesToAdd.map(file => {
      const error = validateFile(file);
      const id = `file_${Date.now()}_${Math.random()}`;
      
      const uploadedFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'uploading',
        progress: error ? 0 : 0,
        error: error || undefined
      };
      
      // Start upload simulation if valid
      if (!error) {
        setTimeout(() => simulateUpload(file, uploadedFile), 100);
      }
      
      return uploadedFile;
    });
    
    onFilesChange([...files, ...uploadedFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const retryUpload = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    
    onFilesChange(files.map(f => 
      f.id === id 
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ));
  };

  const isImage = (type: string) => type.startsWith('image/');

  const setCover = (id: string) => {
    onFilesChange(files.map(f => 
      f.id === id 
        ? { ...f, isCover: true }
        : { ...f, isCover: false }
    ));
  };

  const reorderFiles = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedFile);
    onFilesChange(newFiles);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === index) return;
    reorderFiles(dragIndex, index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <div>
          <label className="block text-sm text-slate-700 mb-1">
            {label}
          </label>
          {helpText && (
            <p className="text-xs text-slate-500">{helpText}</p>
          )}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all cursor-pointer
          ${isDragging 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
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
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-label="File input"
        />
        
        <div className="text-center">
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-700 mb-1">
            <span className="text-teal-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            {accept} (max {formatFileSize(maxSizeBytes)} per file, {maxFiles} files max)
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2" role="list" aria-label="Uploaded files">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg"
              role="listitem"
              draggable={allowReorder}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                ${file.status === 'success' ? 'bg-teal-100' : 
                  file.status === 'error' ? 'bg-red-100' : 'bg-slate-100'}
              `}>
                {file.status === 'uploading' && <Loader className="w-5 h-5 text-slate-600 animate-spin" />}
                {file.status === 'success' && (
                  isImage(file.type) ? (
                    file.url ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-teal-600" />
                    )
                  ) : (
                    <FileText className="w-5 h-5 text-teal-600" />
                  )
                )}
                {file.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  {file.status === 'success' && (
                    <div className="flex items-center gap-1 text-xs text-teal-600">
                      <Check className="w-3 h-3" />
                      <span>Uploaded</span>
                    </div>
                  )}
                  {file.status === 'error' && (
                    <p className="text-xs text-red-600">{file.error}</p>
                  )}
                </div>
                
                {/* Progress bar */}
                {file.status === 'uploading' && (
                  <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                      role="progressbar"
                      aria-valuenow={file.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {allowCoverSelect && (
                  <button
                    onClick={() => setCover(file.id)}
                    className={`text-xs ${file.isCover ? 'text-teal-600' : 'text-slate-400'} hover:text-teal-700 px-2 py-1`}
                    aria-label={`Set cover ${file.name}`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                {allowReorder && (
                  <GripVertical className="w-4 h-4 text-slate-400 hover:text-slate-500" />
                )}
                {file.status === 'error' && (
                  <button
                    onClick={() => retryUpload(file.id)}
                    className="text-xs text-teal-600 hover:text-teal-700 px-2 py-1"
                    aria-label={`Retry upload ${file.name}`}
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}