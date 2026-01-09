import React, { useState } from 'react';
import { X, Award, Download, Mail, Check } from 'lucide-react';

interface IssueCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: {
    name: string;
    email: string;
  };
  hoursCompleted: number;
}

export function IssueCertificateModal({ isOpen, onClose, volunteer, hoursCompleted }: IssueCertificateModalProps) {
  const [isIssuing, setIsIssuing] = useState(false);
  const [issued, setIssued] = useState(false);

  if (!isOpen) return null;

  const handleIssue = async () => {
    setIsIssuing(true);
    
    // Simulate certificate generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsIssuing(false);
    setIssued(true);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      setIssued(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isIssuing && !issued) {
      onClose();
    }
  };

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
          {!issued ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900">Issue Certificate</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      For: <span className="font-medium">{volunteer.name}</span>
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  disabled={isIssuing}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-700">
                  A volunteer completion certificate will be generated and sent to the volunteer.
                </p>

                {/* Certificate Preview Info */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg space-y-2">
                  <h4 className="text-sm text-amber-900">Certificate Details</h4>
                  <div className="space-y-1 text-xs text-amber-800">
                    <p><span className="font-medium">Volunteer Name:</span> {volunteer.name}</p>
                    <p><span className="font-medium">Hours Completed:</span> {hoursCompleted} hours</p>
                    <p><span className="font-medium">Issue Date:</span> {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</p>
                    <p><span className="font-medium">Delivery:</span> Email ({volunteer.email})</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    The certificate will be sent via email with a unique verification code. 
                    The volunteer can download and share it on social media.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isIssuing}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleIssue}
                  disabled={isIssuing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isIssuing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Issue Certificate
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-slate-900 mb-2">Certificate Issued!</h3>
              <p className="text-sm text-slate-600">
                The certificate has been sent to {volunteer.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
