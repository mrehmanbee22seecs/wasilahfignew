import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  type: 'approve' | 'reject';
  holdId: string;
  projectName: string;
  amount: number;
  currency: string;
  isSecondApproval?: boolean;
  onClose: () => void;
  onSubmit: (payload: { holdId: string; note?: string; reason?: string }) => Promise<void>;
}

export function ApprovalModal({
  isOpen,
  type,
  holdId,
  projectName,
  amount,
  currency,
  isSecondApproval = false,
  onClose,
  onSubmit,
}: ApprovalModalProps) {
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedConfirmText = type === 'approve' ? 'APPROVE' : 'REJECT';
  const canSubmit = confirmText === expectedConfirmText && (type === 'reject' ? reason.trim() : true);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        holdId,
        note: note.trim() || undefined,
        reason: reason.trim() || undefined,
      });
      onClose();
      // Reset form
      setNote('');
      setReason('');
      setConfirmText('');
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              type === 'approve'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {type === 'approve' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <h2
                    id="modal-title"
                    className={`text-lg ${
                      type === 'approve' ? 'text-emerald-900' : 'text-red-900'
                    }`}
                  >
                    {type === 'approve'
                      ? isSecondApproval
                        ? 'Second Approval Required'
                        : 'First Approval Required'
                      : 'Reject Payment Release'}
                  </h2>
                </div>
                <p
                  className={`text-sm ${
                    type === 'approve' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {type === 'approve'
                    ? isSecondApproval
                      ? 'This is the final approval. Payment will be released after your confirmation.'
                      : 'Your approval will move this to second approval stage.'
                    : 'This will permanently reject the payment release request.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Payment Details */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Hold ID</p>
                  <p className="text-gray-900">#{holdId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Amount</p>
                  <p className="text-gray-900">
                    {currency} {amount.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase mb-1">Project</p>
                  <p className="text-gray-900">{projectName}</p>
                </div>
              </div>
            </div>

            {/* Reason (for rejection) */}
            {type === 'reject' && (
              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Reason for Rejection <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for rejecting this payment release..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Note (optional) */}
            <div>
              <label className="text-sm text-gray-700 block mb-2">
                Additional Note {type === 'approve' && '(Optional)'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  type === 'approve'
                    ? 'Add any additional notes or comments...'
                    : 'Add any additional context...'
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  type === 'approve' ? 'focus:ring-emerald-500' : 'focus:ring-red-500'
                } resize-none`}
                rows={2}
              />
            </div>

            {/* Confirmation Input */}
            <div
              className={`p-4 rounded-lg border-2 ${
                type === 'approve'
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <p className={`text-sm mb-2 ${type === 'approve' ? 'text-emerald-900' : 'text-red-900'}`}>
                To confirm, type{' '}
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-300">
                  {expectedConfirmText}
                </span>{' '}
                below:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder={`Type ${expectedConfirmText}`}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                autoComplete="off"
              />
            </div>

            {/* Warning */}
            {type === 'approve' && isSecondApproval && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">
                  This is the final approval. Once confirmed, the payment will be immediately released
                  and this action cannot be undone.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`
                px-6 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                ${
                  type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{type === 'approve' ? 'Approve Release' : 'Reject Release'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
