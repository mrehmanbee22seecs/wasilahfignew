import React, { useState, useRef } from 'react';
import { Upload, X, File, Loader, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
}

interface FileUploaderProps {
  label: string;
  name: string;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  maxTotalSize?: number; // in MB
  accept?: string;
  hint?: string;
}

export function FileUploader({
  label,
  name,
  files,
  onChange,
  maxFiles = 5,
  maxSizePerFile = 5,
  maxTotalSize = 10,
  accept = '.pdf,.docx,.doc,.jpg,.jpeg,.png,.mp4',
  hint
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    setError('');

    // Check max files
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Check individual file size
    for (const file of newFiles) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizePerFile) {
        setError(`File "${file.name}" exceeds ${maxSizePerFile}MB limit`);
        return;
      }
    }

    // Check total size
    const newTotalSize = totalSize + newFiles.reduce((sum, f) => sum + f.size, 0);
    const newTotalSizeMB = newTotalSize / (1024 * 1024);
    if (newTotalSizeMB > maxTotalSize) {
      setError(`Total size exceeds ${maxTotalSize}MB limit`);
      return;
    }

    // Add files
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    onChange([...files, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
    setError('');
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <label className="block text-slate-700 mb-2">{label}</label>
      {hint && (
        <p className="text-slate-600 text-sm mb-3">{hint}</p>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragOver 
            ? 'border-teal-600 bg-teal-50 scale-[1.02]' 
            : error
              ? 'border-red-500 bg-red-50'
              : 'border-slate-300 hover:border-teal-600 hover:bg-slate-50'
          }
        `}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-transform ${isDragOver ? 'scale-110 text-teal-600' : 'text-slate-400'}`} />
        <p className="text-slate-700 mb-2">
          <span className="text-teal-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-slate-500 text-sm">
          {accept.split(',').join(', ')} (max {maxSizePerFile}MB per file)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="sr-only"
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              {file.preview ? (
                <img src={file.preview} alt={file.name} className="w-10 h-10 rounded object-cover" />
              ) : (
                <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-slate-600">
                  {getFileIcon(file.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 text-sm truncate">{file.name}</p>
                <p className="text-slate-500 text-xs">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <p className="text-slate-500 text-sm">
            Total: {totalSizeMB} MB / {maxTotalSize} MB
          </p>
        </div>
      )}
    </div>
  );
}
