import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { SDGBadge } from './SDGBadge';
import { toast } from 'sonner@2.0.3';

export type ApplicationPayload = {
  userId: string;
  opportunityId: string;
  why: string;
  availability: string;
  resumeUrl?: string;
  extraNotes?: string;
  createdAt?: string;
};

export type ApplyModalProps = {
  opportunityId: string;
  title: string;
  orgName: string;
  sdgs: { id: string; label: string; iconUrl?: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ApplicationPayload) => Promise<void>;
  userId?: string; // Current logged-in user ID
};

type FormErrors = {
  why?: string;
  availability?: string;
  resume?: string;
  confirm?: string;
};

export function ApplyModal({
  opportunityId,
  title,
  orgName,
  sdgs,
  isOpen,
  onClose,
  onSubmit,
  userId = 'current-user-id', // In production, get from auth context
}: ApplyModalProps) {
  const [formData, setFormData] = useState({
    why: '',
    availability: '',
    extraNotes: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate "why" field
    if (!formData.why.trim()) {
      newErrors.why = 'Please explain why you want to apply';
    } else if (formData.why.trim().length < 30) {
      newErrors.why = 'Please provide at least 30 characters';
    } else if (formData.why.length > 500) {
      newErrors.why = 'Maximum 500 characters allowed';
    }

    // Validate availability
    if (!formData.availability.trim()) {
      newErrors.availability = 'Please specify your availability';
    }

    // Validate confirmation checkbox
    if (!isConfirmed) {
      newErrors.confirm = 'Please confirm your information is correct';
    }

    // Validate file size if file is selected
    if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
      newErrors.resume = 'File size must be less than 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        resume: 'Only PDF, JPG, and PNG files are allowed',
      }));
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: 'File size must be less than 5MB',
      }));
      return;
    }

    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));

    // Simulate file upload (in production, upload to Supabase Storage)
    simulateFileUpload(file);
  };

  const simulateFileUpload = async (file: File) => {
    setUploadProgress(0);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // In production, this would be the actual uploaded file URL from Supabase Storage
          setResumeUrl(`https://cdn.wasilah.com/resumes/${file.name}`);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeUrl('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      element?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ApplicationPayload = {
        userId,
        opportunityId,
        why: formData.why,
        availability: formData.availability,
        resumeUrl: resumeUrl || undefined,
        extraNotes: formData.extraNotes || undefined,
        createdAt: new Date().toISOString(),
      };

      await onSubmit(payload);

      toast.success('Application submitted successfully', {
        description: 'Check your status in My Opportunities',
        icon: <CheckCircle2 className="w-4 h-4" />,
      });

      handleClose();
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application', {
        description: 'Please try again or contact support',
        icon: <AlertCircle className="w-4 h-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Check if form has unsaved changes
    const hasChanges =
      formData.why.trim() ||
      formData.availability.trim() ||
      formData.extraNotes.trim() ||
      resumeFile;

    if (hasChanges && !isSubmitting) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmed) return;
    }

    // Reset form
    setFormData({ why: '', availability: '', extraNotes: '' });
    setResumeFile(null);
    setResumeUrl('');
    setIsConfirmed(false);
    setErrors({});
    setUploadProgress(0);

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2
              id="apply-modal-title"
              className="text-xl text-gray-900 mb-1 truncate"
            >
              Apply for Opportunity
            </h2>
            <p className="text-sm text-gray-600 truncate">{title}</p>
            <p className="text-sm text-gray-500 truncate">{orgName}</p>
            {sdgs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sdgs.slice(0, 3).map((sdg) => (
                  <SDGBadge key={sdg.id} {...sdg} size="sm" />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Why are you applying? */}
          <div>
            <label
              htmlFor="why"
              className="block text-sm text-gray-700 mb-2"
            >
              Why are you applying? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="why"
              name="why"
              value={formData.why}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, why: e.target.value }));
                setErrors((prev) => ({ ...prev, why: undefined }));
              }}
              rows={4}
              className={`
                w-full px-4 py-3 border rounded-lg resize-none
                focus:outline-none focus:ring-2 focus:ring-emerald-500
                ${errors.why ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Share your motivation, relevant experience, and what you hope to contribute..."
              aria-describedby={errors.why ? 'why-error' : undefined}
              aria-invalid={!!errors.why}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.why && (
                <p id="why-error" className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.why}
                </p>
              )}
              <p
                className={`text-xs ${
                  formData.why.length > 500 ? 'text-red-600' : 'text-gray-500'
                } ml-auto`}
              >
                {formData.why.length}/500
              </p>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="availability"
              className="block text-sm text-gray-700 mb-2"
            >
              Your Availability <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, availability: e.target.value }));
                setErrors((prev) => ({ ...prev, availability: undefined }));
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-emerald-500
                ${errors.availability ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder='e.g., "Weekends, mornings" or "One-off event, June 15-17"'
              aria-describedby={errors.availability ? 'availability-error' : undefined}
              aria-invalid={!!errors.availability}
              disabled={isSubmitting}
            />
            {errors.availability && (
              <p id="availability-error" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.availability}
              </p>
            )}
          </div>

          {/* Resume Upload (Optional) */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Upload Resume / Proof (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              PDF, JPG, or PNG. Max 5MB.
            </p>

            {!resumeFile ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  disabled={isSubmitting}
                  aria-describedby={errors.resume ? 'resume-error' : undefined}
                />
                <label
                  htmlFor="resume-upload"
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3
                    border-2 border-dashed rounded-lg cursor-pointer
                    transition-colors
                    ${
                      errors.resume
                        ? 'border-red-300 bg-red-50 hover:bg-red-100'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Upload className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-600">
                    Click to upload file
                  </span>
                </label>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                    {uploadProgress < 100 ? (
                      <div className="mt-2">
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                            role="progressbar"
                            aria-valuenow={uploadProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Upload progress: ${uploadProgress}%`}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        Uploaded successfully
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {errors.resume && (
              <p id="resume-error" className="text-xs text-red-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.resume}
              </p>
            )}
          </div>

          {/* Additional Notes (Optional) */}
          <div>
            <label
              htmlFor="extraNotes"
              className="block text-sm text-gray-700 mb-2"
            >
              Additional Notes (Optional)
            </label>
            <textarea
              id="extraNotes"
              name="extraNotes"
              value={formData.extraNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, extraNotes: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Any other information you'd like to share..."
              disabled={isSubmitting}
            />
          </div>

          {/* Confirmation Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => {
                  setIsConfirmed(e.target.checked);
                  setErrors((prev) => ({ ...prev, confirm: undefined }));
                }}
                className={`
                  mt-1 w-4 h-4 rounded border-gray-300
                  text-emerald-600 focus:ring-emerald-500
                  ${errors.confirm ? 'border-red-500' : ''}
                `}
                disabled={isSubmitting}
                aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                aria-invalid={!!errors.confirm}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                I confirm that the information provided is accurate and complete.{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.confirm && (
              <p id="confirm-error" className="text-xs text-red-600 flex items-center gap-1 mt-2 ml-7">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.confirm}
              </p>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
