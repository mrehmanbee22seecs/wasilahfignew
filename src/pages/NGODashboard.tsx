import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Menu, X, FileText, User, TrendingUp, Home, MessageSquare, HelpCircle, LogOut, FolderKanban, DollarSign, PieChart } from 'lucide-react';
import { TimelineStepper } from '../components/ngo-dashboard/TimelineStepper';
import { RequestVerificationModal } from '../components/ngo-dashboard/modals/RequestVerificationModal';
import { VettingWarningModal } from '../components/ngo-dashboard/modals/VettingWarningModal';
import { OverviewTab } from '../components/ngo-dashboard/tabs/OverviewTab';
import { DocumentsTab } from '../components/ngo-dashboard/tabs/DocumentsTab';
import { ScorecardTab } from '../components/ngo-dashboard/tabs/ScorecardTab';
import { ProfileVerificationTab } from '../components/ngo-dashboard/tabs/ProfileVerificationTab';
import { ProjectsTab } from '../components/ngo-projects/tabs/ProjectsTab';
import { ReportsTab } from '../components/ngo-projects/tabs/ReportsTab';
import { SubmitUpdateModal } from '../components/ngo-projects/SubmitUpdateModal';
import { PaymentRequestsTab } from '../components/ngo-payments/PaymentRequestsTab';
import { BudgetVsActualTab } from '../components/ngo-payments/BudgetVsActualTab';
import { MOCK_DASHBOARD_DATA, DOCUMENT_CHECKLIST } from '../data/mockNGOData';
import { MOCK_NGO_PROJECTS, MOCK_PROJECT_REPORTS } from '../data/mockNGOProjects';
import { 
  MOCK_PAYMENT_REQUESTS, 
  MOCK_PROJECT_BUDGET_SUMMARY, 
  MOCK_EXPENSES,
  MOCK_PAYMENT_MILESTONES 
} from '../data/mockNGOPayments';
import type { VerificationStatus } from '../types/ngo';
import type { NGOAssignedProject, ProjectUpdate } from '../types/ngo-projects';
import type { PaymentRequest, Expense } from '../types/ngo-payments';
import { toast } from 'sonner@2.0.3';

type TabId = 'overview' | 'profile' | 'documents' | 'scorecard' | 'projects' | 'payments' | 'budget';

const TABS = [
  { id: 'overview' as TabId, label: 'Overview', icon: Home },
  { id: 'projects' as TabId, label: 'Projects', icon: FolderKanban },
  { id: 'payments' as TabId, label: 'Payments', icon: DollarSign },
  { id: 'budget' as TabId, label: 'Budget', icon: PieChart },
  { id: 'profile' as TabId, label: 'Profile & Verification', icon: User },
  { id: 'documents' as TabId, label: 'Documents', icon: FileText },
  { id: 'scorecard' as TabId, label: 'Scorecard', icon: TrendingUp }
];

export default function NGODashboard({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVettingWarningModal, setShowVettingWarningModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(MOCK_DASHBOARD_DATA);
  const [highlightMissingDocs, setHighlightMissingDocs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsData, setProjectsData] = useState(MOCK_NGO_PROJECTS);
  const [reportsData, setReportsData] = useState(MOCK_PROJECT_REPORTS);
  const [showSubmitUpdateModal, setShowSubmitUpdateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<NGOAssignedProject | null>(null);
  const [pendingVerificationNotes, setPendingVerificationNotes] = useState('');
  
  // Payment & Budget state
  const [paymentRequests, setPaymentRequests] = useState(MOCK_PAYMENT_REQUESTS);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [budgetSummary, setBudgetSummary] = useState(MOCK_PROJECT_BUDGET_SUMMARY);

  const { ngo, vetting, stats, scorecard } = dashboardData;
  const verificationStatus = vetting.status;

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          label: 'Verified'
        };
      case 'in_progress':
        return {
          icon: Clock,
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          label: 'In Progress'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          label: 'Pending'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'bg-rose-100 text-rose-700 border-rose-200',
          label: 'Rejected'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Unverified'
        };
    }
  };

  const statusConfig = getStatusConfig(verificationStatus);
  const StatusIcon = statusConfig.icon;

  const timelineSteps = [
    { label: 'Profile Created', status: 'completed' as const },
    { label: 'Docs Submitted', status: vetting.timeline.length > 0 ? 'completed' as const : 'upcoming' as const },
    { label: 'Vetting Requested', status: verificationStatus !== 'unverified' ? 'completed' as const : 'upcoming' as const },
    { label: 'Site Visit', status: verificationStatus === 'in_progress' ? 'current' as const : verificationStatus === 'verified' ? 'completed' as const : 'upcoming' as const },
    { label: 'Verified', status: verificationStatus === 'verified' ? 'completed' as const : 'upcoming' as const }
  ];

  const currentStep = timelineSteps.findIndex(step => step.status === 'current') + 1 || 
                      timelineSteps.filter(step => step.status === 'completed').length;

  const handleRequestVerification = async (notes: string) => {
    // Check if all required documents are uploaded
    const missingDocs = DOCUMENT_CHECKLIST.filter(
      item => item.required && item.status === 'missing'
    );
    const expiredDocs = DOCUMENT_CHECKLIST.filter(item => item.status === 'expired');

    if (missingDocs.length > 0 || expiredDocs.length > 0) {
      // Scroll to Documents tab and highlight missing items
      setActiveTab('documents');
      setShowVerificationModal(false);
      setHighlightMissingDocs(true);
      
      // Highlight missing items with toast
      toast.error(
        `Cannot submit verification: ${missingDocs.length} missing and ${expiredDocs.length} expired document(s). Please upload required documents.`,
        { duration: 5000 }
      );
      
      // Scroll to documents section
      setTimeout(() => {
        const documentsSection = document.getElementById('documents-section');
        if (documentsSection) {
          documentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      // Reset highlight after animation
      setTimeout(() => setHighlightMissingDocs(false), 3500);
      
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update status
    setDashboardData(prev => ({
      ...prev,
      vetting: {
        ...prev.vetting,
        status: 'pending',
        timeline: [
          ...prev.vetting.timeline,
          {
            id: `audit_${Date.now()}`,
            vetting_request_id: prev.vetting.last_request?.id || '',
            action: 'submit',
            user_id: 'current_user',
            user_name: 'Current User',
            user_role: 'ngo_admin',
            note: notes || 'Verification request submitted by NGO',
            created_at: new Date().toISOString()
          }
        ]
      },
      activity_feed: [
        {
          id: `activity_${Date.now()}`,
          type: 'verification_requested',
          title: 'Verification request submitted',
          description: 'Your verification request has been submitted and is under review',
          timestamp: new Date().toISOString(),
          user_name: 'Current User',
          metadata: {
            documents_count: prev.documents.length
          }
        },
        ...prev.activity_feed
      ]
    }));

    toast.success('Verification request submitted successfully!');
  };

  const handleUploadComplete = (doc: any) => {
    setDashboardData(prev => ({
      ...prev,
      documents: [...prev.documents, doc],
      recent_uploads: [
        {
          id: `upload_${Date.now()}`,
          filename: doc.filename,
          thumbnail_url: doc.thumbnail_url,
          uploaded_at: doc.uploaded_at,
          type: doc.type
        },
        ...prev.recent_uploads
      ].slice(0, 4), // Keep only 4 most recent
      activity_feed: [
        {
          id: `activity_${Date.now()}`,
          type: 'document_uploaded',
          title: 'Document uploaded',
          description: `${doc.filename} uploaded successfully`,
          timestamp: new Date().toISOString(),
          user_name: 'current_user',
          metadata: {
            document_type: doc.type,
            filename: doc.filename
          }
        },
        ...prev.activity_feed
      ]
    }));
  };

  const handleProjectUpdateSubmit = async (update: Partial<ProjectUpdate>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update project progress
    if (update.project_id) {
      setProjectsData(prev => prev.map(p => {
        if (p.id === update.project_id) {
          const newTasksCompleted = p.tasks_completed + (update.tasks_completed?.length || 0);
          const newProgress = Math.round((newTasksCompleted / p.tasks_total) * 100);
          return {
            ...p,
            tasks_completed: newTasksCompleted,
            progress: newProgress,
            last_update: new Date().toISOString(),
            updates_count: p.updates_count + 1,
            beneficiaries_reached: p.beneficiaries_reached + (update.beneficiaries_count || 0)
          };
        }
        return p;
      }));
    }

    console.log('Update submitted:', update);
  };

  const handleDownloadReport = (reportId: string, format: 'pdf' | 'docx') => {
    const report = reportsData.find(r => r.id === reportId);
    if (report) {
      const url = format === 'pdf' ? report.file_url_pdf : report.file_url_docx;
      if (url) {
        // Simulate download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.project_title}_${format}.${format}`;
        link.click();
        toast.success(`Downloading ${report.project_title} (${format.toUpperCase()})`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b-2 border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {ngo.logo_url && (
              <img src={ngo.logo_url} alt={ngo.name} className="w-10 h-10 rounded-lg" />
            )}
            <div>
              <h3 className="text-sm text-slate-900">{ngo.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r-2 border-slate-200 z-40
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full overflow-y-auto">
            {/* NGO Header */}
            <div className="p-6 border-b-2 border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                {ngo.logo_url && (
                  <img
                    src={ngo.logo_url}
                    alt={ngo.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-sm text-slate-900 mb-1">{ngo.name}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border-2 ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-0.5">Projects</p>
                  <p className="text-lg text-slate-900">{stats.activeProjects}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-0.5">Volunteers</p>
                  <p className="text-lg text-slate-900">{stats.volunteers}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {verificationStatus === 'unverified' && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                  >
                    Request Verification
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4" role="navigation" aria-label="Dashboard navigation">
              <div className="space-y-1">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md' 
                          : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t-2 border-slate-200 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5" />
                Help Center
              </button>
              {onNavigateHome && (
                <button 
                  onClick={onNavigateHome}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  aria-label="Exit dashboard and return to home"
                >
                  <LogOut className="w-5 h-5" />
                  Exit Dashboard
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border-b-2 border-slate-200 px-6 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-slate-900 mb-1">NGO Dashboard</h1>
                  <p className="text-slate-600">
                    Manage your organization profile and verification status
                  </p>
                </div>

                {verificationStatus === 'unverified' && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    Request Verification
                  </button>
                )}
              </div>

              {/* Timeline Stepper */}
              <TimelineStepper currentStep={currentStep} steps={timelineSteps} />
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'overview' && (
                <OverviewTab data={dashboardData} />
              )}

              {activeTab === 'profile' && (
                <ProfileVerificationTab
                  ngo={ngo}
                  timeline={vetting.timeline}
                  currentStatus={verificationStatus}
                  onRequestVerification={() => setShowVerificationModal(true)}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentsTab
                  ngoId={ngo.id}
                  documents={dashboardData.documents}
                  onUploadComplete={handleUploadComplete}
                  highlightMissing={highlightMissingDocs}
                />
              )}

              {activeTab === 'scorecard' && (
                <ScorecardTab scorecard={scorecard} />
              )}

              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={projectsData}
                  reports={reportsData}
                  onSubmitUpdate={(projectId) => {
                    const project = projectsData.find(p => p.id === projectId);
                    if (project) {
                      setSelectedProject(project);
                      setShowSubmitUpdateModal(true);
                    }
                  }}
                  onViewDetails={(projectId) => {
                    toast.info('Project details would open here');
                  }}
                  onDownloadReport={handleDownloadReport}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentRequestsTab
                  requests={paymentRequests}
                  milestones={MOCK_PAYMENT_MILESTONES}
                  onCreateRequest={async (data) => {
                    console.log('Create payment request:', data);
                    // TODO: Implement Supabase insert
                    toast.success('Payment request created successfully');
                  }}
                  onUploadInvoice={async (file) => {
                    console.log('Upload invoice:', file.name);
                    // TODO: Implement Supabase Storage upload
                    return 'https://example.com/invoices/' + file.name;
                  }}
                  onUploadDocument={async (file) => {
                    console.log('Upload document:', file.name);
                    // TODO: Implement Supabase Storage upload
                    return 'https://example.com/docs/' + file.name;
                  }}
                  onDeleteDraft={(requestId) => {
                    setPaymentRequests(prev => prev.filter(r => r.id !== requestId));
                    toast.success('Draft deleted');
                  }}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetVsActualTab
                  budgetSummary={budgetSummary}
                  expenses={expenses}
                  onAddExpense={async (expense) => {
                    console.log('Add expense:', expense);
                    // TODO: Implement Supabase insert
                    toast.success('Expense added successfully');
                  }}
                  onUploadReceipt={async (file) => {
                    console.log('Upload receipt:', file.name);
                    // TODO: Implement Supabase Storage upload
                    return 'https://example.com/receipts/' + file.name;
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Request Verification Modal */}
      <RequestVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSubmit={handleRequestVerification}
        checklist={DOCUMENT_CHECKLIST}
        notes={pendingVerificationNotes}
        setNotes={setPendingVerificationNotes}
      />

      {/* Vetting Warning Modal */}
      <VettingWarningModal
        isOpen={showVettingWarningModal}
        onClose={() => setShowVettingWarningModal(false)}
        onProceed={() => handleRequestVerification(pendingVerificationNotes)}
        missingDocs={DOCUMENT_CHECKLIST.filter(item => item.status === 'missing')}
      />

      {/* Submit Update Modal */}
      <SubmitUpdateModal
        isOpen={showSubmitUpdateModal}
        onClose={() => setShowSubmitUpdateModal(false)}
        onSubmit={handleProjectUpdateSubmit}
        project={selectedProject}
      />
    </div>
  );
}