import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * Bulk Action Modals
 * 
 * Modals for bulk operations on vetting requests:
 * - BulkApproveModal: Approve multiple requests with typed confirmation
 * - BulkConditionalModal: Conditional approval for multiple requests
 * - BulkRejectModal: Reject multiple requests
 * 
 * All require typed confirmation (e.g., "APPROVE 23") to prevent accidents
 */

// ====================
// BULK APPROVE MODAL
// ====================

export type BulkApproveModalProps = {
  isOpen: boolean;
  selectedIds: string[];
  selectedItems: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (payload: { ids: string[]; note?: string }) => Promise<void>;
};

export function BulkApproveModal({
  isOpen,
  selectedIds,
  selectedItems,
  onClose,
  onSubmit,
}: BulkApproveModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedText = `APPROVE ${selectedIds.length}`;
  const isConfirmValid = confirmText.trim() === expectedText;

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setNote('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!isConfirmValid) {
      toast.error('Confirmation text does not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ids: selectedIds,
        note: note.trim() || undefined,
      });
      toast.success(`${selectedIds.length} vetting requests approved`);
      onClose();
    } catch (error) {
      toast.error('Failed to approve requests. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-approve-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="bulk-approve-title" className="text-xl text-gray-900">
            Bulk Approve Vetting Requests
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-900">
                You are about to approve <strong>{selectedIds.length}</strong> NGO vetting requests.
                This action will grant them access to the platform.
              </p>
            </div>
          </div>

          {/* Selected Items Preview */}
          <div>
            <h3 className="text-sm text-gray-700 mb-2">Selected Items ({selectedIds.length})</h3>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 border-b border-gray-100 last:border-0 text-sm text-gray-700"
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Optional Note (will be added to all audit logs)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Batch approval for Q4 2025 vetting cycle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Typed Confirmation */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Type <strong className="text-emerald-600">{expectedText}</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2
                ${
                  confirmText && isConfirmValid
                    ? 'border-emerald-500 focus:ring-emerald-500'
                    : confirmText
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
              disabled={isSubmitting}
              autoFocus
            />
            {confirmText && !isConfirmValid && (
              <p className="text-xs text-red-600 mt-1">
                Confirmation text does not match. Expected: {expectedText}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isConfirmValid || isSubmitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Approving...' : `Approve ${selectedIds.length} Requests`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================
// BULK CONDITIONAL MODAL
// ====================

export type BulkConditionalModalProps = {
  isOpen: boolean;
  selectedIds: string[];
  selectedItems: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (payload: {
    ids: string[];
    reason: string;
    conditions: string[];
    deadline: string;
  }) => Promise<void>;
};

export function BulkConditionalModal({
  isOpen,
  selectedIds,
  selectedItems,
  onClose,
  onSubmit,
}: BulkConditionalModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  const [conditions, setConditions] = useState<string[]>(['']);
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedText = `CONDITIONAL ${selectedIds.length}`;
  const isConfirmValid = confirmText.trim() === expectedText;
  const isFormValid = reason.trim().length >= 10 && conditions.some((c) => c.trim()) && deadline;

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setReason('');
      setConditions(['']);
      setDeadline('');
    }
  }, [isOpen]);

  const addCondition = () => {
    setConditions([...conditions, '']);
  };

  const updateCondition = (index: number, value: string) => {
    const updated = [...conditions];
    updated[index] = value;
    setConditions(updated);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isConfirmValid || !isFormValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ids: selectedIds,
        reason: reason.trim(),
        conditions: conditions.filter((c) => c.trim()),
        deadline,
      });
      toast.success(`${selectedIds.length} vetting requests marked conditional`);
      onClose();
    } catch (error) {
      toast.error('Failed to update requests. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-conditional-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="bulk-conditional-title" className="text-xl text-gray-900">
            Bulk Conditional Approval
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900">
                You are conditionally approving <strong>{selectedIds.length}</strong> NGOs. They will
                need to fulfill all conditions by the deadline.
              </p>
            </div>
          </div>

          {/* Selected Items Preview */}
          <div>
            <h3 className="text-sm text-gray-700 mb-2">Selected Items ({selectedIds.length})</h3>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 border-b border-gray-100 last:border-0 text-sm text-gray-700"
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Reason for Conditional Approval <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why conditional approval is needed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{reason.length}/10 characters minimum</p>
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Required Conditions <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              {conditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => updateCondition(index, e.target.value)}
                    placeholder={`Condition ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={isSubmitting}
                  />
                  {conditions.length > 1 && (
                    <button
                      onClick={() => removeCondition(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={isSubmitting}
                      aria-label="Remove condition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addCondition}
              className="mt-2 text-sm text-amber-700 hover:text-amber-800"
              disabled={isSubmitting}
            >
              + Add Another Condition
            </button>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Deadline <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Typed Confirmation */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Type <strong className="text-amber-600">{expectedText}</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2
                ${
                  confirmText && isConfirmValid
                    ? 'border-amber-500 focus:ring-amber-500'
                    : confirmText
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isConfirmValid || !isFormValid || isSubmitting}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Processing...' : `Mark ${selectedIds.length} Conditional`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================
// BULK REJECT MODAL
// ====================

export type BulkRejectModalProps = {
  isOpen: boolean;
  selectedIds: string[];
  selectedItems: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (payload: { ids: string[]; reason: string; category: string }) => Promise<void>;
};

export function BulkRejectModal({
  isOpen,
  selectedIds,
  selectedItems,
  onClose,
  onSubmit,
}: BulkRejectModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedText = `REJECT ${selectedIds.length}`;
  const isConfirmValid = confirmText.trim() === expectedText;
  const isFormValid = category && reason.trim().length >= 10;

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setCategory('');
      setReason('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!isConfirmValid || !isFormValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ids: selectedIds,
        reason: reason.trim(),
        category,
      });
      toast.success(`${selectedIds.length} vetting requests rejected`);
      onClose();
    } catch (error) {
      toast.error('Failed to reject requests. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-reject-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="bulk-reject-title" className="text-xl text-gray-900">
            Bulk Reject Vetting Requests
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-900">
                <strong>Warning:</strong> You are about to reject{' '}
                <strong>{selectedIds.length}</strong> NGO vetting requests. This action cannot be
                easily undone.
              </p>
            </div>
          </div>

          {/* Selected Items Preview */}
          <div>
            <h3 className="text-sm text-gray-700 mb-2">Selected Items ({selectedIds.length})</h3>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 border-b border-gray-100 last:border-0 text-sm text-gray-700"
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Rejection Category */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Rejection Category <span className="text-red-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isSubmitting}
            >
              <option value="">Select a category...</option>
              <option value="incomplete_docs">Incomplete Documentation</option>
              <option value="invalid_registration">Invalid Registration</option>
              <option value="failed_verification">Failed Verification</option>
              <option value="financial_concerns">Financial Concerns</option>
              <option value="safeguarding_issues">Safeguarding Issues</option>
              <option value="duplicate_application">Duplicate Application</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Detailed Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide detailed reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{reason.length}/10 characters minimum</p>
          </div>

          {/* Typed Confirmation */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Type <strong className="text-red-600">{expectedText}</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2
                ${
                  confirmText && isConfirmValid
                    ? 'border-red-500 focus:ring-red-500'
                    : confirmText
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-500'
                }
              `}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isConfirmValid || !isFormValid || isSubmitting}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Rejecting...' : `Reject ${selectedIds.length} Requests`}
          </button>
        </div>
      </div>
    </div>
  );
}
