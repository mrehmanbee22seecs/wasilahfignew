import React, { useState } from 'react';
import { X, FileText, Upload } from 'lucide-react';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (invoice: any) => void;
}

const CATEGORIES = [
  'NGO Services',
  'Equipment & Supplies',
  'Transportation',
  'Marketing & Communications',
  'Venue & Facilities',
  'Food & Catering',
  'Other'
];

export function AddInvoiceModal({ isOpen, onClose, onAdd }: AddInvoiceModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    vendor: '',
    amount: '',
    category: CATEGORIES[0],
    dueDate: '',
    status: 'draft' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    onAdd({
      number: formData.number,
      vendor: formData.vendor,
      amount: parseFloat(formData.amount),
      category: formData.category,
      dueDate: formData.dueDate,
      status: formData.status
    });

    setFormData({
      number: '',
      vendor: '',
      amount: '',
      category: CATEGORIES[0],
      dueDate: '',
      status: 'draft'
    });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        number: '',
        vendor: '',
        amount: '',
        category: CATEGORIES[0],
        dueDate: '',
        status: 'draft'
      });
      onClose();
    }
  };

  const isFormValid = formData.number && formData.vendor && formData.amount && formData.dueDate;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Add Invoice</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Record a new project expense
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
              {/* Invoice Number & Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="invoice-number" className="block text-sm text-slate-700 mb-2">
                    Invoice Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="invoice-number"
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="INV-2026-005"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="invoice-amount" className="block text-sm text-slate-700 mb-2">
                    Amount (PKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="invoice-amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Vendor */}
              <div>
                <label htmlFor="invoice-vendor" className="block text-sm text-slate-700 mb-2">
                  Vendor/Supplier <span className="text-red-500">*</span>
                </label>
                <input
                  id="invoice-vendor"
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Vendor name"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              {/* Category & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="invoice-category" className="block text-sm text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    id="invoice-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="invoice-due-date" className="block text-sm text-slate-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="invoice-due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Invoice Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                    disabled={isSubmitting}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border-2 transition-colors ${
                      formData.status === 'draft'
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    } disabled:opacity-50`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'sent' })}
                    disabled={isSubmitting}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border-2 transition-colors ${
                      formData.status === 'sent'
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    } disabled:opacity-50`}
                  >
                    Sent
                  </button>
                </div>
              </div>

              {/* Attachment placeholder */}
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-1">Upload Invoice Document</p>
                <p className="text-xs text-slate-500">PDF, DOC, or image files</p>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="mt-2 px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Choose File
                </button>
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
                {isSubmitting ? 'Adding...' : 'Add Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
