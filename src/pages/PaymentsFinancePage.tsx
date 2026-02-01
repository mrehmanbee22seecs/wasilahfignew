import React, { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PaymentHoldCard, PaymentHold } from '../components/admin/PaymentHoldCard';
import { ApprovalModal } from '../components/admin/ApprovalModal';
import { ReleaseRequestModal } from '../components/admin/payments/ReleaseRequestModal';
import { LedgerViewer, LedgerEntry } from '../components/admin/payments/LedgerViewer';
import { AddNoteModal } from '../components/admin/payments/AddNoteModal';
import { ExportButton } from '../components/exports/ExportButton';
import { toast } from 'sonner';
import { CardSkeleton } from '../components/skeletons';

/**
 * Payments & Finance Page
 * 
 * Route: /admin/payments
 * 
 * Features:
 * - Payment holds management
 * - Dual approval workflow (2 approvers required)
 * - Release requests tracking
 * - Financial audit trail
 * 
 * API Endpoints:
 * - GET /admin/payments/holds?status=...
 * - POST /admin/payments/holds/:id/approve
 * - POST /admin/payments/holds/:id/reject
 * - GET /admin/payments/audit-log
 * 
 * Dual Approval Flow:
 * 1. Payment hold created
 * 2. First admin approves -> status: approved_once
 * 3. Second admin approves -> status: released, payment processed
 * 4. Any admin can reject at any stage
 */

export default function PaymentsFinancePage() {
  const [holds, setHolds] = useState<PaymentHold[]>([]);
  const [filteredHolds, setFilteredHolds] = useState<PaymentHold[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [selectedHold, setSelectedHold] = useState<PaymentHold | null>(null);
  
  // New modal states
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const currentUserId = 'admin-001'; // In production, get from auth context

  useEffect(() => {
    fetchHolds();
  }, []);

  const fetchHolds = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockHolds: PaymentHold[] = [
        {
          holdId: 'HOLD-001',
          projectId: 'proj-102',
          projectName: 'Clean Water Initiative - Phase 2',
          ngoName: 'Green Pakistan Initiative',
          amount: 450000,
          currency: 'PKR',
          reason: 'Awaiting milestone verification before next disbursement',
          status: 'pending',
          createdAt: '2025-12-14T10:00:00Z',
          createdBy: 'Corporate Partner: ABC Industries',
          urgency: 'urgent',
        },
        {
          holdId: 'HOLD-002',
          projectId: 'proj-089',
          projectName: 'Education Support Program',
          ngoName: 'Pakistan Education Foundation',
          amount: 250000,
          currency: 'PKR',
          reason: 'Pending submission of quarterly financial report',
          status: 'approved_once',
          createdAt: '2025-12-12T14:30:00Z',
          createdBy: 'Sarah Ahmed',
          firstApprover: {
            name: 'Ahmed Khan',
            approvedAt: '2025-12-15T09:15:00Z',
          },
          urgency: 'normal',
        },
        {
          holdId: 'HOLD-003',
          projectId: 'proj-134',
          projectName: 'Youth Skills Development',
          ngoName: 'Women Empowerment Network',
          amount: 180000,
          currency: 'PKR',
          reason: 'Compliance review completed. Ready for release.',
          status: 'released',
          createdAt: '2025-12-10T11:00:00Z',
          createdBy: 'Ahmed Khan',
          firstApprover: {
            name: 'Sarah Ahmed',
            approvedAt: '2025-12-11T10:00:00Z',
          },
          secondApprover: {
            name: 'Fatima Ali',
            approvedAt: '2025-12-12T15:30:00Z',
          },
          urgency: 'normal',
        },
        {
          holdId: 'HOLD-004',
          projectId: 'proj-156',
          projectName: 'Healthcare Access Program',
          ngoName: 'Health for All Foundation',
          amount: 320000,
          currency: 'PKR',
          reason: 'Documentation incomplete. Missing invoice verification.',
          status: 'rejected',
          createdAt: '2025-12-09T09:30:00Z',
          createdBy: 'System Auto-Hold',
          urgency: 'normal',
        },
        {
          holdId: 'HOLD-005',
          projectId: 'proj-178',
          projectName: 'Environmental Conservation Drive',
          ngoName: 'Clean Water Initiative',
          amount: 500000,
          currency: 'PKR',
          reason: 'Large amount requires dual approval. All documentation verified.',
          status: 'pending',
          createdAt: '2025-12-15T08:00:00Z',
          createdBy: 'Corporate Partner: XYZ Corp',
          urgency: 'urgent',
        },
      ];

      setHolds(mockHolds);
      setFilteredHolds(mockHolds);
    } catch (error) {
      console.error('Error fetching holds:', error);
      toast.error('Failed to load payment holds');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...holds];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.holdId.toLowerCase().includes(query) ||
          h.projectName.toLowerCase().includes(query) ||
          h.ngoName.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((h) => h.status === statusFilter);
    }

    setFilteredHolds(filtered);
  }, [searchQuery, statusFilter, holds]);

  const handleApprove = (holdId: string) => {
    const hold = holds.find((h) => h.holdId === holdId);
    if (hold) {
      setSelectedHold(hold);
      setModalType('approve');
      setApprovalModalOpen(true);
    }
  };

  const handleReject = (holdId: string) => {
    const hold = holds.find((h) => h.holdId === holdId);
    if (hold) {
      setSelectedHold(hold);
      setModalType('reject');
      setApprovalModalOpen(true);
    }
  };

  const handleViewDetails = (holdId: string) => {
    toast.info(`View details for ${holdId}`);
  };

  const handleRequestRelease = (holdId: string) => {
    const hold = holds.find((h) => h.holdId === holdId);
    if (hold) {
      setSelectedHold(hold);
      setReleaseModalOpen(true);
    }
  };

  const handleViewLedger = (holdId: string) => {
    const hold = holds.find((h) => h.holdId === holdId);
    if (hold) {
      setSelectedHold(hold);
      setLedgerModalOpen(true);
    }
  };

  const handleAddNote = (holdId: string) => {
    const hold = holds.find((h) => h.holdId === holdId);
    if (hold) {
      setSelectedHold(hold);
      setNoteModalOpen(true);
    }
  };

  const handleReleaseRequestSubmit = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Release request submitted:', data);
    // In production: POST to /admin/payments/holds/:id/release-request
  };

  const handleNoteSubmit = async (note: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Note added:', note);
    // In production: POST to /admin/payments/holds/:id/notes
  };

  const handleApprovalSubmit = async (payload: {
    holdId: string;
    note?: string;
    reason?: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setHolds((prev) =>
      prev.map((hold) => {
        if (hold.holdId === payload.holdId) {
          if (modalType === 'approve') {
            if (hold.status === 'pending') {
              // First approval
              return {
                ...hold,
                status: 'approved_once' as const,
                firstApprover: {
                  name: 'Current Admin',
                  approvedAt: new Date().toISOString(),
                },
              };
            } else if (hold.status === 'approved_once') {
              // Second approval - release payment
              return {
                ...hold,
                status: 'released' as const,
                secondApprover: {
                  name: 'Current Admin',
                  approvedAt: new Date().toISOString(),
                },
              };
            }
          } else if (modalType === 'reject') {
            return {
              ...hold,
              status: 'rejected' as const,
            };
          }
        }
        return hold;
      })
    );

    if (modalType === 'approve') {
      if (selectedHold?.status === 'pending') {
        toast.success('First approval recorded. Awaiting second approval.');
      } else {
        toast.success('Payment released successfully!');
      }
    } else {
      toast.success('Payment release rejected');
    }
  };

  // Statistics
  const stats = {
    total: holds.length,
    pending: holds.filter((h) => h.status === 'pending').length,
    approved_once: holds.filter((h) => h.status === 'approved_once').length,
    released: holds.filter((h) => h.status === 'released').length,
    rejected: holds.filter((h) => h.status === 'rejected').length,
    totalOnHold: holds
      .filter((h) => h.status === 'pending' || h.status === 'approved_once')
      .reduce((sum, h) => sum + h.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Payments & Finance</h1>
              <p className="text-sm text-gray-600 mt-1">
                Payment holds, dual approvals, and release management
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.info('View audit log')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Audit Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Total Holds</p>
            <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 uppercase">Pending 1st</p>
            <p className="text-2xl text-amber-900 mt-1">{stats.pending}</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 uppercase">Awaiting 2nd</p>
            <p className="text-2xl text-blue-900 mt-1">{stats.approved_once}</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-xs text-emerald-700 uppercase">Released</p>
            <p className="text-2xl text-emerald-900 mt-1">{stats.released}</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 uppercase">Rejected</p>
            <p className="text-2xl text-red-900 mt-1">{stats.rejected}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-700 uppercase">Total On Hold</p>
            <p className="text-xl text-purple-900 mt-1">
              PKR {(stats.totalOnHold / 1000).toFixed(0)}K
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by hold ID, project name, or NGO..."
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
            <ExportButton 
              entityType="payments" 
              variant="secondary"
              showHistory={true}
            />
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <label className="text-xs text-gray-600 block mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending 1st Approval</option>
                <option value="approved_once">Awaiting 2nd Approval</option>
                <option value="released">Released</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Holds Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} lines={4} />
            ))}
          </div>
        ) : filteredHolds.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No payment holds found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredHolds.map((hold) => (
              <PaymentHoldCard
                key={hold.holdId}
                hold={hold}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
                onRequestRelease={handleRequestRelease}
                onViewLedger={handleViewLedger}
                onAddNote={handleAddNote}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approval/Rejection Modal */}
      {selectedHold && (
        <ApprovalModal
          isOpen={approvalModalOpen}
          type={modalType}
          holdId={selectedHold.holdId}
          projectName={selectedHold.projectName}
          amount={selectedHold.amount}
          currency={selectedHold.currency}
          isSecondApproval={selectedHold.status === 'approved_once'}
          onClose={() => {
            setApprovalModalOpen(false);
            setSelectedHold(null);
          }}
          onSubmit={handleApprovalSubmit}
        />
      )}

      {/* Release Request Modal */}
      {selectedHold && (
        <ReleaseRequestModal
          isOpen={releaseModalOpen}
          holdId={selectedHold.holdId}
          ngoName={selectedHold.ngoName}
          projectName={selectedHold.projectName}
          holdAmount={selectedHold.amount}
          currency={selectedHold.currency}
          onClose={() => {
            setReleaseModalOpen(false);
            setSelectedHold(null);
          }}
          onSubmit={handleReleaseRequestSubmit}
        />
      )}

      {/* Ledger Viewer Modal */}
      {selectedHold && (
        <LedgerViewer
          isOpen={ledgerModalOpen}
          holdId={selectedHold.holdId}
          ngoName={selectedHold.ngoName}
          projectName={selectedHold.projectName}
          entries={getMockLedgerEntries(selectedHold.holdId)}
          onClose={() => {
            setLedgerModalOpen(false);
            setSelectedHold(null);
          }}
        />
      )}

      {/* Add Note Modal */}
      {selectedHold && (
        <AddNoteModal
          isOpen={noteModalOpen}
          holdId={selectedHold.holdId}
          ngoName={selectedHold.ngoName}
          projectName={selectedHold.projectName}
          onSubmit={handleNoteSubmit}
          onClose={() => {
            setNoteModalOpen(false);
            setSelectedHold(null);
          }}
        />
      )}
    </div>
  );
}

// Mock ledger data generator
function getMockLedgerEntries(holdId: string): LedgerEntry[] {
  return [
    {
      entryId: 'entry-001',
      date: '2025-12-10T10:00:00Z',
      type: 'credit',
      amount: 500000,
      balance: 500000,
      description: 'Initial project funding allocated',
      performedBy: 'Corporate Partner: ABC Industries',
      attachments: [
        {
          id: 'att-001',
          name: 'funding_agreement.pdf',
          type: 'document',
          url: '#',
          size: 245000,
        },
      ],
    },
    {
      entryId: 'entry-002',
      date: '2025-12-11T14:30:00Z',
      type: 'debit',
      amount: 50000,
      balance: 450000,
      description: 'Phase 1 milestone payment released',
      performedBy: 'System Auto-Release',
      attachments: [
        {
          id: 'att-002',
          name: 'milestone_1_invoice.pdf',
          type: 'invoice',
          url: '#',
          size: 125000,
        },
        {
          id: 'att-003',
          name: 'payment_receipt.pdf',
          type: 'receipt',
          url: '#',
          size: 98000,
        },
      ],
    },
    {
      entryId: 'entry-003',
      date: '2025-12-14T10:00:00Z',
      type: 'hold',
      amount: 450000,
      balance: 450000,
      description: 'Payment hold applied - awaiting milestone verification',
      performedBy: 'Ahmed Khan',
    },
  ];
}