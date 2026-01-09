import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * Action Modals for Vetting Decisions
 * 
 * Three modal types:
 * 1. ApproveModal - Simple confirmation with optional note
 * 2. ConditionalModal - Requires conditions, deadline, reason
 * 3. RejectModal - Requires reason (min 10 chars)
 * 
 * All modals:
 * - Trap focus
 * - ESC to close
 * - Simulate network call with loading states
 * - Return success/failure with toast
 * 
 * API: POST /admin/vetting/:id/action
 */

// ====================
// APPROVE MODAL
// ====================

export type ApproveModalProps = {
  isOpen: boolean;
  vettingId: string;
  ngoName: string;
  onClose: () => void;
  onSubmit: (payload: { vettingId: string; note?: string; force?: boolean }) => Promise<void>;
  hasRequiredItemsUnchecked?: boolean;
};

export function ApproveModal({
  isOpen,
  vettingId,
  ngoName,
  onClose,
  onSubmit,
  hasRequiredItemsUnchecked = false,
}: ApproveModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForceConfirm, setShowForceConfirm] = useState(false);
  const [forceText, setForceText] = useState('');

  const handleSubmit = async (force: boolean = false) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        vettingId,
        note: note.trim() || undefined,
        force,
      });
      toast.success('NGO approved successfully');
      onClose();
      resetState();
    } catch (error) {
      toast.error('Failed to approve. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setNote('');
    setShowForceConfirm(false);
    setForceText('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetState();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="approve-modal-title" className="text-gray-900">
            Approve NGO
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-900">
                You are about to approve <strong>{ngoName}</strong> for the platform.
              </p>
            </div>
          </div>

          {/* Warning if required items unchecked */}
          {hasRequiredItemsUnchecked && !showForceConfirm && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 mb-2">
                  <strong>Warning:</strong> Some required checklist items are not completed.
                </p>
                <button
                  onClick={() => setShowForceConfirm(true)}
                  className="text-sm text-amber-700 underline hover:no-underline focus:outline-none"
                >
                  Force approve anyway (requires confirmation)
                </button>
              </div>
            </div>
          )}

          {/* Force Approve Confirmation */}
          {showForceConfirm && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg space-y-3">
              <p className="text-sm text-red-900">
                <strong>Force Approval Override</strong>
              </p>
              <p className="text-sm text-red-800">
                Type <code className="px-2 py-1 bg-red-100 rounded">FORCE</code> to confirm override:
              </p>
              <input
                type="text"
                value={forceText}
                onChange={(e) => setForceText(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type FORCE"
              />
            </div>
          )}

          {/* Optional Note */}
          {!showForceConfirm && (
            <div>
              <label htmlFor="approve-note" className="block text-sm text-gray-700 mb-2">
                Note (optional)
              </label>
              <textarea
                id="approve-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes about this approval..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          {showForceConfirm ? (
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || forceText !== 'FORCE'}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Force Approve
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || hasRequiredItemsUnchecked}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================
// CONDITIONAL MODAL
// ====================

export type ConditionalModalProps = {
  isOpen: boolean;
  vettingId: string;
  ngoName: string;
  onClose: () => void;
  onSubmit: (payload: {
    vettingId: string;
    reason: string;
    conditions: string[];
    deadline: string;
  }) => Promise<void>;
};

export function ConditionalModal({
  isOpen,
  vettingId,
  ngoName,
  onClose,
  onSubmit,
}: ConditionalModalProps) {
  const [reason, setReason] = useState('');
  const [conditions, setConditions] = useState<string[]>(['']);
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCondition = () => {
    setConditions([...conditions, '']);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index: number, value: string) => {
    const updated = [...conditions];
    updated[index] = value;
    setConditions(updated);
  };

  const handleSubmit = async () => {
    // Validation
    if (!reason.trim()) {
      toast.error('Reason is required');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    const validConditions = conditions.filter((c) => c.trim());
    if (validConditions.length === 0) {
      toast.error('At least one condition is required');
      return;
    }

    if (!deadline) {
      toast.error('Deadline is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        vettingId,
        reason: reason.trim(),
        conditions: validConditions,
        deadline,
      });
      toast.success('Conditional approval recorded');
      onClose();
      resetState();
    } catch (error) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setReason('');
    setConditions(['']);
    setDeadline('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetState();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conditional-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="conditional-modal-title" className="text-gray-900">
            Conditional Approval
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900">
                Conditionally approve <strong>{ngoName}</strong> with specific requirements.
              </p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="conditional-reason" className="block text-sm text-gray-700 mb-2">
              Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              id="conditional-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why conditional approval is needed..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length} / 10 characters minimum
            </p>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-700">
                Conditions <span className="text-red-600">*</span>
              </label>
              <button
                onClick={handleAddCondition}
                className="text-xs text-blue-600 hover:text-blue-700 focus:outline-none focus:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Condition
              </button>
            </div>

            <div className="space-y-2">
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => handleConditionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Condition ${index + 1}`}
                  />
                  {conditions.length > 1 && (
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Remove condition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="conditional-deadline" className="block text-sm text-gray-700 mb-2">
              Deadline <span className="text-red-600">*</span>
            </label>
            <input
              id="conditional-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Conditional Approval
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================
// REJECT MODAL
// ====================

export type RejectModalProps = {
  isOpen: boolean;
  vettingId: string;
  ngoName: string;
  onClose: () => void;
  onSubmit: (payload: { vettingId: string; reason: string; isPrivate: boolean }) => Promise<void>;
};

export function RejectModal({
  isOpen,
  vettingId,
  ngoName,
  onClose,
  onSubmit,
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!reason.trim()) {
      toast.error('Reason is required');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        vettingId,
        reason: reason.trim(),
        isPrivate,
      });
      toast.success('NGO rejected');
      onClose();
      resetState();
    } catch (error) {
      toast.error('Failed to reject. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setReason('');
    setIsPrivate(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetState();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="reject-modal-title" className="text-gray-900">
            Reject NGO
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-900">
                You are about to reject <strong>{ngoName}</strong>. This action will be recorded in the audit log.
              </p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reject-reason" className="block text-sm text-gray-700 mb-2">
              Reason for Rejection <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide detailed reason for rejection..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length} / 10 characters minimum
            </p>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <input
              id="reject-private"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="reject-private" className="text-sm text-gray-700 cursor-pointer">
              Mark reason as private (not shared with NGO)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Reject NGO
          </button>
        </div>
      </div>
    </div>
  );
}
