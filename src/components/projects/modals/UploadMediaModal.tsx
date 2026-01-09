import React, { useState, useRef } from 'react';
import { X, Upload, Image, Video, FileText, Tag, Link as LinkIcon, Trash2, Globe, Lock, Users } from 'lucide-react';

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  milestones: Array<{ id: string; title: string }>;
  preselectedMilestone?: string | null;
}

interface FileWithPreview {
  file: File;
  preview?: string;
  tags: string[];
  milestoneId?: string;
  permission: 'public' | 'private' | 'internal';
  caption?: string;
}

export function UploadMediaModal({ isOpen, onClose, onUpload, milestones, preselectedMilestone }: UploadMediaModalProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map(file => {
      const fileWithPreview: FileWithPreview = {
        file,
        tags: [],
        permission: 'internal',
        milestoneId: preselectedMilestone || undefined
      };

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles(prev => prev.map(f => 
            f.file === file ? { ...f, preview: reader.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      return fileWithPreview;
    });

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFile = (index: number, updates: Partial<FileWithPreview>) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f));
  };

  const addTag = (index: number, tag: string) => {
    if (!tag.trim()) return;
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, tags: [...f.tags, tag.trim().toLowerCase()] } : f
    ));
  };

  const removeTag = (fileIndex: number, tagIndex: number) => {
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, tags: f.tags.filter((_, ti) => ti !== tagIndex) } : f
    ));
  };

  // Suggested tags
  const suggestedTags = ['before', 'after', 'progress', 'team', 'equipment', 'site-survey', 'training', 'volunteers', 'beneficiaries'];

  const getPermissionIcon = (permission: FileWithPreview['permission']) => {
    switch (permission) {
      case 'public':
        return Globe;
      case 'private':
        return Lock;
      case 'internal':
        return Users;
    }
  };

  const getPermissionLabel = (permission: FileWithPreview['permission']) => {
    switch (permission) {
      case 'public':
        return 'Public - Visible to everyone';
      case 'private':
        return 'Private - Only you can see';
      case 'internal':
        return 'Internal - Team members only';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onUpload(files.map(f => f.file));
    
    // Reset
    setFiles([]);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      onClose();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Upload Media</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Add photos, videos, or documents to the project
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
                />
                
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="text-slate-900 mb-1">
                  {dragActive ? 'Drop files here' : 'Drag and drop files'}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  or click to browse (images, videos, documents)
                </p>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Select Files
                </button>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm text-slate-700">
                    Files to Upload ({files.length})
                  </h4>
                  
                  {files.map((fileWithPreview, index) => {
                    const FileIcon = getFileIcon(fileWithPreview.file);
                    const [newTag, setNewTag] = useState('');

                    return (
                      <div 
                        key={index}
                        className="p-4 border-2 border-slate-200 rounded-lg space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* Preview or Icon */}
                          <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {fileWithPreview.preview ? (
                              <img 
                                src={fileWithPreview.preview} 
                                alt={fileWithPreview.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileIcon className="w-8 h-8 text-slate-400" />
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 truncate">
                              {fileWithPreview.file.name}
                            </p>
                            <p className="text-xs text-slate-600">
                              {formatFileSize(fileWithPreview.file.size)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            disabled={isUploading}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-2">
                            Tags (help categorize media)
                          </label>
                          
                          {/* Suggested Tags */}
                          {fileWithPreview.tags.length === 0 && (
                            <div className="mb-2">
                              <p className="text-xs text-slate-500 mb-1">Suggested:</p>
                              <div className="flex flex-wrap gap-1">
                                {suggestedTags.slice(0, 6).map(tag => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => addTag(index, tag)}
                                    disabled={isUploading}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs hover:bg-teal-100 hover:text-teal-700 transition-colors disabled:opacity-50"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {fileWithPreview.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(index, tagIndex)}
                                  disabled={isUploading}
                                  className="hover:text-teal-900"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addTag(index, newTag);
                                  setNewTag('');
                                }
                              }}
                              placeholder="Add custom tag (press Enter)"
                              disabled={isUploading}
                              className="flex-1 px-2 py-1 text-xs border-2 border-slate-200 rounded focus:border-teal-300 focus:outline-none disabled:opacity-50"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                addTag(index, newTag);
                                setNewTag('');
                              }}
                              disabled={isUploading || !newTag.trim()}
                              className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Caption */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-2">
                            Caption (optional)
                          </label>
                          <input
                            type="text"
                            value={fileWithPreview.caption || ''}
                            onChange={(e) => updateFile(index, { caption: e.target.value })}
                            placeholder="Brief description of this media..."
                            disabled={isUploading}
                            className="w-full px-2 py-1 text-xs border-2 border-slate-200 rounded focus:border-teal-300 focus:outline-none disabled:opacity-50"
                          />
                        </div>

                        {/* Link to Milestone */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-2 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            Link to Milestone (Optional)
                          </label>
                          <select
                            value={fileWithPreview.milestoneId || ''}
                            onChange={(e) => updateFile(index, { milestoneId: e.target.value || undefined })}
                            disabled={isUploading}
                            className="w-full px-2 py-1 text-xs border-2 border-slate-200 rounded focus:border-teal-300 focus:outline-none disabled:opacity-50"
                          >
                            <option value="">No milestone</option>
                            {milestones.map(milestone => (
                              <option key={milestone.id} value={milestone.id}>
                                {milestone.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Permission Control */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-2">
                            Visibility / Permission
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['public', 'internal', 'private'] as const).map(perm => {
                              const PermIcon = getPermissionIcon(perm);
                              return (
                                <label 
                                  key={perm}
                                  className={`flex flex-col items-center gap-1 p-2 border-2 rounded-lg cursor-pointer transition-colors ${
                                    fileWithPreview.permission === perm
                                      ? 'border-teal-300 bg-teal-50'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`permission-${index}`}
                                    value={perm}
                                    checked={fileWithPreview.permission === perm}
                                    onChange={(e) => updateFile(index, { permission: e.target.value as any })}
                                    disabled={isUploading}
                                    className="sr-only"
                                  />
                                  <PermIcon className={`w-4 h-4 ${
                                    fileWithPreview.permission === perm ? 'text-teal-600' : 'text-slate-400'
                                  }`} />
                                  <span className="text-xs text-slate-700 capitalize">{perm}</span>
                                </label>
                              );
                            })}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {getPermissionLabel(fileWithPreview.permission)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Info */}
              {files.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <Upload className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Files will be uploaded to Supabase Storage and linked to this project. 
                    Media will appear in the gallery after upload completes.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t-2 border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={files.length === 0 || isUploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}