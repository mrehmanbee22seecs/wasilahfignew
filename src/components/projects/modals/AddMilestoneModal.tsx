import React, { useState } from 'react';
import { X, Target, Calendar, User, DollarSign } from 'lucide-react';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (milestone: any) => void;
}

export function AddMilestoneModal({ isOpen, onClose, onAdd }: AddMilestoneModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    deliverables: '',
    cost: '',
    evidenceRequired: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const milestone = {
      title: formData.title,
      description: formData.description,
      status: 'planned' as const,
      dueDate: formData.dueDate,
      assignee: formData.assignee ? {
        id: 'new',
        name: formData.assignee
      } : undefined,
      progress: 0,
      deliverables: formData.deliverables
        ? formData.deliverables.split('\n').filter(d => d.trim())
        : [],
      evidenceRequired: formData.evidenceRequired
    };

    onAdd(milestone);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      deliverables: '',
      cost: '',
      evidenceRequired: true
    });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        assignee: '',
        deliverables: '',
        cost: '',
        evidenceRequired: true
      });
      onClose();
    }
  };

  const isFormValid = formData.title.trim() && formData.dueDate;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Add Project Milestone</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Create a new milestone to track project progress
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
              {/* Title */}
              <div>
                <label htmlFor="milestone-title" className="block text-sm text-slate-700 mb-2">
                  Milestone Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="milestone-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Volunteer Training Session"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="milestone-description" className="block text-sm text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  id="milestone-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what needs to be accomplished..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none resize-none disabled:opacity-50"
                />
              </div>

              {/* Due Date & Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="milestone-date" className="block text-sm text-slate-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="milestone-date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="milestone-assignee" className="block text-sm text-slate-700 mb-2">
                    Assignee
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="milestone-assignee"
                      type="text"
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                      placeholder="Person responsible"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Expected Deliverables */}
              <div>
                <label htmlFor="milestone-deliverables" className="block text-sm text-slate-700 mb-2">
                  Expected Deliverables
                </label>
                <textarea
                  id="milestone-deliverables"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Enter one deliverable per line&#10;e.g.,&#10;Training materials&#10;Attendance sheet&#10;Photo documentation"
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none resize-none disabled:opacity-50 text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter each deliverable on a new line
                </p>
              </div>

              {/* Cost (Optional) */}
              <div>
                <label htmlFor="milestone-cost" className="block text-sm text-slate-700 mb-2">
                  Estimated Cost (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="milestone-cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Evidence Required */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.evidenceRequired}
                    onChange={(e) => setFormData({ ...formData, evidenceRequired: e.target.checked })}
                    disabled={isSubmitting}
                    className="mt-0.5 w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-300"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-slate-900 block">
                      Require evidence for completion
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      Users must upload documents or photos when marking this milestone as complete
                    </p>
                  </div>
                </label>
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
                {isSubmitting ? 'Adding...' : 'Add Milestone'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
