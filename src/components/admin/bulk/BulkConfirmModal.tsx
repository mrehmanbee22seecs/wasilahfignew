import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

export type BulkActionType = 
  | 'approve'
  | 'reject'
  | 'suspend'
  | 'delete'
  | 'export'
  | 'assign'
  | 'notify'
  | 'archive';

export type BulkActionResult = {
  success: number;
  failed: number;
  errors: { id: string; error: string }[];
  partial: boolean;
};

type BulkConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  actionType: BulkActionType;
  selectedCount: number;
  resourceType: string; // e.g., "projects", "users", "NGOs"
  onConfirm: () => Promise<BulkActionResult>;
  additionalMessage?: string;
  requireConfirmation?: boolean;
};

const actionConfig: Record<BulkActionType, {
  title: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  icon: React.ReactNode;
  severity: 'low' | 'medium' | 'high';
}> = {
  approve: {
    title: 'Approve Items',
    description: 'This will approve the selected items and notify stakeholders',
    buttonLabel: 'Approve',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    icon: <CheckCircle className="w-5 h-5" />,
    severity: 'medium',
  },
  reject: {
    title: 'Reject Items',
    description: 'This will reject the selected items and notify stakeholders',
    buttonLabel: 'Reject',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    icon: <X className="w-5 h-5" />,
    severity: 'high',
  },
  suspend: {
    title: 'Suspend Items',
    description: 'This will temporarily suspend access for the selected items',
    buttonLabel: 'Suspend',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    icon: <AlertTriangle className="w-5 h-5" />,
    severity: 'high',
  },
  delete: {
    title: 'Delete Items',
    description: 'This action cannot be undone. All data will be permanently removed.',
    buttonLabel: 'Delete',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    icon: <X className="w-5 h-5" />,
    severity: 'high',
  },
  export: {
    title: 'Export Data',
    description: 'This will export the selected items to a CSV file',
    buttonLabel: 'Export',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    icon: <CheckCircle className="w-5 h-5" />,
    severity: 'low',
  },
  assign: {
    title: 'Assign Items',
    description: 'This will assign the selected items to the specified user',
    buttonLabel: 'Assign',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    icon: <CheckCircle className="w-5 h-5" />,
    severity: 'medium',
  },
  notify: {
    title: 'Send Notifications',
    description: 'This will send notifications to all selected recipients',
    buttonLabel: 'Send',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    icon: <CheckCircle className="w-5 h-5" />,
    severity: 'low',
  },
  archive: {
    title: 'Archive Items',
    description: 'This will move the selected items to the archive',
    buttonLabel: 'Archive',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    icon: <CheckCircle className="w-5 h-5" />,
    severity: 'medium',
  },
};

export function BulkConfirmModal({
  isOpen,
  onClose,
  actionType,
  selectedCount,
  resourceType,
  onConfirm,
  additionalMessage,
  requireConfirmation = false,
}: BulkConfirmModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<BulkActionResult | null>(null);

  if (!isOpen) return null;

  const config = actionConfig[actionType];
  const confirmationRequired = requireConfirmation && config.severity === 'high';
  const expectedConfirmation = 'CONFIRM';

  const handleConfirm = async () => {
    if (confirmationRequired && confirmationText !== expectedConfirmation) {
      toast.error(`Please type "${expectedConfirmation}" to proceed`);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await onConfirm();
      setResults(result);
      setShowResults(true);

      if (result.partial) {
        toast.warning(`Completed with ${result.failed} failures`);
      } else if (result.failed === 0) {
        toast.success(`Successfully ${actionType}d ${result.success} ${resourceType}`);
      } else {
        toast.error(`Failed to ${actionType} items`);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('An error occurred during the bulk action');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    setShowResults(false);
    setResults(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <h2 className="text-xl text-gray-900">{config.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResults ? (
            <>
              {/* Warning Banner */}
              {config.severity === 'high' && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="font-medium mb-1">Warning</p>
                    <p className="text-red-700">
                      This is a destructive action that affects {selectedCount} {resourceType}.
                    </p>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">{config.description}</p>
                {additionalMessage && (
                  <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {additionalMessage}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Selected items:</strong> {selectedCount} {resourceType}
                </p>
              </div>

              {/* Confirmation Input */}
              {confirmationRequired && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Type <code className="px-2 py-0.5 bg-gray-200 rounded text-red-700">{expectedConfirmation}</code> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-900"
                    placeholder="Type CONFIRM"
                    autoFocus
                  />
                </div>
              )}
            </>
          ) : (
            /* Results */
            <div>
              {results && (
                <>
                  {/* Success/Failure Summary */}
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <span className="text-sm text-emerald-900">Successful</span>
                      <span className="text-lg text-emerald-700">{results.success}</span>
                    </div>
                    {results.failed > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-sm text-red-900">Failed</span>
                        <span className="text-lg text-red-700">{results.failed}</span>
                      </div>
                    )}
                  </div>

                  {/* Error Details */}
                  {results.errors.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-2">Error Details:</p>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {results.errors.map((err, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-red-50 border border-red-200 rounded text-xs"
                          >
                            <p className="text-red-900">
                              <strong>ID:</strong> {err.id}
                            </p>
                            <p className="text-red-700">{err.error}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {results.failed === 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-900">
                        All {results.success} {resourceType} were successfully processed.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          {!showResults ? (
            <>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={
                  isProcessing ||
                  (confirmationRequired && confirmationText !== expectedConfirmation)
                }
                className={`px-5 py-2.5 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${config.buttonColor}`}
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  config.buttonLabel
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
