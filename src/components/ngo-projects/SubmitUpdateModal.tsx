import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { TaskChecklistItem } from './TaskChecklistItem';
import { ProjectMediaUploader } from './ProjectMediaUploader';
import { ProgressIndicator } from './ProgressIndicator';
import type { SubmitUpdateModalProps, UpdateFormState, MediaItem, ProjectTask } from '../../types/ngo-projects';
import { MOCK_PROJECT_TASKS } from '../../data/mockNGOProjects';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Task Checklist', description: 'Mark completed tasks' },
  { id: 2, title: 'Upload Media', description: 'Add photos & videos' },
  { id: 3, title: 'Write Report', description: 'Describe progress' },
  { id: 4, title: 'Review', description: 'Confirm & submit' }
];

export function SubmitUpdateModal({ isOpen, onClose, project, onSubmit }: SubmitUpdateModalProps) {
  const [formState, setFormState] = useState<UpdateFormState>({
    currentStep: 1,
    tasksCompleted: [],
    mediaItems: [],
    reportText: '',
    confirmed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState<ProjectTask[]>(MOCK_PROJECT_TASKS);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormState({
        currentStep: 1,
        tasksCompleted: [],
        mediaItems: [],
        reportText: '',
        confirmed: false
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    setFormState(prev => ({
      ...prev,
      tasksCompleted: completed
        ? [...prev.tasksCompleted, taskId]
        : prev.tasksCompleted.filter(id => id !== taskId)
    }));

    // Update task status
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: completed ? 'completed' : 'pending', completed_at: completed ? new Date().toISOString() : undefined }
          : task
      )
    );
  };

  const handleMediaUpload = (media: MediaItem) => {
    setFormState(prev => ({
      ...prev,
      mediaItems: [...prev.mediaItems, media]
    }));

    // Update task evidence count if media is linked to a task
    if (media.task_id) {
      setTasks(prev =>
        prev.map(task =>
          task.id === media.task_id
            ? { ...task, evidence_count: (task.evidence_count || 0) + 1 }
            : task
        )
      );
    }
  };

  const canProceedToNext = () => {
    const { currentStep, tasksCompleted, mediaItems, reportText, confirmed } = formState;

    switch (currentStep) {
      case 1:
        return tasksCompleted.length > 0;
      case 2:
        // Can proceed with or without media, but show warning if none
        return true;
      case 3:
        return reportText.trim().length >= 100; // Minimum 100 characters
      case 4:
        return confirmed;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      if (formState.currentStep === 1) {
        toast.error('Please mark at least one task as completed');
      } else if (formState.currentStep === 3) {
        toast.error('Please write at least 100 characters');
      }
      return;
    }

    setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const handleBack = () => {
    setFormState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  const handleSubmitUpdate = async () => {
    if (!canProceedToNext()) {
      toast.error('Please confirm the update accuracy');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        project_id: project.id,
        ngo_id: project.ngo_id,
        submitted_by: 'current_user',
        submitted_at: new Date().toISOString(),
        tasks_completed: formState.tasksCompleted,
        report_text: formState.reportText,
        beneficiaries_count: formState.beneficiariesCount,
        on_ground_notes: formState.onGroundNotes,
        challenges: formState.challenges,
        immediate_outcomes: formState.immediateOutcomes,
        media_items: formState.mediaItems,
        status: 'submitted'
      });

      toast.success('Project update submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to submit update:', error);
      toast.error('Failed to submit update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (formState.tasksCompleted.length > 0 || formState.mediaItems.length > 0 || formState.reportText) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const renderStepContent = () => {
    const { currentStep } = formState;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-900">
                Mark the tasks you've completed for this update. Tasks requiring evidence must have media uploaded.
              </p>
            </div>

            <ProgressIndicator
              current={formState.tasksCompleted.length}
              total={tasks.length}
              label="Tasks Completed"
            />

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.map(task => (
                <TaskChecklistItem
                  key={task.id}
                  task={task}
                  onToggle={handleTaskToggle}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
              <p className="text-sm text-indigo-900 mb-2">
                Upload photos and videos as evidence for completed tasks. Location will be captured automatically if permitted.
              </p>
              <p className="text-xs text-indigo-700">
                {formState.mediaItems.length} file{formState.mediaItems.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>

            <ProjectMediaUploader
              projectId={project.id}
              onUploadComplete={handleMediaUpload}
              availableTasks={tasks.filter(t => formState.tasksCompleted.includes(t.id))}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-900 mb-2">
                Provide a brief report on what was accomplished, challenges faced, and immediate outcomes.
              </p>
              <p className="text-xs text-emerald-700">
                Be specific and detailed. This information will be shared with corporate partners.
              </p>
            </div>

            {/* Main Report with guided prompts */}
            <div>
              <label htmlFor="report-text" className="block text-sm text-slate-700 mb-2">
                Progress Report <span className="text-rose-600">*</span>
              </label>
              <div className="mb-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs text-indigo-900 font-medium mb-1">💡 What to include:</p>
                <ul className="text-xs text-indigo-800 space-y-0.5 ml-4 list-disc">
                  <li><strong>What was done?</strong> Activities completed and methods used</li>
                  <li><strong>Challenges faced?</strong> Obstacles or difficulties encountered</li>
                  <li><strong>Immediate outcomes?</strong> Results and impacts observed</li>
                </ul>
              </div>
              <textarea
                id="report-text"
                value={formState.reportText}
                onChange={(e) => setFormState(prev => ({ ...prev, reportText: e.target.value }))}
                placeholder="Example: We completed the distribution of educational materials to 150 students across 3 schools. The team faced transportation delays due to weather, but we adapted by coordinating with local volunteers. Students showed immediate enthusiasm and teachers reported improved engagement in the following week..."
                rows={7}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-300 focus:outline-none resize-none"
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <p className={`text-xs ${formState.reportText.length >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {formState.reportText.length >= 100 ? '✓ Minimum reached' : `Need ${100 - formState.reportText.length} more characters`}
                  </p>
                </div>
                <p className={`text-xs font-medium ${formState.reportText.length >= 100 ? 'text-emerald-600' : formState.reportText.length >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {formState.reportText.length}/1000
                </p>
              </div>
            </div>

            {/* Beneficiaries Count */}
            <div>
              <label htmlFor="beneficiaries" className="block text-sm text-slate-700 mb-2">
                Beneficiaries Reached (Optional)
              </label>
              <input
                id="beneficiaries"
                type="number"
                value={formState.beneficiariesCount || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, beneficiariesCount: parseInt(e.target.value) || undefined }))}
                placeholder="e.g., 150"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-300 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">
                Number of people directly impacted by this update
              </p>
            </div>

            {/* Challenges */}
            <div>
              <label htmlFor="challenges" className="block text-sm text-slate-700 mb-2">
                Challenges Faced (Optional)
              </label>
              <textarea
                id="challenges"
                value={formState.challenges || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, challenges: e.target.value }))}
                placeholder="Example: Transportation delays due to weather conditions, limited volunteer availability during weekdays, need for additional educational materials..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-300 focus:outline-none resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-500">
                  Any obstacles encountered during implementation
                </p>
                <span className="text-xs text-slate-400">
                  {formState.challenges?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Immediate Outcomes */}
            <div>
              <label htmlFor="outcomes" className="block text-sm text-slate-700 mb-2">
                Immediate Outcomes (Optional)
              </label>
              <textarea
                id="outcomes"
                value={formState.immediateOutcomes || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, immediateOutcomes: e.target.value }))}
                placeholder="Example: Students actively participated in reading sessions, teachers provided positive feedback, community leaders expressed interest in expanding the program..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-300 focus:outline-none resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-500">
                  Immediate results and impacts observed
                </p>
                <span className="text-xs text-slate-400">
                  {formState.immediateOutcomes?.length || 0}/500
                </span>
              </div>
            </div>

            {/* On-Ground Notes */}
            <div>
              <label htmlFor="ground-notes" className="block text-sm text-slate-700 mb-2">
                On-Ground Notes (Optional)
              </label>
              <textarea
                id="ground-notes"
                value={formState.onGroundNotes || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, onGroundNotes: e.target.value }))}
                placeholder="Example: Local community showed strong support, weather was favorable, logistics went smoothly..."
                rows={2}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-300 focus:outline-none resize-none"
                maxLength={300}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-500">
                  Additional field observations
                </p>
                <span className="text-xs text-slate-400">
                  {formState.onGroundNotes?.length || 0}/300
                </span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-center">
                <p className="text-2xl text-emerald-700">{formState.tasksCompleted.length}</p>
                <p className="text-xs text-emerald-600 mt-1">Tasks Completed</p>
              </div>
              <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-center">
                <p className="text-2xl text-indigo-700">{formState.mediaItems.length}</p>
                <p className="text-xs text-indigo-600 mt-1">Media Uploaded</p>
              </div>
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
                <p className="text-2xl text-blue-700">{formState.beneficiariesCount || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Beneficiaries</p>
              </div>
            </div>

            {/* Report Preview */}
            <div>
              <h5 className="text-sm text-slate-700 mb-2">Progress Report</h5>
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <p className="text-sm text-slate-900 whitespace-pre-wrap">
                  {formState.reportText}
                </p>
              </div>
            </div>

            {/* Media Preview */}
            {formState.mediaItems.length > 0 && (
              <div>
                <h5 className="text-sm text-slate-700 mb-2">Media Files</h5>
                <div className="grid grid-cols-4 gap-3">
                  {formState.mediaItems.slice(0, 8).map((media, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                      {media.thumbnail_url ? (
                        <img src={media.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <span className="text-xs text-slate-400">{media.type}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {formState.mediaItems.length > 8 && (
                    <div className="aspect-square rounded-lg bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                      <span className="text-sm text-slate-600">+{formState.mediaItems.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Confirmation */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.confirmed}
                  onChange={(e) => setFormState(prev => ({ ...prev, confirmed: e.target.checked }))}
                  className="w-5 h-5 rounded border-2 border-amber-300 mt-0.5"
                />
                <span className="text-sm text-amber-900">
                  I confirm that this update is accurate and all information provided is truthful and verifiable.
                </span>
              </label>
            </div>
          </div>
        );
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`
          fixed z-50 animate-in slide-in-from-bottom duration-300
          ${isMobile ? 'inset-0' : 'inset-4 md:inset-10 lg:inset-20'}
        `}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white rounded-t-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="mb-1">Submit Project Update</h2>
                <p className="text-sm text-indigo-100">{project.title}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${formState.currentStep === step.id
                          ? 'bg-white text-indigo-600 ring-4 ring-white/30'
                          : formState.currentStep > step.id
                          ? 'bg-indigo-400 text-white'
                          : 'bg-indigo-800/50 text-indigo-200'
                        }
                      `}
                    >
                      {formState.currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm">{step.id}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-2 text-center ${formState.currentStep === step.id ? 'text-white' : 'text-indigo-200'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-indigo-400/30 mx-2 mb-8" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between rounded-b-2xl">
            <button
              onClick={handleBack}
              disabled={formState.currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 transition-all
                ${formState.currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'border-slate-200 text-slate-700 hover:bg-white'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {formState.currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all
                  ${canProceedToNext()
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitUpdate}
                disabled={!canProceedToNext() || isSubmitting}
                className={`
                  flex items-center gap-2 px-8 py-2.5 rounded-lg transition-all
                  ${canProceedToNext() && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Update</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}