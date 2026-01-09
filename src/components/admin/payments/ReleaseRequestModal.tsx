import React, { useState } from 'react';
import { X, Upload, AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export type ReleaseRequestData = {
  holdId: string;
  amount: number;
  currency: string;
  reason: string;
  supportingDocs: File[];
  requestedBy: string;
};

type ReleaseRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  holdId: string;
  holdAmount: number;
  currency: string;
  ngoName: string;
  projectName: string;
  onSubmit: (data: ReleaseRequestData) => Promise<void>;
};

export function ReleaseRequestModal({
  isOpen,
  onClose,
  holdId,
  holdAmount,
  currency,
  ngoName,
  projectName,
  onSubmit,
}: ReleaseRequestModalProps) {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState(holdAmount);
  const [docs, setDocs] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocs([...docs, ...Array.from(e.target.files)]);
    }
  };

  const removeDoc = (index: number) => {
    setDocs(docs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for release');
      return;
    }

    if (amount <= 0 || amount > holdAmount) {
      toast.error(`Amount must be between 0 and ${holdAmount.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        holdId,
        amount,
        currency,
        reason: reason.trim(),
        supportingDocs: docs,
        requestedBy: 'current-user', // In production: get from auth
      });

      toast.success('Release request submitted successfully');
      onClose();
      
      // Reset form
      setReason('');
      setAmount(holdAmount);
      setDocs([]);
    } catch (error) {
      console.error('Error submitting release request:', error);
      toast.error('Failed to submit release request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-900">Request Payment Release</h2>
            <p className="text-sm text-gray-600 mt-1">
              {projectName} • {ngoName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Release Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                max={holdAmount}
                min={0}
                className="w-full pl-10 pr-20 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {currency}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {holdAmount.toLocaleString()} {currency}
            </p>
          </div>

          {/* Reason Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Reason for Release <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this payment should be released (e.g., milestone completed, documents verified, compliance cleared...)"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be reviewed by approvers
            </p>
          </div>

          {/* Supporting Documents */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Supporting Documents
            </label>
            
            {/* Upload Button */}
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">Upload files</p>
                <p className="text-xs text-gray-500">PDF, images up to 10MB each</p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Uploaded Files List */}
            {docs.length > 0 && (
              <div className="mt-3 space-y-2">
                {docs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-blue-700">
                          {doc.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDoc(index)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Dual Approval Required</p>
              <p className="text-blue-700">
                This release request will require approval from two authorized administrators
                before the payment is processed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Release Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
