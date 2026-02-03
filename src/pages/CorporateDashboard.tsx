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
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useCorporateDashboardStats, useCorporateProjects } from '../hooks/useCorporates';
import { usePaymentApprovals } from '../hooks/usePayments';
import { useRealtimeProjects } from '../hooks/useRealtimeProjects';
import { useRealtimePaymentApprovals } from '../hooks/useRealtimePayments';
import { useRealtimeActivityFeed } from '../hooks/useRealtimeActivityFeed';
import { paymentsApi } from '../lib/api/payments';
import { useCorporateBudgetOverview, useProjectBudgets, useBudgetAlerts, useBudgetForecast } from '../hooks/useBudget';
import { BRAND } from '../constants/brand';

export function CorporateDashboard({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const { user } = useAuth();
  const corporateId = user?.id || null;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'budget' | 'contracts' | 'csr-plan' | 'volunteering' | 'calendar' | 'projects'>('overview');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showRequestReportModal, setShowRequestReportModal] = useState(false);

  // Real-time data hooks
  const { stats, loading: statsLoading } = useCorporateDashboardStats(corporateId);
  const { projects, loading: projectsLoading } = useCorporateProjects(corporateId);
  const { approvals, loading: approvalsLoading, refetch: refetchApprovals } = usePaymentApprovals(corporateId);
  
  // Budget hooks
  const { budget, budgetLines, loading: budgetLoading } = useCorporateBudgetOverview(corporateId);
  const { projectBudgets, loading: projectBudgetsLoading } = useProjectBudgets(corporateId);
  const { alerts: budgetAlerts, loading: alertsLoading } = useBudgetAlerts(corporateId);
  const { forecast: budgetForecast, loading: forecastLoading } = useBudgetForecast(corporateId);
  
  // Real-time subscriptions
  const { projects: realtimeProjects } = useRealtimeProjects(corporateId, projects);
  const { approvals: realtimeApprovals } = useRealtimePaymentApprovals(corporateId, approvals);
  const { activities } = useRealtimeActivityFeed(corporateId);

  // Use real-time data if available, fallback to initial data
  const currentProjects = realtimeProjects.length > 0 ? realtimeProjects : projects;
  const currentApprovals = realtimeApprovals.length > 0 ? realtimeApprovals : approvals;

  // Transform stats data for KPI cards
  const kpiData = stats ? {
    activeProjects: stats.active_projects || 0,
    beneficiariesYtd: stats.total_beneficiaries || 0,
    csrSpendYtd: { amount: stats.total_spent || 0, currency: 'PKR' },
    upcomingEvents: stats.upcoming_events || 0,
    trends: {
      activeProjects: { pct: stats.project_growth || 0, period: 'vs last month' },
      beneficiariesYtd: { pct: stats.beneficiary_growth || 0, period: 'vs last month' },
      csrSpendYtd: { pct: stats.spend_growth || 0, period: 'vs last month' },
      upcomingEvents: { pct: 0, period: 'vs last month' }
    }
  } : {
    activeProjects: 0,
    beneficiariesYtd: 0,
    csrSpendYtd: { amount: 0, currency: 'PKR' },
    upcomingEvents: 0,
    trends: {
      activeProjects: { pct: 0, period: 'vs last month' },
      beneficiariesYtd: { pct: 0, period: 'vs last month' },
      csrSpendYtd: { pct: 0, period: 'vs last month' },
      upcomingEvents: { pct: 0, period: 'vs last month' }
    }
  };

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
    // Mark activity as read in database
    // For now, activities come from real-time subscription
    console.log('Mark activity as read:', activityId);
  };

  // Payment handlers - Connected to real API
  const handleApprovePayment = async (paymentId: string, notes: string) => {
    try {
      const response = await paymentsApi.approvePayment(paymentId, { notes });
      if (response.success) {
        toast.success('Payment approved! Sent to Admin for final approval.');
        refetchApprovals();
      } else {
        toast.error(response.error?.message || 'Failed to approve payment');
      }
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    try {
      const response = await paymentsApi.rejectPayment(paymentId, { reason });
      if (response.success) {
        toast.error('Payment rejected');
        refetchApprovals();
      } else {
        toast.error(response.error?.message || 'Failed to reject payment');
      }
    } catch (error) {
      toast.error('Failed to reject payment');
    }
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
    <div className="min-h-screen" style={{ backgroundColor: BRAND.creamLight }}>
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
          <div className="lg:hidden sticky top-0 z-20 bg-white border-b-2 px-6 py-4 flex items-center justify-between" style={{ borderColor: `${BRAND.navy}15` }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)` }}
              >
                <span className="text-white text-xl">W</span>
              </div>
              <div>
                <div style={{ color: BRAND.navy }}>Wasilah</div>
                <div className="text-xs" style={{ color: BRAND.gray600 }}>Corporate Portal</div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" style={{ color: BRAND.gray600 }} />
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab
                kpiData={kpiData}
                projects={currentProjects}
                activities={activities}
                loading={statsLoading || projectsLoading}
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
                pendingPayments={currentApprovals}
                paymentHistory={[]}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
              />
            )}

            {/* Budget Tracker Tab */}
            {activeTab === 'budget' && (
              <BudgetTracker
                budgetLines={budgetLines}
                projectBudgets={projectBudgets}
                alerts={budgetAlerts}
                forecast={budgetForecast}
                totalBudget={budget?.total_allocated || 1800000}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
            )}

            {/* Contract Management Tab */}
            {activeTab === 'contracts' && (
              <ContractManagement
                contracts={[]}
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
          availableProjects={currentProjects.map(p => ({ id: p.id, title: p.title }))}
        />
      )}

      {/* Offline Banner */}
      <OfflineBanner />
    </div>
  );
}