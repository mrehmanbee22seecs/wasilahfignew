import React, { useState } from 'react';
import { X, Link2, CheckCircle, AlertCircle } from 'lucide-react';

interface AttachNGOModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngoName: string;
  projectId: string;
  onConfirm: () => void;
}

export function AttachNGOModal({ isOpen, onClose, ngoName, projectId, onConfirm }: AttachNGOModalProps) {
  const [role, setRole] = useState<'lead' | 'partner'>('partner');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [budgetAllocation, setBudgetAllocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const RESPONSIBILITY_OPTIONS = [
    'Project Implementation',
    'Beneficiary Identification',
    'Field Operations',
    'Reporting & Documentation',
    'Financial Management',
    'Volunteer Coordination'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onConfirm();
    
    // Reset form
    setRole('partner');
    setResponsibilities([]);
    setBudgetAllocation('');
    setNotes('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRole('partner');
      setResponsibilities([]);
      setBudgetAllocation('');
      setNotes('');
      onClose();
    }
  };

  const toggleResponsibility = (responsibility: string) => {
    setResponsibilities(prev => 
      prev.includes(responsibility)
        ? prev.filter(r => r !== responsibility)
        : [...prev, responsibility]
    );
  };

  const isFormValid = responsibilities.length > 0 && budgetAllocation && Number(budgetAllocation) > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Attach NGO to Project</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Define role and responsibilities for <strong>{ngoName}</strong>
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

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  NGO Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    className={`flex flex-col gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      role === 'lead' 
                        ? 'border-teal-300 bg-teal-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="lead"
                      checked={role === 'lead'}
                      onChange={(e) => setRole(e.target.value as 'lead' | 'partner')}
                      disabled={isSubmitting}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === 'lead' ? 'border-teal-600' : 'border-slate-300'
                      }`}>
                        {role === 'lead' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                      </div>
                      <span className="text-sm text-slate-900">Lead NGO</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-7">
                      Primary implementer with full project oversight
                    </p>
                  </label>

                  <label 
                    className={`flex flex-col gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      role === 'partner' 
                        ? 'border-teal-300 bg-teal-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="partner"
                      checked={role === 'partner'}
                      onChange={(e) => setRole(e.target.value as 'lead' | 'partner')}
                      disabled={isSubmitting}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === 'partner' ? 'border-teal-600' : 'border-slate-300'
                      }`}>
                        {role === 'partner' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                      </div>
                      <span className="text-sm text-slate-900">Partner NGO</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-7">
                      Supporting role with specific responsibilities
                    </p>
                  </label>
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Responsibilities <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {RESPONSIBILITY_OPTIONS.map(responsibility => (
                    <label 
                      key={responsibility}
                      className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-teal-300 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={responsibilities.includes(responsibility)}
                        onChange={() => toggleResponsibility(responsibility)}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-300"
                      />
                      <span className="text-sm text-slate-700">{responsibility}</span>
                    </label>
                  ))}
                </div>
                {responsibilities.length === 0 && (
                  <p className="text-xs text-red-600 mt-2">Select at least one responsibility</p>
                )}
              </div>

              {/* Budget Allocation */}
              <div>
                <label htmlFor="budget-allocation" className="block text-sm text-slate-700 mb-2">
                  Budget Allocation (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  id="budget-allocation"
                  type="number"
                  value={budgetAllocation}
                  onChange={(e) => setBudgetAllocation(e.target.value)}
                  placeholder="e.g., 500000"
                  min="0"
                  step="1000"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Amount allocated to this NGO from the total project budget
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific instructions, expectations, or conditions..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm resize-none disabled:opacity-50"
                />
              </div>

              {/* Warning for Lead NGO */}
              {role === 'lead' && (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-yellow-900 mb-1">Lead NGO Responsibilities</p>
                    <p className="text-xs text-yellow-800">
                      As the lead NGO, {ngoName} will be the primary point of contact and will have overall project accountability.
                    </p>
                  </div>
                </div>
              )}

              {/* Success Preview */}
              <div className="flex items-start gap-2 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-teal-900 mb-1">What happens next?</p>
                  <p className="text-xs text-teal-800">
                    {ngoName} will be attached to the project and notified via email. 
                    They will gain access to project details and can start coordination.
                  </p>
                </div>
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
                {isSubmitting ? 'Attaching NGO...' : 'Attach to Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
