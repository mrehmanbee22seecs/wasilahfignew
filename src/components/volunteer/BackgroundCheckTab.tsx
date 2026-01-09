import React, { useState } from 'react';
import { 
  Shield, CheckCircle, Clock, AlertTriangle, Upload, 
  FileText, Trash2, ExternalLink, Info, XCircle 
} from 'lucide-react';
import type { BackgroundCheck, BackgroundCheckDocument, BackgroundCheckRequirement } from '../../types/volunteer-verification';
import { toast } from 'sonner@2.0.3';

interface BackgroundCheckTabProps {
  backgroundCheck: BackgroundCheck | null;
  requirements: BackgroundCheckRequirement[];
  onSubmitCheck: (checkType: BackgroundCheck['checkType'], documents: File[]) => Promise<void>;
  onUploadDocument: (file: File, type: BackgroundCheckDocument['type']) => Promise<string>;
}

export function BackgroundCheckTab({
  backgroundCheck,
  requirements,
  onSubmitCheck,
  onUploadDocument
}: BackgroundCheckTabProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getStatusBadge = (status: BackgroundCheck['status']) => {
    const configs = {
      not_started: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Not Started', icon: Shield },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: Clock },
      pending_review: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending Review', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle },
      expired: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired', icon: AlertTriangle }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocumentStatusBadge = (status: BackgroundCheckDocument['status']) => {
    const configs = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending', icon: Clock },
      verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = backgroundCheck?.expiresAt ? getDaysUntilExpiry(backgroundCheck.expiresAt) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-1">Background Check</h2>
        <p className="text-sm text-gray-600">
          Complete your background verification to unlock volunteer opportunities
        </p>
      </div>

      {/* Status Card */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Verification Status</h3>
              {backgroundCheck ? (
                getStatusBadge(backgroundCheck.status)
              ) : (
                <span className="text-sm text-gray-600">Not yet started</span>
              )}
            </div>
          </div>
          {!backgroundCheck || backgroundCheck.status === 'not_started' || backgroundCheck.status === 'expired' ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Start Verification
            </button>
          ) : null}
        </div>

        {/* Timeline */}
        {backgroundCheck && (
          <div className="space-y-3">
            {backgroundCheck.submittedAt && (
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-900">Submitted on {formatDate(backgroundCheck.submittedAt)}</span>
              </div>
            )}
            {backgroundCheck.reviewedAt && (
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-900">Reviewed on {formatDate(backgroundCheck.reviewedAt)}</span>
                {backgroundCheck.reviewedBy && (
                  <span className="text-gray-600">by {backgroundCheck.reviewedBy}</span>
                )}
              </div>
            )}
            {backgroundCheck.expiresAt && backgroundCheck.status === 'approved' && (
              <div className="flex items-center gap-3 text-sm">
                {isExpiringSoon ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-700 font-medium">
                      Expires in {daysUntilExpiry} days ({formatDate(backgroundCheck.expiresAt)})
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Valid until {formatDate(backgroundCheck.expiresAt)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expiring Soon Alert */}
      {isExpiringSoon && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-amber-900 font-medium mb-1">Background Check Expiring Soon</p>
              <p className="text-sm text-amber-800">
                Your verification expires in {daysUntilExpiry} days. Please submit a renewal to maintain your volunteer status.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Renew Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Alert */}
      {backgroundCheck?.status === 'rejected' && backgroundCheck.rejectionReason && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-900 font-medium mb-1">Background Check Rejected</p>
              <p className="text-sm text-red-800 mb-3">{backgroundCheck.rejectionReason}</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Resubmit Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Info */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-900 font-medium mb-1">Verification Requirements</p>
            <p className="text-sm text-blue-800 mb-2">
              All volunteers must complete a basic background check. Enhanced verification may be required for certain projects.
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Valid CNIC (required)</li>
              <li>• Character certificate (optional but recommended)</li>
              <li>• Police clearance for enhanced verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      {backgroundCheck && backgroundCheck.documents.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Submitted Documents</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {backgroundCheck.documents.map((doc) => (
              <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{doc.fileName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                        <span>•</span>
                        <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                      </div>
                      {doc.verifiedAt && doc.verifiedBy && (
                        <p className="text-xs text-green-700 mt-1">
                          Verified by {doc.verifiedBy} on {formatDate(doc.verifiedAt)}
                        </p>
                      )}
                      {doc.notes && (
                        <p className="text-xs text-gray-600 mt-1 italic">{doc.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getDocumentStatusBadge(doc.status)}
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <BackgroundCheckUploadModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={onSubmitCheck}
          onUploadDocument={onUploadDocument}
          requirements={requirements}
        />
      )}
    </div>
  );
}

// Background Check Upload Modal
function BackgroundCheckUploadModal({
  onClose,
  onSubmit,
  onUploadDocument,
  requirements
}: {
  onClose: () => void;
  onSubmit: (checkType: BackgroundCheck['checkType'], documents: File[]) => Promise<void>;
  onUploadDocument: (file: File, type: BackgroundCheckDocument['type']) => Promise<string>;
  requirements: BackgroundCheckRequirement[];
}) {
  const [checkType, setCheckType] = useState<BackgroundCheck['checkType']>('basic');
  const [uploadedFiles, setUploadedFiles] = useState<{
    type: BackgroundCheckDocument['type'];
    file: File;
  }[]>([]);
  const [uploading, setUploading] = useState(false);

  const selectedRequirement = requirements.find(r => r.checkType === checkType);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: BackgroundCheckDocument['type']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const docRequirement = selectedRequirement?.documents.find(d => d.type === docType);
    if (!docRequirement) return;

    // Validate file type
    if (!docRequirement.acceptedFormats.includes(file.type)) {
      toast.error(`Invalid file type. Please upload: ${docRequirement.acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > docRequirement.maxSizeBytes) {
      toast.error(`File too large. Maximum size: ${(docRequirement.maxSizeBytes / (1024 * 1024)).toFixed(0)}MB`);
      return;
    }

    // Remove existing file of same type
    setUploadedFiles(prev => [
      ...prev.filter(f => f.type !== docType),
      { type: docType, file }
    ]);

    toast.success(`${file.name} added`);
  };

  const handleSubmit = async () => {
    if (!selectedRequirement) return;

    // Validate required documents
    const requiredDocs = selectedRequirement.documents.filter(d => d.required);
    const missingDocs = requiredDocs.filter(
      req => !uploadedFiles.some(f => f.type === req.type)
    );

    if (missingDocs.length > 0) {
      toast.error(`Please upload all required documents: ${missingDocs.map(d => d.label).join(', ')}`);
      return;
    }

    setUploading(true);

    try {
      await onSubmit(checkType, uploadedFiles.map(f => f.file));
      toast.success('Background check submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit background check');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl text-gray-900 mb-4">Submit Background Check</h3>

        {/* Check Type Selection */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">
            Verification Type <span className="text-red-600">*</span>
          </label>
          <div className="space-y-2">
            {requirements.map((req) => (
              <label
                key={req.checkType}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  checkType === req.checkType
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="checkType"
                  value={req.checkType}
                  checked={checkType === req.checkType}
                  onChange={(e) => {
                    setCheckType(e.target.value as BackgroundCheck['checkType']);
                    setUploadedFiles([]);
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {req.checkType.replace('_', ' ')} Verification
                    </p>
                    {req.required && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{req.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Valid for {req.validityPeriod} days
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Document Upload */}
        {selectedRequirement && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Upload Documents</h4>
            <div className="space-y-4">
              {selectedRequirement.documents.map((docReq) => {
                const uploadedFile = uploadedFiles.find(f => f.type === docReq.type);
                
                return (
                  <div key={docReq.type} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">{docReq.label}</p>
                          {docReq.required && (
                            <span className="text-red-600 text-xs">*</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{docReq.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Accepted: {docReq.acceptedFormats.join(', ')} • Max: {(docReq.maxSizeBytes / (1024 * 1024)).toFixed(0)}MB
                        </p>
                      </div>
                    </div>

                    {uploadedFile ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-900">{uploadedFile.file.name}</span>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter(f => f.type !== docReq.type))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block mt-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Click to upload</p>
                        </div>
                        <input
                          type="file"
                          accept={docReq.acceptedFormats.join(',')}
                          onChange={(e) => handleFileUpload(e, docReq.type)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Important Note */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-900 font-medium mb-1">Important:</p>
          <ul className="text-xs text-amber-800 space-y-1">
            <li>• All documents must be clear and legible</li>
            <li>• Information must match your profile details</li>
            <li>• Review typically takes 2-3 business days</li>
            <li>• You'll be notified via email once approved</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {uploading ? 'Submitting...' : 'Submit for Review'}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
