import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { DashboardNav } from '../components/corporate/DashboardNav';
import { OverviewTab } from '../components/corporate/OverviewTab';
import { CSRPlanTab } from '../components/corporate/CSRPlanTab';
import { VolunteeringTab } from '../components/corporate/VolunteeringTab';
import { CalendarTab } from '../components/corporate/CalendarTab';
import { PaymentApprovalTab } from '../components/corporate/PaymentApprovalTab';
import { BudgetTracker } from '../components/corporate/BudgetTracker';
import { ContractManagement } from '../components/corporate/ContractManagement';
import { RequestReportModal, ReportRequest } from '../components/corporate/RequestReportModal';
import { OfflineBanner } from '../components/corporate/OfflineBanner';
import { ProjectsPage } from './ProjectsPage';
import { 
  MOCK_PENDING_PAYMENTS, 
  MOCK_PAYMENT_HISTORY, 
  MOCK_BUDGET_LINES, 
  MOCK_PROJECT_BUDGETS,
  MOCK_BUDGET_ALERTS,
  MOCK_CONTRACTS,
  MOCK_BUDGET_FORECAST
} from '../data/mockCorporateData';
import { toast } from 'sonner';

export function CorporateDashboard({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'budget' | 'contracts' | 'csr-plan' | 'volunteering' | 'calendar' | 'projects'>('overview');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showRequestReportModal, setShowRequestReportModal] = useState(false);
  const [activities, setActivities] = useState([
    {
      id: 'a1',
      type: 'media_upload' as const,
      user: 'Sara Khan (Shehri CBE)',
      message: 'uploaded 12 photos from the beach cleanup event',
      projectId: 'p1',
      projectName: 'Clean Karachi Drive',
      timestamp: '2025-12-14T08:32:00Z',
      read: false
    },
    {
      id: 'a2',
      type: 'payment' as const,
      user: 'Finance Team',
      message: 'released PKR 50,000 to NGO Alfalah',
      projectId: 'p3',
      projectName: 'Healthcare Access Initiative',
      timestamp: '2025-12-13T12:00:00Z',
      read: false
    },
    {
      id: 'a3',
      type: 'volunteer_join' as const,
      user: 'Ahmed Ali',
      message: 'joined as a volunteer',
      timestamp: '2025-12-13T09:15:00Z',
      read: true
    },
    {
      id: 'a4',
      type: 'milestone' as const,
      user: 'System',
      message: 'Project milestone achieved: 50% completion',
      projectId: 'p1',
      projectName: 'Clean Karachi Drive',
      timestamp: '2025-12-12T16:00:00Z',
      read: true
    }
  ]);

  // Mock data - replace with React Query/Supabase calls
  const mockKpiData = {
    activeProjects: 12,
    beneficiariesYtd: 4385,
    csrSpendYtd: { amount: 1250000, currency: 'PKR' },
    upcomingEvents: 3,
    trends: {
      activeProjects: { pct: 5, period: 'vs Q2' },
      beneficiariesYtd: { pct: -2, period: 'vs Q2' },
      csrSpendYtd: { pct: 12, period: 'vs Q2' },
      upcomingEvents: { pct: 0, period: 'vs Q2' }
    }
  };

  const mockProjects = [
    {
      id: 'p1',
      title: 'Clean Karachi Drive',
      status: 'active' as const,
      ngoName: 'Shehri CBE',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      progress: 65,
      volunteersCount: 42,
      budget: 500000,
      spent: 325000,
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'
    },
    {
      id: 'p2',
      title: 'Skills Training for Youth',
      status: 'active' as const,
      ngoName: 'The Citizens Foundation',
      startDate: '2025-02-01',
      endDate: '2025-08-31',
      progress: 40,
      volunteersCount: 18,
      budget: 750000,
      spent: 300000,
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'
    },
    {
      id: 'p3',
      title: 'Healthcare Access Initiative',
      status: 'draft' as const,
      ngoName: 'Akhuwat Foundation',
      startDate: '2025-04-01',
      endDate: '2025-12-31',
      progress: 10,
      volunteersCount: 5,
      budget: 1000000,
      spent: 100000
    }
  ];

  const mockCSRPlan = {
    id: 'plan_2025',
    title: '2025 CSR Plan',
    executiveSummary: 'Our comprehensive CSR strategy focuses on education, health, and environmental sustainability.',
    objectives: [
      { id: 'obj1', text: 'Skill training for 200 students' },
      { id: 'obj2', text: 'Provide healthcare access to 1000 families' },
      { id: 'obj3', text: 'Plant 5000 trees across Karachi' }
    ],
    sdgs: ['4', '8', '13'],
    projects: [
      { projectId: 'p1', name: 'Clean Karachi Drive', start: '2025-01-15', end: '2025-06-30' },
      { projectId: 'p2', name: 'Skills Training', start: '2025-02-01', end: '2025-08-31' }
    ],
    budgetAllocation: [
      { category: 'Education', amount: 500000 },
      { category: 'Health', amount: 750000 },
      { category: 'Environment', amount: 250000 }
    ],
    kpis: [
      { label: 'Beneficiaries', target: 5000 },
      { label: 'Volunteer Hours', target: 10000 },
      { label: 'Projects Completed', target: 8 }
    ],
    status: 'draft' as const,
    lastSavedAt: '2025-12-14T10:00:00Z'
  };

  const mockVolunteers = [
    {
      id: 'v1',
      name: 'Aisha Khan',
      email: 'aisha@company.com',
      department: 'HR',
      status: 'active' as const,
      joinedAt: '2025-07-01',
      eventsJoined: 5
    },
    {
      id: 'v2',
      name: 'Ahmed Ali',
      email: 'ahmed@company.com',
      department: 'Finance',
      status: 'registered' as const,
      joinedAt: '2025-09-15',
      eventsJoined: 2
    },
    {
      id: 'v3',
      name: 'Fatima Noor',
      email: 'fatima@company.com',
      department: 'IT',
      status: 'invited' as const,
      eventsJoined: 0
    }
  ];

  const mockEvents = [
    {
      id: 'e1',
      title: 'Beach Cleanup Drive',
      date: '2025-12-20',
      time: '09:00',
      location: 'Clifton Beach, Karachi',
      projectId: 'p1',
      projectName: 'Clean Karachi Drive',
      capacity: 50,
      attendeesCount: 42,
      color: '#0d9488'
    },
    {
      id: 'e2',
      title: 'Skills Workshop',
      date: '2025-12-25',
      time: '14:00',
      location: 'TCF Campus, Lahore',
      projectId: 'p2',
      projectName: 'Skills Training for Youth',
      capacity: 30,
      attendeesCount: 18,
      color: '#2563eb'
    },
    {
      id: 'e3',
      title: 'Tree Plantation',
      date: '2025-12-28',
      time: '08:00',
      location: 'Bagh Ibn Qasim, Karachi',
      projectId: 'p1',
      projectName: 'Clean Karachi Drive',
      capacity: 100,
      attendeesCount: 65,
      color: '#10b981'
    }
  ];

  // Handlers
  const handleCreateProject = () => {
    console.log('Create project');
    // Open create project modal
  };

  const handleRequestReport = () => {
    console.log('Request report');
    setShowRequestReportModal(true);
  };

  const handleViewProjectDetails = (id: string) => {
    console.log('View project details:', id);
    // Open project detail drawer
  };

  const handleEditProject = (id: string) => {
    console.log('Edit project:', id);
  };

  const handleTogglePauseProject = (id: string) => {
    console.log('Toggle pause project:', id);
  };

  const handleNavigateToProject = (id: string) => {
    console.log('Navigate to project:', id);
  };

  const handleSaveCSRPlan = (data: any) => {
    console.log('Save CSR plan:', data);
    // POST to Supabase
  };

  const handlePublishCSRPlan = (data: any) => {
    console.log('Publish CSR plan:', data);
    // Update status in Supabase
  };

  const handleInviteSingle = (email: string, message: string) => {
    console.log('Invite single:', email, message);
    // Send invite via Supabase Auth or email
  };

  const handleImportCSV = (volunteers: any[]) => {
    console.log('Import CSV:', volunteers);
    // Bulk insert to Supabase
  };

  const handleCreateEvent = (event: any) => {
    console.log('Create event:', event);
    // Insert to Supabase events table
  };

  const handleEventClick = (eventId: string) => {
    console.log('Event clicked:', eventId);
    // Show event details
  };

  const handleMarkActivityAsRead = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId ? { ...activity, read: true } : activity
      )
    );
  };

  // Payment handlers
  const handleApprovePayment = async (paymentId: string, notes: string) => {
    console.log('Approve payment:', paymentId, notes);
    // TODO: Implement Supabase update
    // await supabase.from('payments').update({
    //   corporate_approved_at: new Date().toISOString(),
    //   corporate_approved_by: currentUserId,
    //   corporate_notes: notes,
    //   status: 'pending_admin'
    // }).eq('id', paymentId);
    toast.success('Payment approved! Sent to Admin for final approval.');
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    console.log('Reject payment:', paymentId, reason);
    // TODO: Implement Supabase update
    // await supabase.from('payments').update({
    //   status: 'rejected',
    //   rejected_by: currentUserId,
    //   rejection_reason: reason
    // }).eq('id', paymentId);
    toast.error('Payment rejected');
  };

  // Budget handlers
  const handleAcknowledgeAlert = (alertId: string) => {
    console.log('Acknowledge alert:', alertId);
    // TODO: Update alert status in Supabase
    toast.success('Alert acknowledged');
  };

  // Contract handlers
  const handleCreateContract = () => {
    console.log('Create contract');
    toast.info('Contract creation form coming soon');
  };

  const handleViewContract = (contractId: string) => {
    console.log('View contract:', contractId);
    toast.info('Contract details view coming soon');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Navigation */}
        <DashboardNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isNavCollapsed}
          isMobileOpen={isMobileNavOpen}
          onToggleMobile={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
          onNavigateHome={onNavigateHome}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-20 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">W</span>
              </div>
              <div>
                <div className="text-slate-900">Wasilah</div>
                <div className="text-slate-600 text-xs">Corporate Portal</div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab
                kpiData={mockKpiData}
                projects={mockProjects}
                activities={activities}
                onCreateProject={handleCreateProject}
                onRequestReport={handleRequestReport}
                onViewProjectDetails={handleViewProjectDetails}
                onEditProject={handleEditProject}
                onTogglePauseProject={handleTogglePauseProject}
                onNavigateToProject={handleNavigateToProject}
                onMarkActivityAsRead={handleMarkActivityAsRead}
              />
            )}

            {/* Payment Approval Tab */}
            {activeTab === 'payments' && (
              <PaymentApprovalTab
                pendingPayments={MOCK_PENDING_PAYMENTS}
                paymentHistory={MOCK_PAYMENT_HISTORY}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
              />
            )}

            {/* Budget Tracker Tab */}
            {activeTab === 'budget' && (
              <BudgetTracker
                budgetLines={MOCK_BUDGET_LINES}
                projectBudgets={MOCK_PROJECT_BUDGETS}
                alerts={MOCK_BUDGET_ALERTS}
                forecast={MOCK_BUDGET_FORECAST}
                totalBudget={1800000}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
            )}

            {/* Contract Management Tab */}
            {activeTab === 'contracts' && (
              <ContractManagement
                contracts={MOCK_CONTRACTS}
                onCreateContract={handleCreateContract}
                onViewContract={handleViewContract}
              />
            )}

            {/* CSR Plan Tab */}
            {activeTab === 'csr-plan' && (
              <CSRPlanTab
                planData={mockCSRPlan}
                onSave={handleSaveCSRPlan}
                onPublish={handlePublishCSRPlan}
              />
            )}

            {/* Volunteering Tab */}
            {activeTab === 'volunteering' && (
              <VolunteeringTab
                volunteers={mockVolunteers}
                onInviteSingle={handleInviteSingle}
                onImportCSV={handleImportCSV}
              />
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <CalendarTab
                events={mockEvents}
                onCreateEvent={handleCreateEvent}
                onEventClick={handleEventClick}
                projects={[
                  { id: 'p1', title: 'Clean Karachi Drive', color: '#0d9488' },
                  { id: 'p2', title: 'Skills Training for Youth', color: '#2563eb' },
                  { id: 'p3', title: 'Healthcare Access Initiative', color: '#8b5cf6' },
                ]}
              />
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <ProjectsPage />
            )}
          </div>
        </main>
      </div>

      {/* Request Report Modal */}
      {showRequestReportModal && (
        <RequestReportModal
          isOpen={showRequestReportModal}
          onClose={() => setShowRequestReportModal(false)}
          onSubmit={(reportRequest: ReportRequest) => {
            console.log('Report request submitted:', reportRequest);
            setShowRequestReportModal(false);
            // TODO: Send to backend/trigger report generation
            alert(`Report request submitted! Format: ${reportRequest.format}, Projects: ${reportRequest.includedProjects.length}`);
          }}
          availableProjects={mockProjects.map(p => ({ id: p.id, title: p.title }))}
        />
      )}

      {/* Offline Banner */}
      <OfflineBanner />
    </div>
  );
}