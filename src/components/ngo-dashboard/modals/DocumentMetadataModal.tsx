import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, AlertCircle } from 'lucide-react';
import type { NGODocument } from '../../../types/ngo';

interface DocumentMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: NGODocument | null;
  onSave: (updatedDoc: NGODocument) => void;
}

export function DocumentMetadataModal({ isOpen, onClose, document, onSave }: DocumentMetadataModalProps) {
  const [issuedAt, setIssuedAt] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (document) {
      setIssuedAt(document.issued_at || '');
      setExpiryDate(document.expiry_date || '');
      setNotes(document.notes || '');
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSave = () => {
    const updatedDoc: NGODocument = {
      ...document,
      issued_at: issuedAt || undefined,
      expiry_date: expiryDate || undefined,
      notes: notes || undefined
    };
    onSave(updatedDoc);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

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
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="metadata-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 id="metadata-modal-title" className="text-slate-900">
                  Edit Metadata
                </h3>
                <p className="text-xs text-slate-600 truncate max-w-xs">
                  {document.filename}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Issued Date */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Issued Date
              </label>
              <input
                type="date"
                value={formatDate(issuedAt)}
                onChange={(e) => setIssuedAt(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                When was this document issued?
              </p>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Expiry Date
              </label>
              <input
                type="date"
                value={formatDate(expiryDate)}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none transition-colors"
              />
              {expiryDate && new Date(expiryDate) < new Date() && (
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-red-50 border-2 border-red-200 rounded-lg text-xs text-red-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>This document has expired</span>
                </div>
              )}
              {expiryDate && new Date(expiryDate) > new Date() && new Date(expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && (
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-amber-50 border-2 border-amber-200 rounded-lg text-xs text-amber-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Expires soon (within 30 days)</span>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">
                When does this document expire?
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-slate-500" />
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none transition-colors resize-none"
                placeholder="Add any additional notes or context about this document..."
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-500">
                  Additional information about the document
                </p>
                <span className="text-xs text-slate-400">
                  {notes.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
            >
              Save Metadata
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
