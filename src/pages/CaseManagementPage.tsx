import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import { CaseCard, CaseData } from '../components/admin/CaseCard';
import { CaseDetailDrawer } from '../components/admin/CaseDetailDrawer';
import { toast } from 'sonner';
import { CardSkeleton } from '../components/skeletons';

/**
 * Case Management Page
 * 
 * Route: /admin/cases
 * 
 * Features:
 * - List all investigation cases
 * - Filter by status, priority, entity type
 * - Search functionality
 * - Case detail drawer with evidence gallery
 * - Export case reports
 * 
 * API Endpoints:
 * - GET /admin/cases?status=...&priority=...&search=...
 * - GET /admin/cases/:id
 * - PATCH /admin/cases/:id/status
 * - POST /admin/cases/:id/escalate
 */

export default function CaseManagementPage() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseData[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockCases: CaseData[] = [
        {
          caseId: 'CASE-001',
          title: 'Suspicious Financial Report',
          description:
            'Financial statements show inconsistencies in reported expenditure. Multiple invoices appear to be duplicates.',
          status: 'investigating',
          priority: 'high',
          createdAt: '2025-12-10T10:00:00Z',
          assignedTo: 'Ahmed Khan',
          relatedEntity: {
            type: 'ngo',
            id: 'ngo-001',
            name: 'Pakistan Education Foundation',
          },
          evidenceCount: 5,
          lastUpdate: '2025-12-15T14:30:00Z',
        },
        {
          caseId: 'CASE-002',
          title: 'Volunteer Misconduct Report',
          description:
            'Multiple complaints received about inappropriate behavior during volunteering activity.',
          status: 'open',
          priority: 'critical',
          createdAt: '2025-12-14T08:20:00Z',
          assignedTo: 'Sarah Ahmed',
          relatedEntity: {
            type: 'volunteer',
            id: 'vol-045',
            name: 'Ali Hassan',
          },
          evidenceCount: 3,
          lastUpdate: '2025-12-15T09:15:00Z',
        },
        {
          caseId: 'CASE-003',
          title: 'Project Milestone Delay',
          description:
            'Project is 3 weeks behind schedule with no progress updates. Communication from NGO has stopped.',
          status: 'escalated',
          priority: 'high',
          createdAt: '2025-12-08T14:45:00Z',
          assignedTo: 'Ahmed Khan',
          relatedEntity: {
            type: 'project',
            id: 'proj-102',
            name: 'Clean Water Initiative - Phase 2',
          },
          evidenceCount: 8,
          lastUpdate: '2025-12-16T10:00:00Z',
        },
        {
          caseId: 'CASE-004',
          title: 'Duplicate Registration Attempt',
          description:
            'NGO attempting to register with different name but same registration number as existing entity.',
          status: 'investigating',
          priority: 'medium',
          createdAt: '2025-12-12T11:30:00Z',
          assignedTo: 'Sarah Ahmed',
          relatedEntity: {
            type: 'ngo',
            id: 'ngo-087',
            name: 'Youth Development Society',
          },
          evidenceCount: 4,
          lastUpdate: '2025-12-14T16:20:00Z',
        },
        {
          caseId: 'CASE-005',
          title: 'Missing Documentation',
          description:
            'Required compliance documents not submitted despite multiple reminders. SLA deadline passed.',
          status: 'open',
          priority: 'medium',
          createdAt: '2025-12-13T09:00:00Z',
          relatedEntity: {
            type: 'ngo',
            id: 'ngo-045',
            name: 'Health for All Foundation',
          },
          evidenceCount: 2,
          lastUpdate: '2025-12-15T11:45:00Z',
        },
        {
          caseId: 'CASE-006',
          title: 'Resolved: Invoice Verification',
          description:
            'Invoice amounts verified against bank statements. No discrepancies found. Case closed.',
          status: 'resolved',
          priority: 'low',
          createdAt: '2025-12-05T13:15:00Z',
          assignedTo: 'Ahmed Khan',
          relatedEntity: {
            type: 'project',
            id: 'proj-089',
            name: 'Education Support Program',
          },
          evidenceCount: 6,
          lastUpdate: '2025-12-09T14:00:00Z',
        },
      ];

      setCases(mockCases);
      setFilteredCases(mockCases);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...cases];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.caseId.toLowerCase().includes(query) ||
          c.relatedEntity.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((c) => c.priority === priorityFilter);
    }

    setFilteredCases(filtered);
  }, [searchQuery, statusFilter, priorityFilter, cases]);

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setDrawerOpen(true);
  };

  const handleUpdateStatus = (caseId: string, status: CaseData['status']) => {
    setCases((prev) =>
      prev.map((c) => (c.caseId === caseId ? { ...c, status, lastUpdate: new Date().toISOString() } : c))
    );
    toast.success(`Case status updated to ${status}`);
  };

  const handleEscalate = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? { ...c, status: 'escalated' as const, priority: 'critical' as const, lastUpdate: new Date().toISOString() }
          : c
      )
    );
    toast.success('Case escalated successfully');
    setDrawerOpen(false);
  };

  const handleExportCases = () => {
    toast.success('Exporting cases to CSV...');
  };

  // Statistics
  const stats = {
    total: cases.length,
    open: cases.filter((c) => c.status === 'open').length,
    investigating: cases.filter((c) => c.status === 'investigating').length,
    escalated: cases.filter((c) => c.status === 'escalated').length,
    resolved: cases.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Case Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Investigation cases, incidents, and compliance issues
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCases}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => toast.info('Create case modal would open')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
                <span>Create Case</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Total Cases</p>
            <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 uppercase">Open</p>
            <p className="text-2xl text-blue-900 mt-1">{stats.open}</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 uppercase">Investigating</p>
            <p className="text-2xl text-amber-900 mt-1">{stats.investigating}</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 uppercase">Escalated</p>
            <p className="text-2xl text-red-900 mt-1">{stats.escalated}</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-xs text-emerald-700 uppercase">Resolved</p>
            <p className="text-2xl text-emerald-900 mt-1">{stats.resolved}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by case ID, title, or related entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  showFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Cases Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} lines={4} />
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-600">No cases found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCases.map((caseData) => (
              <CaseCard key={caseData.caseId} case={caseData} onClick={handleCaseClick} />
            ))}
          </div>
        )}
      </div>

      {/* Case Detail Drawer */}
      <CaseDetailDrawer
        caseId={selectedCaseId}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCaseId(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        onEscalate={handleEscalate}
      />
    </div>
  );
}
