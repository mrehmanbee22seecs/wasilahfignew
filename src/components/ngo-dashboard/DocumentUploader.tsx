import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader, Tag, Edit2, Calendar, FileCheck, RefreshCw, WifiOff, ExternalLink, MapPin, Smartphone, Copy } from 'lucide-react';
import type { DocumentUploaderProps, FileUploadState, DocumentType } from '../../types/ngo';
import { toast } from 'sonner@2.0.3';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
const MAX_SIZE_MB = 10;
const HELP_LINK = 'https://help.wasilah.org/upload-guidelines';

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'registration_certificate', label: 'Registration Certificate' },
  { value: 'ntn_tax', label: 'NTN / Tax Document' },
  { value: 'audited_financials', label: 'Audited Financials' },
  { value: 'bank_verification', label: 'Bank Verification' },
  { value: 'safeguarding_policy', label: 'Safeguarding Policy' },
  { value: 'health_safety_sop', label: 'Health & Safety SOP' },
  { value: 'project_reports', label: 'Project Reports' },
  { value: 'other', label: 'Other' }
];

interface FileMetadata {
  issued_at?: string;
  expiry_date?: string;
  notes?: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  device?: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

interface ExtendedFileUploadState extends FileUploadState {
  metadata?: FileMetadata;
  originalName?: string; // Track original name for duplicates
  renamed?: boolean;
}

export function DocumentUploader({ 
  ngoId, 
  acceptedTypes = ACCEPTED_TYPES,
  maxSizeMb = MAX_SIZE_MB,
  onUploadComplete,
  onUploadError 
}: DocumentUploaderProps) {
  const [uploadStates, setUploadStates] = useState<ExtendedFileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingMetadata, setEditingMetadata] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, FileMetadata>>({});
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [bulkTag, setBulkTag] = useState<DocumentType | ''>('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [captureGeolocation, setCaptureGeolocation] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadQueueRef = useRef<ExtendedFileUploadState[]>([]);

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Queued uploads will resume.');
      // Retry queued uploads
      const queuedUploads = uploadStates.filter(state => state.status === 'queued');
      queuedUploads.forEach(upload => {
        simulateUpload(upload);
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Uploads will be queued.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [uploadStates]);

  const validateFile = (file: File): { valid: boolean; error?: string; errorType?: 'type' | 'size' } => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      const acceptedExtensions = acceptedTypes.map(type => {
        if (type.includes('pdf')) return 'PDF';
        if (type.includes('jpeg') || type.includes('jpg')) return 'JPG';
        if (type.includes('png')) return 'PNG';
        if (type.includes('mp4')) return 'MP4';
        return type;
      }).join(', ');
      return { 
        valid: false, 
        error: `File type "${file.type.split('/')[1]?.toUpperCase() || 'unknown'}" not supported. Please upload: ${acceptedExtensions}`,
        errorType: 'type'
      };
    }

    // Check file size
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxSizeMb) {
      return { 
        valid: false, 
        error: `File size ${sizeMb.toFixed(1)}MB exceeds maximum ${maxSizeMb}MB limit`,
        errorType: 'size'
      };
    }

    return { valid: true };
  };

  const generateFileId = () => {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const simulateUpload = async (fileState: ExtendedFileUploadState): Promise<void> => {
    const id = fileState.id;
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setUploadStates(prev => 
        prev.map(state => 
          state.id === id ? { ...state, progress, status: 'uploading' } : state
        )
      );
    }

    // Simulate successful upload
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockDoc = {
      id: `doc_${Date.now()}`,
      ngo_id: ngoId,
      type: 'other' as DocumentType,
      filename: fileState.file.name,
      storage_path: `ngos/${ngoId}/docs/${fileState.file.name}`,
      mime_type: fileState.file.type,
      size: fileState.file.size,
      uploaded_by: 'current_user',
      uploaded_at: new Date().toISOString(),
      status: 'uploaded' as const,
      thumbnail_url: fileState.file.type.startsWith('image/') 
        ? URL.createObjectURL(fileState.file)
        : undefined
    };

    setUploadStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, status: 'success', progress: 100, uploadedDoc: mockDoc } 
          : state
      )
    );

    onUploadComplete?.(mockDoc);
    toast.success('File uploaded successfully');
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newUploadStates: ExtendedFileUploadState[] = [];
    const rejected: { file: File; error: string; errorType?: 'type' | 'size' }[] = [];
    const duplicates: { file: File; existingName: string }[] = [];

    // Check for duplicates
    const existingFilenames = uploadStates.map(s => s.file.name);

    for (const file of fileArray) {
      const validationResult = validateFile(file);
      
      if (!validationResult.valid) {
        rejected.push({ 
          file, 
          error: validationResult.error || 'Unknown error', 
          errorType: validationResult.errorType 
        });
        continue;
      }

      // Check for duplicate filename
      let filename = file.name;
      let originalName = file.name;
      let renamed = false;
      
      if (existingFilenames.includes(filename)) {
        // Handle duplicate by appending timestamp
        const extension = filename.substring(filename.lastIndexOf('.'));
        const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
        const timestamp = Date.now();
        filename = `${nameWithoutExt}_${timestamp}${extension}`;
        renamed = true;
        duplicates.push({ file, existingName: originalName });
        
        // Update file object with new name (for display purposes)
        Object.defineProperty(file, 'name', {
          writable: true,
          value: filename
        });
      }

      // Capture device metadata
      const deviceMetadata: FileMetadata = {
        device: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      };

      const fileState: ExtendedFileUploadState = {
        file,
        id: generateFileId(),
        progress: 0,
        status: isOnline ? 'pending' : 'queued',
        metadata: deviceMetadata,
        originalName,
        renamed
      };

      newUploadStates.push(fileState);
      existingFilenames.push(filename);

      // Capture geolocation if enabled
      if (captureGeolocation && file.type.startsWith('image/')) {
        await captureGeolocationForFile(fileState.id, deviceMetadata);
      }
      
      // Start upload simulation or queue
      if (isOnline) {
        setTimeout(() => simulateUpload(fileState), 100);
      } else {
        uploadQueueRef.current.push(fileState);
      }
    }

    // Show duplicate warnings
    if (duplicates.length > 0) {
      toast.warning(
        <div className="space-y-1">
          <p className="font-medium">Duplicate files renamed</p>
          <p className="text-sm">
            {duplicates.length} file(s) with existing names were automatically renamed
          </p>
        </div>,
        { duration: 4000 }
      );
    }

    // Show rejection errors with help links
    if (rejected.length > 0) {
      rejected.forEach(({ file, error, errorType }) => {
        toast.error(
          <div className="space-y-1" role="alert" aria-live="assertive">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm">{error}</p>
            {errorType === 'size' && (
              <a 
                href={HELP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Learn how to compress files <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {errorType === 'type' && (
              <a 
                href={HELP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                See accepted file formats <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>,
          { duration: 6000 }
        );
      });
      onUploadError?.(new Error(`${rejected.length} file(s) rejected`));
    }

    setUploadStates(prev => [...prev, ...newUploadStates]);
  }, [ngoId, onUploadComplete, onUploadError, isOnline, uploadStates, captureGeolocation]);

  const captureGeolocationForFile = async (id: string, metadata: FileMetadata) => {
    if (!navigator.geolocation) return;

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUploadStates(prev => 
            prev.map(state => 
              state.id === id 
                ? { 
                    ...state, 
                    metadata: { 
                      ...state.metadata, 
                      geolocation: { latitude, longitude, accuracy } 
                    } 
                  } 
                : state
            )
          );
          resolve();
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          resolve();
        },
        { timeout: 5000, maximumAge: 0 }
      );
    });
  };

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
    // Reset input so same file can be uploaded again
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

  const updateDocumentType = (id: string, type: DocumentType) => {
    setUploadStates(prev => 
      prev.map(state => {
        if (state.id === id && state.uploadedDoc) {
          return {
            ...state,
            uploadedDoc: { ...state.uploadedDoc, type }
          };
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

  const toggleFileSelection = (id: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFiles(newSelection);
  };

  const handleMetadataChange = (id: string, key: keyof FileMetadata, value: string) => {
    setMetadata(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value
      }
    }));
  };

  const saveMetadata = (id: string) => {
    setEditingMetadata(null);
    // Here you can add logic to save metadata to the server if needed
    toast.success('Metadata saved');
  };

  const applyBulkTag = () => {
    if (!bulkTag) return;
    setUploadStates(prev => 
      prev.map(state => {
        if (selectedFiles.has(state.id) && state.uploadedDoc) {
          return {
            ...state,
            uploadedDoc: { ...state.uploadedDoc, type: bulkTag }
          };
        }
        return state;
      })
    );
    setBulkTag('');
    setShowBulkActions(false);
  };

  const captureGeolocationData = async (id: string) => {
    if (!captureGeolocation) return;
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    const fileState = uploadStates.find(state => state.id === id);
    if (!fileState) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;

        setMetadata(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            geolocation: { latitude, longitude, accuracy },
            device: { userAgent, platform, language }
          }
        }));
      },
      (error) => {
        toast.error(`Geolocation error: ${error.message}`);
      }
    );
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
        aria-label="Upload documents"
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
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="sr-only"
          aria-label="Select files to upload"
        />

        <div className="flex flex-col items-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
            ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
          </div>

          <h3 className="text-slate-900 mb-1">
            {isDragging ? 'Drop files here' : 'Drag & drop files'}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            or click to browse from your device
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
            Accepted formats: PDF, JPG, PNG, MP4 • Max size: {maxSizeMb}MB per file
          </p>
        </div>
      </div>

      {/* Upload List */}
      {uploadStates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-slate-700">
              Uploads ({uploadStates.length})
              {selectedFiles.size > 0 && (
                <span className="ml-2 text-indigo-600">
                  • {selectedFiles.size} selected
                </span>
              )}
            </h4>

            {/* Bulk Actions */}
            {selectedFiles.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm flex items-center gap-1"
                >
                  <Tag className="w-4 h-4" />
                  Bulk Tag
                </button>
                <button
                  onClick={() => setSelectedFiles(new Set())}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Bulk Tag Panel */}
          {showBulkActions && selectedFiles.size > 0 && (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
              <h5 className="text-sm text-indigo-900 mb-2">Apply tag to {selectedFiles.size} file(s)</h5>
              <div className="flex items-center gap-2">
                <select
                  value={bulkTag}
                  onChange={(e) => setBulkTag(e.target.value as DocumentType)}
                  className="flex-1 text-sm px-3 py-2 border-2 border-indigo-200 rounded-lg focus:border-indigo-400 focus:outline-none bg-white"
                  aria-label="Select document type for bulk tagging"
                >
                  <option value="">Select document type...</option>
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={applyBulkTag}
                  disabled={!bulkTag}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Document List */}
          <ul className="space-y-3" role="list" aria-label="Uploaded documents">
            {uploadStates.map((fileState) => (
              <li
                key={fileState.id}
                className="bg-white border-2 border-slate-200 rounded-xl p-4"
                role="listitem"
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox for Bulk Selection */}
                  {fileState.status === 'success' && (
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(fileState.id)}
                      onChange={() => toggleFileSelection(fileState.id)}
                      className="mt-3 w-4 h-4 text-indigo-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Select ${fileState.file.name}`}
                    />
                  )}

                  {/* File Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    {fileState.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : fileState.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                    ) : fileState.status === 'queued' ? (
                      <Loader className="w-5 h-5 text-amber-600" />
                    ) : fileState.status === 'uploading' ? (
                      <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm text-slate-900 truncate">
                          {fileState.file.name}
                          {fileState.renamed && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-600">
                              <Copy className="w-3 h-3" />
                              Renamed
                            </span>
                          )}
                        </h5>
                        <p className="text-xs text-slate-500">{formatFileSize(fileState.file.size)}</p>
                        
                        {/* Device Metadata Badge */}
                        {fileState.metadata?.device && (
                          <div className="flex items-center gap-1 mt-1">
                            <Smartphone className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {fileState.metadata.device.platform}
                            </span>
                          </div>
                        )}

                        {/* Geolocation Badge */}
                        {fileState.metadata?.geolocation && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs text-emerald-600">
                              Location captured (±{Math.round(fileState.metadata.geolocation.accuracy)}m)
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeFile(fileState.id)}
                        className="flex-shrink-0 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        aria-label={`Remove ${fileState.file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {(fileState.status === 'uploading' || fileState.status === 'pending') && (
                      <div className="mb-3" role="progressbar" aria-valuenow={fileState.progress} aria-valuemin={0} aria-valuemax={100}>
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

                    {/* Queued State */}
                    {fileState.status === 'queued' && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg" role="status" aria-live="polite">
                          <WifiOff className="w-4 h-4 text-amber-600" />
                          <span className="text-xs text-amber-700">Queued - Will upload when back online</span>
                        </div>
                      </div>
                    )}

                    {/* Success State - Document Type Selector */}
                    {fileState.status === 'success' && fileState.uploadedDoc && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <select
                          value={fileState.uploadedDoc.type}
                          onChange={(e) => updateDocumentType(fileState.id, e.target.value as DocumentType)}
                          className="flex-1 text-sm px-3 py-1.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                          aria-label="Select document type"
                        >
                          {DOCUMENT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Metadata Editor */}
                    {fileState.status === 'success' && (
                      <div className="mt-2">
                        <button
                          onClick={() => setEditingMetadata(fileState.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          <Edit2 className="w-4 h-4 inline-block mr-1" />
                          Edit Metadata
                        </button>

                        {editingMetadata === fileState.id && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <input
                                type="date"
                                value={metadata[fileState.id]?.issued_at || ''}
                                onChange={(e) => handleMetadataChange(fileState.id, 'issued_at', e.target.value)}
                                className="flex-1 text-sm px-3 py-1.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                                placeholder="Issued At"
                                aria-label="Issue date"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <input
                                type="date"
                                value={metadata[fileState.id]?.expiry_date || ''}
                                onChange={(e) => handleMetadataChange(fileState.id, 'expiry_date', e.target.value)}
                                className="flex-1 text-sm px-3 py-1.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                                placeholder="Expiry Date"
                                aria-label="Expiry date"
                              />
                            </div>

                            <div>
                              <textarea
                                value={metadata[fileState.id]?.notes || ''}
                                onChange={(e) => handleMetadataChange(fileState.id, 'notes', e.target.value)}
                                className="w-full text-sm px-3 py-1.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                                placeholder="Notes"
                                rows={2}
                                aria-label="Document notes"
                              />
                            </div>

                            <button
                              onClick={() => saveMetadata(fileState.id)}
                              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transition-all"
                            >
                              Save Metadata
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Error State */}
                    {fileState.status === 'error' && (
                      <div className="flex items-center justify-between" role="alert" aria-live="assertive">
                        <p className="text-xs text-rose-600">{fileState.error || 'Upload failed'}</p>
                        <button
                          onClick={() => retryUpload(fileState)}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}