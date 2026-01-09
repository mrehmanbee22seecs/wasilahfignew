import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

interface UploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneId: string;
  milestoneName: string;
  onUploadComplete: (milestoneId: string) => void;
}

export function UploadEvidenceModal({ 
  isOpen, 
  onClose, 
  milestoneId, 
  milestoneName,
  onUploadComplete 
}: UploadEvidenceModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUploadComplete(milestoneId);
    
    // Reset form
    setFiles([]);
    setNotes('');
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      setNotes('');
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isFormValid = files.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Upload Evidence & Mark Complete</h3>
                <p className="text-sm text-slate-600 mt-1">
                  <strong>{milestoneName}</strong> requires evidence before completion
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
            <div className="p-6 space-y-5">
              {/* Info Box */}
              <div className="flex items-start gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-blue-900 mb-1">Evidence Required</p>
                  <p className="text-xs text-blue-800">
                    Upload photos, documents, or other files that demonstrate completion of this milestone. 
                    This will be attached to the milestone record.
                  </p>
                </div>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Upload Files <span className="text-red-500">*</span>
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-teal-400 bg-teal-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-700 mb-1">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports images, documents, and videos (max 50MB each)
                  </p>
                  
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Selected Files ({files.length})
                  </label>
                  <div className="space-y-2">
                    {files.map((file, index) => {
                      const isImage = file.type.startsWith('image/');
                      
                      return (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex-shrink-0">
                            {isImage ? (
                              <ImageIcon className="w-5 h-5 text-teal-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            disabled={isUploading}
                            className="flex-shrink-0 p-1 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="evidence-notes" className="block text-sm text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="evidence-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or context about this evidence..."
                  rows={3}
                  disabled={isUploading}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm resize-none disabled:opacity-50"
                />
              </div>
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
                disabled={!isFormValid || isUploading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Upload & Mark Complete
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
