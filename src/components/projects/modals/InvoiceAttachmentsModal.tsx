import React, { useState } from 'react';
import { X, Download, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface InvoiceAttachmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    number: string;
    attachments?: string[];
  } | null;
}

export function InvoiceAttachmentsModal({ isOpen, onClose, invoice }: InvoiceAttachmentsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !invoice || !invoice.attachments || invoice.attachments.length === 0) return null;

  const attachments = invoice.attachments;
  const currentAttachment = attachments[currentIndex];
  const isPDF = currentAttachment.toLowerCase().endsWith('.pdf');

  const handlePrev = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : attachments.length - 1);
    setZoom(100);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < attachments.length - 1 ? prev + 1 : 0);
    setZoom(100);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = currentAttachment;
    link.click();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-slate-200">
            <div>
              <h3 className="text-slate-900">Invoice Attachments</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                {invoice.number} - {currentAttachment}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-700 px-2">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-slate-50 p-4 flex items-center justify-center">
            {isPDF ? (
              <div className="w-full h-full bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center">
                <FileText className="w-24 h-24 text-slate-400 mb-4" />
                <p className="text-slate-700 mb-2">{currentAttachment}</p>
                <p className="text-sm text-slate-500 mb-4">PDF preview - Click download to view full document</p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            ) : (
              <div 
                className="bg-white rounded-lg shadow-lg overflow-auto"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
              >
                <img 
                  src={`https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800`}
                  alt={currentAttachment}
                  className="max-w-full"
                />
              </div>
            )}
          </div>

          {/* Footer with Navigation */}
          {attachments.length > 1 && (
            <div className="flex items-center justify-between p-4 border-t-2 border-slate-200">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-slate-600">
                {currentIndex + 1} / {attachments.length}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}