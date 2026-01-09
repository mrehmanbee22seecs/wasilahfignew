import React, { useState } from 'react';
import { X, DollarSign, AlertCircle } from 'lucide-react';

interface RequestDisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  availableBudget: number;
}

export function RequestDisbursementModal({ isOpen, onClose, projectId, availableBudget }: RequestDisbursementModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    recipient: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Success notification would go here
    setFormData({
      amount: '',
      purpose: '',
      recipient: '',
      notes: ''
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        amount: '',
        purpose: '',
        recipient: '',
        notes: ''
      });
      onClose();
    }
  };

  const requestedAmount = parseFloat(formData.amount) || 0;
  const exceedsAvailable = requestedAmount > availableBudget;
  const isFormValid = formData.amount && formData.purpose && formData.recipient && !exceedsAvailable;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Request Disbursement</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Submit a payment request to finance
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Available Budget Info */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600">Available Budget</p>
                <p className="text-lg text-slate-900">
                  PKR {availableBudget.toLocaleString('en-PK')}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="disbursement-amount" className="block text-sm text-slate-700 mb-2">
                  Requested Amount (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  id="disbursement-amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none disabled:opacity-50 ${
                    exceedsAvailable && formData.amount
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-slate-200 focus:border-teal-300'
                  }`}
                  required
                />
                {exceedsAvailable && formData.amount && (
                  <p className="text-xs text-red-600 mt-1">
                    Amount exceeds available budget
                  </p>
                )}
              </div>

              {/* Recipient */}
              <div>
                <label htmlFor="disbursement-recipient" className="block text-sm text-slate-700 mb-2">
                  Recipient/Payee <span className="text-red-500">*</span>
                </label>
                <input
                  id="disbursement-recipient"
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  placeholder="e.g., Al-Khidmat Foundation"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="disbursement-purpose" className="block text-sm text-slate-700 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <input
                  id="disbursement-purpose"
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g., Equipment purchase for cleanup event"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="disbursement-notes" className="block text-sm text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="disbursement-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional context or instructions..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none resize-none disabled:opacity-50"
                />
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  This request will be sent to the finance team for approval. 
                  You'll receive a notification once it's processed.
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
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
