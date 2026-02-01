import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, User, FileText, ChevronDown, Eye, History } from 'lucide-react';
import { AuditLogEntry, AuditLogEntryData } from '../components/admin/AuditLogEntry';
import { AuditEntryDetailModal, AuditEntry } from '../components/admin/audit/AuditEntryDetailModal';
import { JSONDiffViewer } from '../components/admin/audit/JSONDiffViewer';
import { ResourceTimeline, TimelineEvent } from '../components/admin/audit/ResourceTimeline';
import { ExportButton } from '../components/exports/ExportButton';
import { toast } from 'sonner';
import { ListSkeleton } from '../components/skeletons';

/**
 * Audit Log Viewer Page
 * 
 * Route: /admin/audit-log
 * 
 * Features:
 * - Complete immutable audit trail
 * - Filter by resource type, action, actor, date range
 * - Search functionality
 * - Export to CSV/JSON
 * - Diff view for changes
 * - Detailed entry modal with tabs
 * - Resource timeline view
 * - Pagination
 * 
 * API Endpoints:
 * - GET /admin/audit-log?from=...&to=...&actor=...&action=...&cursor=...
 * - GET /admin/audit-log/export?format=csv|json
 * - GET /admin/audit-log/:id
 * - GET /admin/audit-log/resource/:type/:id/timeline
 */

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntryData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [selectedResource, setSelectedResource] = useState<{ type: string; id: string; name?: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('');
  const [actorFilter, setActorFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockLogs: AuditLogEntryData[] = [
        {
          id: 'log-001',
          resourceType: 'payment',
          resourceId: 'HOLD-002',
          action: 'approve',
          actorId: 'admin-002',
          actorName: 'Fatima Ali',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          details: {
            previousStatus: 'approved_once',
            newStatus: 'released',
            note: 'Second approval granted. All requirements met.',
            amount: 250000,
            currency: 'PKR',
          },
        },
        {
          id: 'log-002',
          resourceType: 'vetting',
          resourceId: 'vet-005',
          action: 'approve',
          actorId: 'admin-001',
          actorName: 'Ahmed Khan',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          details: {
            previousStatus: 'pending',
            newStatus: 'approved',
            reason: 'All documents verified. Registration confirmed with SECP.',
            score: 90,
          },
        },
        {
          id: 'log-003',
          resourceType: 'vetting',
          resourceId: 'vet-004',
          action: 'conditional',
          actorId: 'admin-002',
          actorName: 'Sarah Ahmed',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          details: {
            previousStatus: 'pending',
            newStatus: 'conditional',
            reason: 'Pending site visit',
            conditions: ['Complete site visit within 14 days', 'Submit additional references'],
            deadline: '2026-01-01T00:00:00Z',
          },
        },
        {
          id: 'log-004',
          resourceType: 'case',
          resourceId: 'CASE-003',
          action: 'escalate',
          actorId: 'admin-001',
          actorName: 'Ahmed Khan',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          details: {
            previousStatus: 'investigating',
            newStatus: 'escalated',
            reason: 'No response from NGO after multiple attempts. Requires senior review.',
            priority: 'critical',
          },
        },
        {
          id: 'log-005',
          resourceType: 'project',
          resourceId: 'proj-102',
          action: 'update',
          actorId: 'ngo-001',
          actorName: 'Green Pakistan Initiative',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          details: {
            field: 'milestone',
            previousValue: 'In Progress',
            newValue: 'Completed',
            milestoneId: 'milestone-3',
            milestoneName: 'Phase 2 Installation',
          },
        },
        {
          id: 'log-006',
          resourceType: 'payment',
          resourceId: 'HOLD-001',
          action: 'create',
          actorId: 'system',
          actorName: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          details: {
            amount: 450000,
            currency: 'PKR',
            reason: 'Auto-hold triggered: Large disbursement requires dual approval',
            projectId: 'proj-102',
          },
        },
        {
          id: 'log-007',
          resourceType: 'vetting',
          resourceId: 'vet-003',
          action: 'reject',
          actorId: 'admin-001',
          actorName: 'Ahmed Khan',
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          details: {
            previousStatus: 'pending',
            newStatus: 'rejected',
            reason: 'Registration number verification failed. Entity not found in SECP database.',
            isPrivate: false,
          },
        },
        {
          id: 'log-008',
          resourceType: 'user',
          resourceId: 'admin-003',
          action: 'create',
          actorId: 'admin-001',
          actorName: 'Ahmed Khan',
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          details: {
            userName: 'Ali Hassan',
            role: 'moderator',
            permissions: ['view_queue', 'assign_cases', 'add_notes'],
          },
        },
        {
          id: 'log-009',
          resourceType: 'case',
          resourceId: 'CASE-001',
          action: 'assign',
          actorId: 'admin-002',
          actorName: 'Sarah Ahmed',
          timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
          details: {
            assignedTo: 'Ahmed Khan',
            assignedFrom: 'Unassigned',
          },
        },
        {
          id: 'log-010',
          resourceType: 'export',
          resourceId: 'export-001',
          action: 'generate',
          actorId: 'admin-002',
          actorName: 'Sarah Ahmed',
          timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
          details: {
            exportType: 'evidence_package',
            caseId: 'CASE-001',
            format: 'zip',
            fileCount: 12,
          },
        },
      ];

      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.resourceId.toLowerCase().includes(query) ||
          log.actorName.toLowerCase().includes(query) ||
          JSON.stringify(log.details).toLowerCase().includes(query)
      );
    }

    if (actionFilter) {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    if (resourceTypeFilter) {
      filtered = filtered.filter((log) => log.resourceType === resourceTypeFilter);
    }

    if (actorFilter) {
      filtered = filtered.filter((log) => log.actorId === actorFilter);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((log) => new Date(log.timestamp) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((log) => new Date(log.timestamp) <= toDate);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, actionFilter, resourceTypeFilter, actorFilter, dateFrom, dateTo, logs]);

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Exporting ${filteredLogs.length} log entries as ${format.toUpperCase()}...`);
      // In production: trigger download
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const uniqueActors = Array.from(new Set(logs.map((log) => log.actorName)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Audit Log</h1>
              <p className="text-sm text-gray-600 mt-1">
                Complete immutable audit trail of all system actions
              </p>
            </div>
            <ExportButton 
              entityType="audit_logs" 
              variant="primary"
              showHistory={true}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Total Logs</p>
            <p className="text-2xl text-gray-900 mt-1">{logs.length}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Filtered</p>
            <p className="text-2xl text-gray-900 mt-1">{filteredLogs.length}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Today</p>
            <p className="text-2xl text-gray-900 mt-1">
              {
                logs.filter(
                  (log) =>
                    new Date(log.timestamp).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Unique Actors</p>
            <p className="text-2xl text-gray-900 mt-1">{uniqueActors.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by resource ID, actor, or details..."
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
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-200">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Action</label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                  <option value="conditional">Conditional</option>
                  <option value="assign">Assign</option>
                  <option value="escalate">Escalate</option>
                  <option value="generate">Generate</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Resource Type</label>
                <select
                  value={resourceTypeFilter}
                  onChange={(e) => setResourceTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="vetting">Vetting</option>
                  <option value="payment">Payment</option>
                  <option value="case">Case</option>
                  <option value="project">Project</option>
                  <option value="user">User</option>
                  <option value="export">Export</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Actor</label>
                <select
                  value={actorFilter}
                  onChange={(e) => setActorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Actors</option>
                  {uniqueActors.map((actor) => (
                    <option key={actor} value={actor}>
                      {actor}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Log Entries */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-gray-900">
              Audit Entries ({filteredLogs.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6">
              <ListSkeleton items={10} showAvatar={true} />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No audit logs found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {filteredLogs.map((entry) => (
                  <AuditLogEntry key={entry.id} entry={entry} />
                ))}
              </div>

              {/* Load More */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => toast.info('Load more functionality would be implemented here')}
                  className="px-6 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Load More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}