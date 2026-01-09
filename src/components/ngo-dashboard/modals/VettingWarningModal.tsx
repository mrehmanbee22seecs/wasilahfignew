import React from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { DocumentChecklistItem } from '../../../types/ngo';

interface VettingWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  missingDocs: DocumentChecklistItem[];
}

export function VettingWarningModal({ 
  isOpen, 
  onClose, 
  onProceed,
  missingDocs 
}: VettingWarningModalProps) {
  if (!isOpen) return null;

  const requiredMissing = missingDocs.filter(doc => doc.required);
  const optionalMissing = missingDocs.filter(doc => !doc.required);

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
        aria-labelledby="vetting-warning-title"
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="vetting-warning-title" className="mb-1">
                    Incomplete Documentation
                  </h2>
                  <p className="text-sm text-amber-100">
                    Are you sure you want to proceed?
                  </p>
                </div>
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
            {/* Warning Message */}
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm text-amber-900 mb-1">Missing Documents Detected</h3>
                  <p className="text-sm text-amber-700">
                    {requiredMissing.length > 0 
                      ? `You have ${requiredMissing.length} required document(s) missing. This may delay your verification process or result in rejection.`
                      : `You have ${optionalMissing.length} optional document(s) missing. While not required, these can strengthen your application.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Required Missing Documents */}
            {requiredMissing.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Required Documents Missing ({requiredMissing.length})
                </h3>
                <div className="space-y-2">
                  {requiredMissing.map((doc, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-red-50 border-2 border-red-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm text-red-900 font-medium">{doc.label}</h4>
                          <p className="text-xs text-red-700 mt-0.5">{doc.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Missing Documents */}
            {optionalMissing.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Optional Documents Missing ({optionalMissing.length})
                </h3>
                <div className="space-y-2">
                  {optionalMissing.map((doc, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-amber-50 border-2 border-amber-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm text-amber-900 font-medium">{doc.label}</h4>
                          <p className="text-xs text-amber-700 mt-0.5">{doc.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consequences */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h4 className="text-sm text-blue-900 mb-2">What happens if you proceed?</h4>
              <ul className="space-y-1.5 text-sm text-blue-700">
                {requiredMissing.length > 0 ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Your verification request will be submitted with incomplete documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>The vetting team will likely request the missing documents before proceeding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>This may significantly delay your verification timeline (2-3 weeks extra)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>You can upload missing documents later, but it's faster to do it now</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Your application meets minimum requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Optional documents can be uploaded later to strengthen your profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Verification will proceed normally (7-10 business days)</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm text-slate-700 hover:bg-white rounded-lg border-2 border-slate-200 transition-colors"
            >
              Go Back & Upload
            </button>
            <button
              onClick={() => {
                onProceed();
                onClose();
              }}
              className={`
                px-6 py-2.5 text-sm text-white rounded-lg transition-all
                ${requiredMissing.length > 0
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg'
                }
              `}
            >
              {requiredMissing.length > 0 ? 'Proceed Anyway' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
