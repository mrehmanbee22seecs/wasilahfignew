import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  TriangleAlert,
  CircleCheck,
  FileText,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminKPICard } from './AdminKPICard';
import { QueueRow } from './QueueRow';
import { AuditLogEntry, AuditLogEntryData } from './AuditLogEntry';
import { VettingDetailDrawer } from './VettingDetailDrawer';
import { ApproveModal, ConditionalModal, RejectModal } from './ActionModals';
import {
  BulkApproveModal,
  BulkConditionalModal,
  BulkRejectModal,
} from './BulkActionModals';
import { SavedFilters } from './SavedFilters';
import {
  QueueDepthChart,
  VettingTimeHistogram,
  generateMockQueueDepthData,
  generateMockVettingTimeData,
} from './AdminCharts';
import { toast } from 'sonner';

/**
 * Admin Overview Tab
 * 
 * Main admin interface showing:
 * - KPI summary (Pending Vettings, Projects, Incidents, Avg Time)
 * - Moderation queue with search and filters
 * - Bulk actions
 * - Activity feed
 * - Vetting detail drawer
 */

type VettingRequest = {
  vettingId: string;
  ngoName: string;
  regNumber?: string;
  submittedAt: string;
  slaDeadline: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'conditional' | 'approved' | 'rejected';
  assignedTo?: string;
  notesPreview?: string;
};

type FilterState = {
  search?: string;
  status?: string;
  region?: string;
  riskLevel?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  sdg?: string;
  location?: string;
};

export function AdminOverviewTab() {
  const [vettingRequests, setVettingRequests] = useState<VettingRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<AuditLogEntryData[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  // Drawer and Modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVettingId, setSelectedVettingId] = useState<string | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [conditionalModalOpen, setConditionalModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  
  // Bulk action modals
  const [bulkApproveOpen, setBulkApproveOpen] = useState(false);
  const [bulkConditionalOpen, setBulkConditionalOpen] = useState(false);
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);

  // Load mock data
  useEffect(() => {
    loadVettingQueue();
    loadRecentActivity();
  }, [filters, currentPage]);

  const loadVettingQueue = () => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const mockRequests: VettingRequest[] = [
        {
          vettingId: 'VET-2024-001',
          ngoName: 'Green Pakistan Initiative',
          regNumber: 'NGO-PK-45621',
          submittedAt: '2024-01-05T10:30:00Z',
          slaDeadline: '2024-01-08T10:30:00Z',
          score: 87,
          riskLevel: 'low',
          status: 'pending',
          assignedTo: 'Sarah Ahmed',
          notesPreview: 'All documents verified. Tax clearance pending.',
        },
        {
          vettingId: 'VET-2024-002',
          ngoName: 'Education for All Foundation',
          regNumber: 'NGO-PK-78923',
          submittedAt: '2024-01-05T14:15:00Z',
          slaDeadline: '2024-01-07T14:15:00Z',
          score: 62,
          riskLevel: 'medium',
          status: 'pending',
          notesPreview: 'Missing financial audit for 2023.',
        },
        {
          vettingId: 'VET-2024-003',
          ngoName: 'Women Empowerment Network',
          regNumber: 'NGO-PK-12456',
          submittedAt: '2024-01-04T09:00:00Z',
          slaDeadline: '2024-01-06T09:00:00Z',
          score: 42,
          riskLevel: 'high',
          status: 'pending',
          assignedTo: 'Ali Khan',
          notesPreview: 'Inconsistencies in registration documents. Requires review.',
        },
        {
          vettingId: 'VET-2024-004',
          ngoName: 'Clean Water Initiative',
          regNumber: 'NGO-PK-89034',
          submittedAt: '2024-01-06T11:20:00Z',
          slaDeadline: '2024-01-09T11:20:00Z',
          score: 78,
          riskLevel: 'low',
          status: 'pending',
        },
        {
          vettingId: 'VET-2024-005',
          ngoName: 'Healthcare Access Foundation',
          regNumber: 'NGO-PK-56789',
          submittedAt: '2024-01-06T16:45:00Z',
          slaDeadline: '2024-01-09T16:45:00Z',
          score: 55,
          riskLevel: 'medium',
          status: 'pending',
          assignedTo: 'Fatima Malik',
        },
      ];

      setVettingRequests(mockRequests);
      setTotalPages(Math.ceil(mockRequests.length / itemsPerPage));
      setIsLoading(false);
    }, 800);
  };

  const loadRecentActivity = () => {
    const mockActivity: AuditLogEntryData[] = [
      {
        id: 'audit-001',
        timestamp: '2024-01-06T10:15:00Z',
        actorId: 'sarah.ahmed@wasilah.pk',
        actorName: 'Sarah Ahmed',
        action: 'approve',
        resourceType: 'ngo',
        resourceId: 'NGO-PK-34567',
        details: { 
          resourceName: 'Rural Development Trust',
          score: 82, 
          conditions: [] 
        },
      },
      {
        id: 'audit-002',
        timestamp: '2024-01-06T09:45:00Z',
        actorId: 'ali.khan@wasilah.pk',
        actorName: 'Ali Khan',
        action: 'note',
        resourceType: 'project',
        resourceId: 'PAY-2024-045',
        details: { 
          resourceName: 'Education Project Q1',
          amount: 500000, 
          currency: 'PKR' 
        },
      },
      {
        id: 'audit-003',
        timestamp: '2024-01-06T09:00:00Z',
        actorId: 'fatima.malik@wasilah.pk',
        actorName: 'Fatima Malik',
        action: 'reject',
        resourceType: 'vetting',
        resourceId: 'CASE-789',
        details: { 
          resourceName: 'Compliance Review',
          priority: 'high', 
          reason: 'Document fraud suspected' 
        },
      },
    ];

    setRecentActivity(mockActivity);
  };

  // Handlers
  const handleRowClick = (vettingId: string) => {
    setSelectedVettingId(vettingId);
    setDrawerOpen(true);
  };

  const handleSelect = (vettingId: string, selected: boolean) => {
    if (selected) {
      setSelectedRequests([...selectedRequests, vettingId]);
    } else {
      setSelectedRequests(selectedRequests.filter(id => id !== vettingId));
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests(vettingRequests.map(r => r.vettingId));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleApprove = (vettingId: string) => {
    setSelectedVettingId(vettingId);
    setApproveModalOpen(true);
  };

  const handleConditional = (vettingId: string) => {
    setSelectedVettingId(vettingId);
    setConditionalModalOpen(true);
  };

  const handleReject = (vettingId: string) => {
    setSelectedVettingId(vettingId);
    setRejectModalOpen(true);
  };

  const handleAddNote = (vettingId: string) => {
    toast.success('Note added successfully');
  };

  const handleAssign = (vettingId: string) => {
    toast.success('Vetting request assigned');
  };

  const handleBulkAction = (action: 'approve' | 'conditional' | 'reject') => {
    if (selectedRequests.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    if (action === 'approve') setBulkApproveOpen(true);
    if (action === 'conditional') setBulkConditionalOpen(true);
    if (action === 'reject') setBulkRejectOpen(true);
  };

  const confirmBulkApprove = async (payload: { ids: string[]; note?: string }) => {
    toast.success(`${selectedRequests.length} items approved`);
    setBulkApproveOpen(false);
    setSelectedRequests([]);
    loadVettingQueue();
  };

  const confirmBulkConditional = async (payload: { ids: string[]; conditions: string[]; note?: string }) => {
    toast.success(`${selectedRequests.length} items conditionally approved`);
    setBulkConditionalOpen(false);
    setSelectedRequests([]);
    loadVettingQueue();
  };

  const confirmBulkReject = async (payload: { ids: string[]; reason: string; category: string }) => {
    toast.success(`${selectedRequests.length} items rejected`);
    setBulkRejectOpen(false);
    setSelectedRequests([]);
    loadVettingQueue();
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminKPICard
            id="kpi-pending-vettings"
            title="Pending Vettings"
            value="23"
            trend="-12% from last week"
            trendDirection="up"
            icon={Clock}
          />
          <AdminKPICard
            id="kpi-active-projects"
            title="Active Projects"
            value="156"
            trend="+8% from last month"
            trendDirection="up"
            icon={FileText}
          />
          <AdminKPICard
            id="kpi-active-incidents"
            title="Active Incidents"
            value="7"
            trend="+3 new today"
            trendDirection="down"
            icon={TriangleAlert}
          />
          <AdminKPICard
            id="kpi-avg-vetting-time"
            title="Avg Vetting Time"
            value="2.3 days"
            trend="-15% improvement"
            trendDirection="up"
            icon={CircleCheck}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QueueDepthChart data={generateMockQueueDepthData()} />
          <VettingTimeHistogram data={generateMockVettingTimeData()} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vetting Queue (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Vetting Queue</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Search and Saved Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by NGO name, reg number..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <SavedFilters
                  currentFilters={filters}
                  onApplyFilter={(filter: Record<string, any>) => setFilters(filter)}
                />
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedRequests.length > 0 && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                <span className="text-sm text-blue-900 font-medium">
                  {selectedRequests.length} items selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Bulk Approve
                  </button>
                  <button
                    onClick={() => handleBulkAction('conditional')}
                    className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Bulk Conditional
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Bulk Reject
                  </button>
                </div>
              </div>
            )}

            {/* Queue Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-500">Loading vetting queue...</p>
                </div>
              ) : vettingRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <CircleCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No pending vetting requests at the moment.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedRequests.length === vettingRequests.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vettingRequests.map((request, index) => (
                      <QueueRow
                        key={request.vettingId}
                        {...request}
                        isSelected={selectedRequests.includes(request.vettingId)}
                        onPreview={(id: string) => handleRowClick(id)}
                        onAssign={(id: string) => handleAssign(id)}
                        onMarkUrgent={(id: string) => {}}
                        onSelect={(id: string, selected: boolean) => handleSelect(id, selected)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, vettingRequests.length)} of{' '}
                  {vettingRequests.length} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Feed (1/3 width) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {recentActivity.map((activity) => (
                <AuditLogEntry key={activity.id} entry={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vetting Detail Drawer */}
      <VettingDetailDrawer
        vettingId={selectedVettingId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApprove={handleApprove}
        onConditional={handleConditional}
        onReject={handleReject}
        onAddNote={handleAddNote}
        onAssign={handleAssign}
      />

      {/* Action Modals */}
      <ApproveModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        vettingId={selectedVettingId || ''}
        ngoName="NGO"
        onSubmit={async (payload: { vettingId: string; note?: string; force?: boolean }) => {
          toast.success('Vetting approved successfully');
          setApproveModalOpen(false);
          loadVettingQueue();
        }}
      />

      <ConditionalModal
        isOpen={conditionalModalOpen}
        onClose={() => setConditionalModalOpen(false)}
        vettingId={selectedVettingId || ''}
        ngoName="NGO"
        onSubmit={async (payload: { vettingId: string; reason: string; conditions: string[]; deadline: string }) => {
          toast.success('Conditional approval granted');
          setConditionalModalOpen(false);
          loadVettingQueue();
        }}
      />

      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        vettingId={selectedVettingId || ''}
        ngoName="NGO"
        onSubmit={async (payload: { vettingId: string; reason: string; isPrivate: boolean }) => {
          toast.success(payload.isPrivate ? 'Rejected with private reason' : 'Vetting rejected');
          setRejectModalOpen(false);
          loadVettingQueue();
        }}
      />

      {/* Bulk Action Modals */}
      <BulkApproveModal
        isOpen={bulkApproveOpen}
        onClose={() => setBulkApproveOpen(false)}
        selectedIds={selectedRequests}
        selectedItems={selectedRequests.map(id => ({
          id,
          name: vettingRequests.find(r => r.vettingId === id)?.ngoName || id
        }))}
        onSubmit={confirmBulkApprove}
      />

      <BulkConditionalModal
        isOpen={bulkConditionalOpen}
        onClose={() => setBulkConditionalOpen(false)}
        selectedIds={selectedRequests}
        selectedItems={selectedRequests.map(id => ({
          id,
          name: vettingRequests.find(r => r.vettingId === id)?.ngoName || id
        }))}
        onSubmit={confirmBulkConditional}
      />

      <BulkRejectModal
        isOpen={bulkRejectOpen}
        onClose={() => setBulkRejectOpen(false)}
        selectedIds={selectedRequests}
        selectedItems={selectedRequests.map(id => ({
          id,
          name: vettingRequests.find(r => r.vettingId === id)?.ngoName || id
        }))}
        onSubmit={confirmBulkReject}
      />
    </div>
  );
}