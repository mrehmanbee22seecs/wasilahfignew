import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { toast } from 'sonner';

type AddNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  holdId: string;
  ngoName: string;
  projectName: string;
  onSubmit: (note: string) => Promise<void>;
};

export function AddNoteModal({
  isOpen,
  onClose,
  holdId,
  ngoName,
  projectName,
  onSubmit,
}: AddNoteModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(note.trim());
      toast.success('Note added successfully');
      setNote('');
      onClose();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg text-gray-900">Add Note</h3>
            <p className="text-sm text-gray-600 mt-1">
              {projectName} • {ngoName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-sm text-gray-700 mb-2">
            Note <span className="text-red-500">*</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context, updates, or important information about this payment hold..."
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400 resize-none"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            This note will be visible to all administrators and included in the audit trail
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !note.trim()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Add Note
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
