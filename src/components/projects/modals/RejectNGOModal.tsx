import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';

interface RejectNGOModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngoName: string;
  onConfirm: (reason: string) => void;
}

const REJECTION_REASONS = [
  'Incomplete documentation',
  'Failed financial audit',
  'Insufficient references',
  'Geographic mismatch',
  'Capacity concerns',
  'Other (specify below)'
];

export function RejectNGOModal({ isOpen, onClose, ngoName, onConfirm }: RejectNGOModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [blacklist, setBlacklist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const finalReason = selectedReason === 'Other (specify below)' 
      ? customReason 
      : selectedReason;
    
    onConfirm(`${finalReason}${blacklist ? ' [BLACKLISTED]' : ''}`);
    
    // Reset form
    setSelectedReason('');
    setCustomReason('');
    setBlacklist(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setCustomReason('');
      setBlacklist(false);
      onClose();
    }
  };

  const isFormValid = selectedReason && 
    (selectedReason !== 'Other (specify below)' || customReason.trim());

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
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Reject NGO</h3>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">{ngoName}</span> will not be approved
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700">
                Please provide a reason for rejecting this NGO. This information will be logged for audit purposes.
              </p>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {REJECTION_REASONS.map(reason => (
                    <label 
                      key={reason}
                      className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-teal-300 transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-teal-600 focus:ring-2 focus:ring-teal-300"
                      />
                      <span className="text-sm text-slate-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Reason Field */}
              {selectedReason === 'Other (specify below)' && (
                <div>
                  <label htmlFor="custom-reason" className="block text-sm text-slate-700 mb-2">
                    Specify Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="custom-reason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please provide detailed reason for rejection..."
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm resize-none disabled:opacity-50"
                    required
                  />
                </div>
              )}

              {/* Blacklist Option */}
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blacklist}
                    onChange={(e) => setBlacklist(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-0.5 w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-300"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-red-900 block">
                      Blacklist this NGO
                    </span>
                    <p className="text-xs text-red-700 mt-1">
                      This will prevent the NGO from being considered for future projects. Use only for serious violations.
                    </p>
                  </div>
                </label>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  This action will be logged in the audit trail. The NGO may be notified depending on your organization's policy.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t-2 border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
