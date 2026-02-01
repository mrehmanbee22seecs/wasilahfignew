import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Save, Eye, Check, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { FileUploader, UploadedFile } from './FileUploader';
import { MapPicker } from './MapPicker';
import { ProjectPreviewModal } from './ProjectPreviewModal';
import { SDG_LIST } from '../../types/projects';
import type { ProjectType, DeliveryMode, BudgetBreakdown, Approver, CreateProjectRequest } from '../../types/projects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: CreateProjectRequest) => void;
  onSaveDraft?: (project: Partial<CreateProjectRequest>) => void;
  initialData?: Partial<CreateProjectRequest>;
}

const STEPS = [
  { number: 1, label: 'Basic Info', id: 'basic' },
  { number: 2, label: 'Logistics', id: 'logistics' },
  { number: 3, label: 'Budget & Approvals', id: 'budget' },
  { number: 4, label: 'Media & Uploads', id: 'media' },
  { number: 5, label: 'Review & Create', id: 'review' }
];

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
  onSaveDraft,
  initialData
}: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form data
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.short_description || '');
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>(initialData?.sdgs || []);
  const [projectType, setProjectType] = useState<ProjectType>(initialData?.type || 'education');
  const [slug, setSlug] = useState(initialData?.slug || '');
  
  const [country, setCountry] = useState(initialData?.location?.country || 'Pakistan');
  const [city, setCity] = useState(initialData?.location?.city || '');
  const [address, setAddress] = useState(initialData?.location?.address || '');
  const [startDate, setStartDate] = useState(initialData?.start_date || '');
  const [endDate, setEndDate] = useState(initialData?.end_date || '');
  const [volunteerTarget, setVolunteerTarget] = useState(initialData?.volunteer_target?.toString() || '');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(initialData?.delivery_mode || 'on-ground');
  
  const [budget, setBudget] = useState(initialData?.budget?.toString() || '');
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown[]>(
    initialData?.budget_breakdown || [{ category: '', amount: 0, notes: '' }]
  );
  const [upfrontPercent, setUpfrontPercent] = useState('50');
  const [paymentSchedule, setPaymentSchedule] = useState('milestone-based');
  const [approvers, setApprovers] = useState<Approver[]>(initialData?.approvers || []);
  
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);
  const [documentFiles, setDocumentFiles] = useState<UploadedFile[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !initialData?.slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, initialData]);

  // Auto-save draft (debounced)
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    
    const timer = setTimeout(() => {
      handleSaveDraft();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [title, description, selectedSDGs, city, startDate, endDate, budget, hasUnsavedChanges]);

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const draftData: Partial<CreateProjectRequest> = {
        title,
        slug,
        short_description: description,
        sdgs: selectedSDGs,
        type: projectType,
        location: { country, city, address },
        start_date: startDate,
        end_date: endDate,
        volunteer_target: parseInt(volunteerTarget) || 0,
        delivery_mode: deliveryMode,
        budget: parseFloat(budget) || 0,
        budget_breakdown: budgetBreakdown.filter((b): b is BudgetBreakdown => 
          Boolean(b.category && b.amount > 0 && b.notes !== undefined)
        ),
        approvers
      };
      
      onSaveDraft(draftData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!title || title.length < 6) newErrors.title = 'Title must be at least 6 characters';
      if (title.length > 150) newErrors.title = 'Title must be less than 150 characters';
      if (!description) newErrors.description = 'Description is required';
      if (description.length > 400) newErrors.description = 'Description must be less than 400 characters';
      if (selectedSDGs.length === 0) newErrors.sdgs = 'Select at least one SDG';
      if (selectedSDGs.length > 5) newErrors.sdgs = 'Maximum 5 SDGs allowed';
    }
    
    if (step === 2) {
      if (!city) newErrors.city = 'City is required';
      if (!startDate) newErrors.startDate = 'Start date is required';
      if (!endDate) newErrors.endDate = 'End date is required';
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    if (step === 3) {
      if (!budget || parseFloat(budget) <= 0) newErrors.budget = 'Budget must be greater than 0';
      
      const totalBreakdown = budgetBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0);
      const budgetNum = parseFloat(budget) || 0;
      if (Math.abs(totalBreakdown - budgetNum) > 1) {
        newErrors.budgetBreakdown = `Breakdown total (${totalBreakdown.toLocaleString()}) must equal budget (${budgetNum.toLocaleString()})`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      setHasUnsavedChanges(true);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCreate = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Please fix all validation errors');
      return;
    }
    
    const projectData: CreateProjectRequest = {
      company_id: 'comp_123', // This would come from auth context
      title,
      slug,
      short_description: description,
      sdgs: selectedSDGs,
      type: projectType,
      location: { country, city, address },
      start_date: startDate,
      end_date: endDate,
      volunteer_target: parseInt(volunteerTarget) || 0,
      delivery_mode: deliveryMode,
      budget: parseFloat(budget),
      budget_breakdown: budgetBreakdown.filter((b): b is BudgetBreakdown => 
        Boolean(b.category && b.amount > 0 && b.notes !== undefined)
      ),
      approvers: approvers.filter(a => a.name && a.email),
      media_ids: imageFiles.filter(f => f.status === 'success').map(f => f.id),
      documents_ids: documentFiles.filter(f => f.status === 'success').map(f => f.id)
    };
    
    onCreate(projectData);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const addBudgetRow = () => {
    setBudgetBreakdown([...budgetBreakdown, { category: '', amount: 0, notes: '' }]);
    setHasUnsavedChanges(true);
  };

  const removeBudgetRow = (index: number) => {
    setBudgetBreakdown(budgetBreakdown.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const updateBudgetRow = (index: number, field: keyof BudgetBreakdown, value: any) => {
    const updated = [...budgetBreakdown];
    updated[index] = { ...updated[index], [field]: value };
    setBudgetBreakdown(updated);
    setHasUnsavedChanges(true);
  };

  const addApprover = () => {
    setApprovers([...approvers, { name: '', email: '' }]);
    setHasUnsavedChanges(true);
  };

  const removeApprover = (index: number) => {
    setApprovers(approvers.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const updateApprover = (index: number, field: keyof Approver, value: string) => {
    const updated = [...approvers];
    updated[index] = { ...updated[index], [field]: value };
    setApprovers(updated);
    setHasUnsavedChanges(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        <div 
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 animate-in slide-in-from-bottom-4 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-slate-200 rounded-t-2xl px-8 py-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="create-project-title" className="text-slate-900">
                  {initialData ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {lastSaved && (
                  <span className="text-xs text-slate-500">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Save draft"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${currentStep > step.number 
                        ? 'bg-teal-600 text-white' 
                        : currentStep === step.number
                        ? 'bg-teal-100 text-teal-700 border-2 border-teal-600'
                        : 'bg-slate-100 text-slate-400'
                      }
                    `}>
                      {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                    </div>
                    <span className={`text-xs hidden md:inline ${
                      currentStep === step.number ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${
                      currentStep > step.number ? 'bg-teal-600' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm text-slate-700 mb-2">
                    Project Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    maxLength={150}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.title ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="e.g., Clean Karachi Drive 2026"
                    aria-describedby={errors.title ? "title-error" : undefined}
                  />
                  {errors.title && (
                    <p id="title-error" className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">{title.length}/150 characters</p>
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm text-slate-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="auto-generated-from-title"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    wasilah.com/projects/{slug || 'your-slug'}
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm text-slate-700 mb-2">
                    Short Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    maxLength={400}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${
                      errors.description ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Briefly describe the project goals, activities, and expected impact..."
                    aria-describedby={errors.description ? "description-error" : undefined}
                  />
                  {errors.description && (
                    <p id="description-error" className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">{description.length}/400 characters</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    UN Sustainable Development Goals <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-4 border-2 border-slate-200 rounded-lg">
                    {SDG_LIST.map(sdg => (
                      <label
                        key={sdg.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          selectedSDGs.includes(sdg.id)
                            ? 'bg-teal-50 border-2 border-teal-600'
                            : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSDGs.includes(sdg.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSDGs([...selectedSDGs, sdg.id]);
                            } else {
                              setSelectedSDGs(selectedSDGs.filter(id => id !== sdg.id));
                            }
                            setHasUnsavedChanges(true);
                          }}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-xs text-slate-700">{sdg.id}. {sdg.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.sdgs && (
                    <p className="text-sm text-red-600 mt-1">{errors.sdgs}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Selected: {selectedSDGs.length} (min 1, max 5)
                  </p>
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm text-slate-700 mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={projectType}
                    onChange={(e) => {
                      setProjectType(e.target.value as ProjectType);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="environment">Environment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Logistics */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="country" className="block text-sm text-slate-700 mb-2">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Pakistan"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm text-slate-700 mb-2">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.city ? 'border-red-300' : 'border-slate-200'
                      }`}
                      placeholder="Karachi"
                      aria-describedby={errors.city ? "city-error" : undefined}
                    />
                    {errors.city && (
                      <p id="city-error" className="text-sm text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm text-slate-700 mb-2">
                    Address (Optional)
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Specific location or landmark"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm text-slate-700 mb-2">
                      Start Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.startDate ? 'border-red-300' : 'border-slate-200'
                      }`}
                      aria-describedby={errors.startDate ? "startDate-error" : undefined}
                    />
                    {errors.startDate && (
                      <p id="startDate-error" className="text-sm text-red-600 mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm text-slate-700 mb-2">
                      End Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.endDate ? 'border-red-300' : 'border-slate-200'
                      }`}
                      aria-describedby={errors.endDate ? "endDate-error" : undefined}
                    />
                    {errors.endDate && (
                      <p id="endDate-error" className="text-sm text-red-600 mt-1">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="volunteerTarget" className="block text-sm text-slate-700 mb-2">
                    Volunteer Target
                  </label>
                  <input
                    id="volunteerTarget"
                    type="number"
                    value={volunteerTarget}
                    onChange={(e) => {
                      setVolunteerTarget(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 120"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    How many volunteers are needed for this project?
                  </p>
                </div>

                <div>
                  <label htmlFor="deliveryMode" className="block text-sm text-slate-700 mb-2">
                    Delivery Mode
                  </label>
                  <select
                    id="deliveryMode"
                    value={deliveryMode}
                    onChange={(e) => {
                      setDeliveryMode(e.target.value as DeliveryMode);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="on-ground">On-ground</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Map Picker */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Pin Location on Map
                  </label>
                  <MapPicker
                    city={city}
                    address={address}
                    onLocationChange={(lat, lng, formattedAddress) => {
                      console.log('Selected location:', lat, lng, formattedAddress);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget & Approvals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="budget" className="block text-sm text-slate-700 mb-2">
                    Total Budget (PKR) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    min="0"
                    step="1000"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.budget ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="250000"
                    aria-describedby={errors.budget ? "budget-error" : undefined}
                  />
                  {errors.budget && (
                    <p id="budget-error" className="text-sm text-red-600 mt-1">{errors.budget}</p>
                  )}
                  {budget && (
                    <p className="text-xs text-slate-500 mt-1">
                      PKR {parseFloat(budget).toLocaleString('en-PK')}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm text-slate-700">
                      Budget Breakdown
                    </label>
                    <button
                      onClick={addBudgetRow}
                      className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Row
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {budgetBreakdown.map((row, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={row.category}
                          onChange={(e) => updateBudgetRow(index, 'category', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                          placeholder="Category (e.g., Logistics)"
                        />
                        <input
                          type="number"
                          value={row.amount || ''}
                          onChange={(e) => updateBudgetRow(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-32 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                          placeholder="Amount"
                          min="0"
                        />
                        <input
                          type="text"
                          value={row.notes || ''}
                          onChange={(e) => updateBudgetRow(index, 'notes', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                          placeholder="Notes (optional)"
                        />
                        <button
                          onClick={() => removeBudgetRow(index)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          aria-label="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {errors.budgetBreakdown && (
                    <p className="text-sm text-red-600 mt-2">{errors.budgetBreakdown}</p>
                  )}
                  
                  <div className={`mt-3 p-3 rounded-lg ${
                    Math.abs(budgetBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0) - (parseFloat(budget) || 0)) > 1
                      ? 'bg-orange-50 border-2 border-orange-300'
                      : 'bg-slate-50'
                  }`}>
                    {Math.abs(budgetBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0) - (parseFloat(budget) || 0)) > 1 && (
                      <div className="flex items-center gap-2 text-orange-700 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">Breakdown doesn't match budget</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-700">
                      Total: PKR {budgetBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString('en-PK')}
                    </p>
                  </div>
                </div>

                {/* Payment Terms */}
                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Payment Terms
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="upfrontPercent" className="block text-xs text-slate-600 mb-1">
                        Upfront Payment (%)
                      </label>
                      <input
                        id="upfrontPercent"
                        type="number"
                        value={upfrontPercent}
                        onChange={(e) => {
                          setUpfrontPercent(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                        placeholder="50"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {upfrontPercent && budget ? `PKR ${((parseFloat(upfrontPercent) / 100) * parseFloat(budget)).toLocaleString('en-PK')}` : '—'}
                      </p>
                    </div>
                    <div>
                      <label htmlFor="paymentSchedule" className="block text-xs text-slate-600 mb-1">
                        Payment Schedule
                      </label>
                      <select
                        id="paymentSchedule"
                        value={paymentSchedule}
                        onChange={(e) => {
                          setPaymentSchedule(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                      >
                        <option value="milestone-based">Milestone-based</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="completion">On Completion</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm text-slate-700">
                      Approvers (Optional)
                    </label>
                    <button
                      onClick={addApprover}
                      className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Approver
                    </button>
                  </div>
                  
                  {approvers.length > 0 && (
                    <div className="space-y-3">
                      {approvers.map((approver, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={approver.name}
                            onChange={(e) => updateApprover(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="email"
                            value={approver.email}
                            onChange={(e) => updateApprover(index, 'email', e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                            placeholder="Email"
                          />
                          <button
                            onClick={() => removeApprover(index)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            aria-label="Remove approver"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Media & Uploads */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <FileUploader
                  accept="image/jpeg,image/png,image/webp"
                  maxFiles={10}
                  maxSizeBytes={10 * 1024 * 1024}
                  files={imageFiles}
                  onFilesChange={setImageFiles}
                  label="Project Images"
                  helpText="Upload project photos, banners, or visuals (JPG, PNG, WEBP)"
                />

                <FileUploader
                  accept=".pdf,.doc,.docx"
                  maxFiles={5}
                  maxSizeBytes={10 * 1024 * 1024}
                  files={documentFiles}
                  onFilesChange={setDocumentFiles}
                  label="Documents"
                  helpText="Upload project proposals, budgets, or supporting documents (PDF, DOC, DOCX)"
                />

                <div>
                  <label htmlFor="videoUrl" className="block text-sm text-slate-700 mb-2">
                    Project Video URL (Optional)
                  </label>
                  <input
                    id="videoUrl"
                    type="text"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review & Create */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-xl space-y-4">
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Project Title</h3>
                    <p className="text-slate-900">{title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Description</h3>
                    <p className="text-sm text-slate-700">{description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-slate-500 mb-2">SDGs</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSDGs.map(id => {
                        const sdg = SDG_LIST.find(s => s.id === id);
                        return (
                          <span
                            key={id}
                            className="px-3 py-1 bg-white border-2 border-slate-200 rounded-full text-xs text-slate-700"
                          >
                            {sdg?.id}. {sdg?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-slate-500 mb-1">Location</h3>
                      <p className="text-sm text-slate-900">{city}, {country}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-slate-500 mb-1">Dates</h3>
                      <p className="text-sm text-slate-900">
                        {startDate} to {endDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-slate-500 mb-1">Budget</h3>
                      <p className="text-slate-900">PKR {parseFloat(budget).toLocaleString('en-PK')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-slate-500 mb-1">Volunteers Needed</h3>
                      <p className="text-slate-900">{volunteerTarget}</p>
                    </div>
                  </div>
                  
                  {imageFiles.filter(f => f.status === 'success').length > 0 && (
                    <div>
                      <h3 className="text-sm text-slate-500 mb-2">Uploaded Images</h3>
                      <div className="flex flex-wrap gap-2">
                        {imageFiles.filter(f => f.status === 'success').map(file => (
                          <div key={file.id} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-200">
                            {file.url && <img src={file.url} alt={file.name} className="w-full h-full object-cover" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Review all information before creating. You can edit the project later.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 rounded-b-2xl px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              <div className="flex items-center gap-3">
                {currentStep === 5 && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                )}
                
                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Create Project
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ProjectPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={{
          title,
          description,
          selectedSDGs,
          city,
          country,
          address,
          startDate,
          endDate,
          volunteerTarget,
          budget,
          budgetBreakdown,
          imageFiles
        }}
      />
    </>
  );
}