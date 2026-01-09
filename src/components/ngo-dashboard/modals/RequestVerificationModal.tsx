import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import type { DocumentChecklistItem } from '../../../types/ngo';

interface RequestVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => Promise<void>;
  checklist: DocumentChecklistItem[];
  notes?: string;
  setNotes?: (notes: string) => void;
}

export function RequestVerificationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  checklist,
  notes: externalNotes,
  setNotes: setExternalNotes
}: RequestVerificationModalProps) {
  const [notes, setNotes] = useState(externalNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync external notes with local state
  useEffect(() => {
    if (externalNotes !== undefined) {
      setNotes(externalNotes);
    }
  }, [externalNotes]);

  // Update external notes when local notes change
  const handleNotesChange = (value: string) => {
    setNotes(value);
    setExternalNotes?.(value);
  };

  if (!isOpen) return null;

  const requiredItems = checklist.filter(item => item.required);
  const completedItems = requiredItems.filter(item => 
    item.status === 'uploaded' || item.status === 'accepted'
  );
  const missingItems = requiredItems.filter(item => item.status === 'missing');
  const expiredItems = checklist.filter(item => item.status === 'expired');
  
  const canSubmit = missingItems.length === 0 && expiredItems.length === 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(notes);
      onClose();
    } catch (error) {
      console.error('Failed to submit verification request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-verification-title"
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="request-verification-title" className="mb-1">
                  Request Verification
                </h2>
                <p className="text-sm text-indigo-100">
                  Submit your organization for Wasilah verification
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Status Summary */}
            <div className={`
              p-4 rounded-xl border-2 mb-6
              ${canSubmit ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}
            `}>
              <div className="flex items-start gap-3">
                {canSubmit ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`text-sm mb-1 ${canSubmit ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {canSubmit ? 'Ready to Submit' : 'Action Required'}
                  </h3>
                  <p className={`text-sm ${canSubmit ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {canSubmit
                      ? `All ${requiredItems.length} required documents uploaded. Your organization is ready for verification.`
                      : `Please upload ${missingItems.length + expiredItems.length} missing or expired document(s) before submitting.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="mb-6">
              <h3 className="text-sm text-slate-700 mb-3">
                {canSubmit ? 'Documents to be Submitted' : 'Document Checklist'}
              </h3>
              <div className="space-y-2">
                {requiredItems.map((item, index) => {
                  const isComplete = item.status === 'uploaded' || item.status === 'accepted';
                  const isExpired = item.status === 'expired';

                  return (
                    <div 
                      key={index} 
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                        ${isComplete ? 'bg-emerald-50 border-emerald-200' : ''}
                        ${isExpired ? 'bg-red-50 border-red-200' : ''}
                        ${!isComplete && !isExpired ? 'bg-slate-50 border-slate-200' : ''}
                      `}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : isExpired ? (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm flex-1 ${isComplete ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.label}
                      </span>
                      {isExpired && (
                        <span className="ml-auto text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Expired</span>
                      )}
                      {isComplete && (
                        <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">Ready</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Items Warning */}
            {!canSubmit && missingItems.length > 0 && (
              <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl">
                <h4 className="text-sm text-rose-900 mb-2">Missing Documents</h4>
                <ul className="space-y-1">
                  {missingItems.map((item, index) => (
                    <li key={index} className="text-sm text-rose-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expired Items Warning */}
            {!canSubmit && expiredItems.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <h4 className="text-sm text-red-900 mb-2">Expired Documents</h4>
                <ul className="space-y-1">
                  {expiredItems.map((item, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {canSubmit && (
              <div className="mb-6">
                <label htmlFor="verification-notes" className="block text-sm text-slate-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="verification-notes"
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add any additional information for the vetting team..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-300 focus:outline-none resize-none"
                />
              </div>
            )}

            {/* What Happens Next */}
            {canSubmit && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <h4 className="text-sm text-blue-900 mb-2">What happens next?</h4>
                <ul className="space-y-1.5 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Our vetting team will review your documents (typically 2-3 business days)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>We may request additional information or clarification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>A site visit will be scheduled to verify your operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>You'll receive a decision and vetting score within 7-10 business days</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm text-slate-700 hover:bg-white rounded-lg border-2 border-slate-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`
                px-6 py-2.5 text-sm text-white rounded-lg transition-all flex items-center gap-2
                ${canSubmit && !isSubmitting
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg'
                  : 'bg-slate-300 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Verification Request'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}