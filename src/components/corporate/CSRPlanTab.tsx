import React, { useState, useEffect } from 'react';
import { Save, Globe, Target, DollarSign, BarChart3, CheckCircle, Clock, AlertCircle, History, PieChart } from 'lucide-react';
import { BudgetPieChart } from './BudgetPieChart';
import { VersionHistoryDrawer, PlanVersion } from './VersionHistoryDrawer';
import { ApprovalSignoffsSection, Approver } from './ApprovalSignoffsSection';

interface CSRPlanData {
  id: string;
  title: string;
  executiveSummary: string;
  objectives: Array<{ id: string; text: string }>;
  sdgs: string[];
  projects: Array<{ projectId: string; name: string; start: string; end: string }>;
  budgetAllocation: Array<{ category: string; amount: number }>;
  kpis: Array<{ label: string; target: number }>;
  status: 'draft' | 'published';
  lastSavedAt?: string;
}

interface CSRPlanTabProps {
  planData: CSRPlanData;
  onSave: (data: CSRPlanData) => void;
  onPublish: (data: CSRPlanData) => void;
}

export function CSRPlanTab({ planData, onSave, onPublish }: CSRPlanTabProps) {
  const [formData, setFormData] = useState<CSRPlanData>(planData);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showBudgetChart, setShowBudgetChart] = useState(true);

  // Mock version history - replace with actual data from backend
  const [versions] = useState<PlanVersion[]>([
    {
      id: 'v3',
      versionNumber: 3,
      createdAt: '2025-01-07T14:30:00Z',
      createdBy: 'Ahmed Khan',
      changesSummary: 'Updated budget allocation for Q2 projects',
      status: 'draft',
      objectivesCount: 5,
      sdgsCount: 4,
      totalBudget: 5000000
    },
    {
      id: 'v2',
      versionNumber: 2,
      createdAt: '2025-01-01T10:00:00Z',
      createdBy: 'Sara Malik',
      changesSummary: 'Added new education SDG and revised KPIs',
      status: 'published',
      objectivesCount: 5,
      sdgsCount: 3,
      totalBudget: 4500000
    },
    {
      id: 'v1',
      versionNumber: 1,
      createdAt: '2024-12-15T09:00:00Z',
      createdBy: 'Ahmed Khan',
      changesSummary: 'Initial CSR plan for 2025',
      status: 'published',
      objectivesCount: 4,
      sdgsCount: 2,
      totalBudget: 4000000
    }
  ]);

  // Mock approvers - replace with actual data from backend
  const [approvers, setApprovers] = useState<Approver[]>([
    {
      id: 'a1',
      name: 'Ali Raza',
      role: 'Chief Financial Officer',
      email: 'ali.raza@company.com',
      status: 'approved',
      signedAt: '2025-01-06T15:30:00Z',
      comments: 'Budget allocation looks good. Approved.',
      required: true
    },
    {
      id: 'a2',
      name: 'Fatima Sheikh',
      role: 'Head of CSR',
      email: 'fatima.sheikh@company.com',
      status: 'pending',
      required: true
    },
    {
      id: 'a3',
      name: 'Hassan Ahmed',
      role: 'CEO',
      email: 'hassan.ahmed@company.com',
      status: 'pending',
      required: true
    },
    {
      id: 'a4',
      name: 'Sana Khan',
      role: 'Legal Advisor',
      email: 'sana.khan@company.com',
      status: 'pending',
      required: false
    }
  ]);

  // Autosave with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(planData)) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleAutoSave = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSave(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const handlePublish = () => {
    // Validate required fields
    if (!formData.title || formData.objectives.length === 0) {
      alert('Please complete all required fields before publishing');
      return;
    }
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    onPublish({ ...formData, status: 'published' });
    setShowPublishModal(false);
  };

  const allSDGs = [
    { id: '1', name: 'No Poverty' },
    { id: '2', name: 'Zero Hunger' },
    { id: '3', name: 'Good Health' },
    { id: '4', name: 'Quality Education' },
    { id: '5', name: 'Gender Equality' },
    { id: '6', name: 'Clean Water' },
    { id: '7', name: 'Clean Energy' },
    { id: '8', name: 'Decent Work' },
    { id: '9', name: 'Industry' },
    { id: '10', name: 'Reduced Inequalities' },
    { id: '11', name: 'Sustainable Cities' },
    { id: '12', name: 'Responsible Consumption' },
    { id: '13', name: 'Climate Action' },
    { id: '14', name: 'Life Below Water' },
    { id: '15', name: 'Life on Land' },
    { id: '16', name: 'Peace & Justice' },
    { id: '17', name: 'Partnerships' }
  ];

  const toggleSDG = (sdgId: string) => {
    setFormData(prev => ({
      ...prev,
      sdgs: prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter(id => id !== sdgId)
        : [...prev.sdgs, sdgId]
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: `obj-${Date.now()}`, text: '' }]
    }));
  };

  const updateObjective = (id: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => obj.id === id ? { ...obj, text } : obj)
    }));
  };

  const removeObjective = (id: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">CSR Plan Editor</h1>
          <p className="text-slate-600">Plan and document your corporate social responsibility strategy</p>
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-4">
          {saveStatus && (
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' && (
                <>
                  <Clock className="w-4 h-4 text-slate-600 animate-spin" />
                  <span className="text-slate-600">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Error saving</span>
                </>
              )}
            </div>
          )}

          {/* Status Badge */}
          <span className={`px-4 py-2 rounded-full border-2 text-sm ${
            formData.status === 'published'
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {formData.status === 'published' ? 'Published' : 'Draft'}
          </span>

          {/* Actions */}
          <button
            onClick={handleAutoSave}
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            disabled={formData.status === 'published'}
          >
            <CheckCircle className="w-5 h-5" />
            Publish
          </button>
        </div>
      </div>

      {/* Plan Sections */}
      <div className="space-y-6">
        {/* 1. Title & Executive Summary */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            Plan Overview
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Plan Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors"
                placeholder="e.g., 2025 CSR Plan"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Executive Summary</label>
              <textarea
                value={formData.executiveSummary}
                onChange={(e) => setFormData({ ...formData, executiveSummary: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                rows={4}
                placeholder="Brief overview of your CSR strategy and goals..."
              />
            </div>
          </div>
        </div>

        {/* 2. Annual Objectives */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Annual Objectives *
            </h3>
            <button
              onClick={addObjective}
              className="px-4 py-2 border-2 border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-sm"
            >
              + Add Objective
            </button>
          </div>

          <div className="space-y-3">
            {formData.objectives.map((objective, index) => (
              <div key={objective.id} className="flex items-center gap-3">
                <span className="text-slate-600 flex-shrink-0">{index + 1}.</span>
                <input
                  type="text"
                  value={objective.text}
                  onChange={(e) => updateObjective(objective.id, e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-colors"
                  placeholder="Enter objective..."
                />
                <button
                  onClick={() => removeObjective(objective.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Target SDGs */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Target SDGs
          </h3>

          <div className="grid grid-cols-9 gap-3">
            {allSDGs.map((sdg) => {
              const isSelected = formData.sdgs.includes(sdg.id);
              return (
                <button
                  key={sdg.id}
                  onClick={() => toggleSDG(sdg.id)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all relative ${
                    isSelected
                      ? 'bg-teal-600 text-white ring-4 ring-teal-600 ring-offset-2 shadow-lg scale-110'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                  title={sdg.name}
                >
                  {sdg.id}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Budget Allocation */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Budget Allocation
          </h3>

          <div className="space-y-3">
            {formData.budgetAllocation.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => {
                    const newBudget = [...formData.budgetAllocation];
                    newBudget[index].category = e.target.value;
                    setFormData({ ...formData, budgetAllocation: newBudget });
                  }}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Category (e.g., Education)"
                />
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">PKR</span>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => {
                      const newBudget = [...formData.budgetAllocation];
                      newBudget[index].amount = Number(e.target.value);
                      setFormData({ ...formData, budgetAllocation: newBudget });
                    }}
                    className="w-full pl-16 pr-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    placeholder="Amount"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t-2 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-700">View as:</span>
              <button
                onClick={() => setShowBudgetChart(!showBudgetChart)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-sm"
              >
                <PieChart className="w-4 h-4" />
                {showBudgetChart ? 'Show List' : 'Show Chart'}
              </button>
            </div>

            {showBudgetChart ? (
              <BudgetPieChart budgetAllocation={formData.budgetAllocation} />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Total Budget:</span>
                <span className="text-slate-900 text-xl">
                  PKR {formData.budgetAllocation.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. KPIs */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            Key Performance Indicators
          </h3>

          <div className="space-y-3">
            {formData.kpis.map((kpi, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={kpi.label}
                  onChange={(e) => {
                    const newKPIs = [...formData.kpis];
                    newKPIs[index].label = e.target.value;
                    setFormData({ ...formData, kpis: newKPIs });
                  }}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="KPI Name"
                />
                <input
                  type="number"
                  value={kpi.target}
                  onChange={(e) => {
                    const newKPIs = [...formData.kpis];
                    newKPIs[index].target = Number(e.target.value);
                    setFormData({ ...formData, kpis: newKPIs });
                  }}
                  className="w-32 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Target"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. Approval Signoffs */}
        <ApprovalSignoffsSection
          approvers={approvers}
          currentUserRole="fatima.sheikh@company.com"
          planStatus={formData.status === 'published' ? 'published' : 'draft'}
          onRequestApproval={(approverIds) => {
            console.log('Requesting approval from:', approverIds);
            alert(`Approval requests sent to ${approverIds.length} approvers`);
          }}
          onApprove={(approverId, comments) => {
            console.log('Approved:', approverId, comments);
            setApprovers(prev =>
              prev.map(a =>
                a.id === approverId
                  ? { ...a, status: 'approved', signedAt: new Date().toISOString(), comments }
                  : a
              )
            );
          }}
          onReject={(approverId, comments) => {
            console.log('Rejected:', approverId, comments);
            setApprovers(prev =>
              prev.map(a =>
                a.id === approverId
                  ? { ...a, status: 'rejected', signedAt: new Date().toISOString(), comments }
                  : a
              )
            );
          }}
          onRemindApprover={(approverId) => {
            console.log('Reminder sent to:', approverId);
            alert('Reminder email sent!');
          }}
        />
      </div>

      {/* Version History Drawer */}
      <VersionHistoryDrawer
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        versions={versions}
        currentVersionId="v3"
        onViewVersion={(versionId) => {
          console.log('Viewing version:', versionId);
          alert(`Opening version ${versionId} in read-only mode`);
        }}
        onRestoreVersion={(versionId) => {
          console.log('Restoring version:', versionId);
          if (confirm('Create a new draft based on this version?')) {
            alert(`New draft created from version ${versionId}`);
          }
        }}
        onDownloadVersion={(versionId) => {
          console.log('Downloading version:', versionId);
          alert(`Downloading version ${versionId} as PDF...`);
        }}
      />
    </div>
  );
}