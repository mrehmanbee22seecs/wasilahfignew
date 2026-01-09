import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ProposalForm } from './ProposalForm';
import { trackAnalytics } from './ProposalFormData';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillService?: string;
  origin?: 'hero' | 'solutions_card' | 'header' | 'footer';
}

export function ProposalModal({ 
  isOpen, 
  onClose, 
  prefillService,
  origin = 'header'
}: ProposalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Track modal open
      trackAnalytics('proposal_opened', {
        origin,
        prefillService
      });

      if (prefillService) {
        trackAnalytics('proposal_prefill', {
          service: prefillService
        });
      }

      // Focus trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }

        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Auto-focus close button on open
      setTimeout(() => closeButtonRef.current?.focus(), 100);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose, prefillService, origin]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-in fade-in zoom-in-95 duration-180"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 id="proposal-modal-title" className="text-slate-900">
              Request a Proposal
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Tell us about your CSR needs and we'll get back within 48 hours
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Close proposal form"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <ProposalForm 
            prefillService={prefillService} 
            onSubmitSuccess={() => {
              // Keep modal open to show success message
              // Optionally close after delay: setTimeout(onClose, 3000);
            }}
            compact
          />
        </div>
      </div>
    </div>
  );
}
