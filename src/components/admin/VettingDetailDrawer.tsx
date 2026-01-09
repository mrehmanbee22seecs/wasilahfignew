import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, AlertCircle } from 'lucide-react';
import { DocViewer } from './DocViewer';
import { Scorecard, ScoreSection } from './Scorecard';
import { VerificationChecklist, ChecklistItem } from './VerificationChecklist';
import { AuditLogEntry, AuditLogEntryData } from './AuditLogEntry';
import { FileRowData } from './FileRow';
import { toast } from 'sonner@2.0.3';

/**
 * VettingDetailDrawer Component
 * 
 * @description Slide-over drawer displaying NGO vetting details with documents, scorecard, checklist
 * @accessibility ESC to close, focus trap, keyboard navigation
 * 
 * API: GET /admin/vetting/:id
 * 
 * Response structure:
 * {
 *   id: string,
 *   ngo: { id, name, regNumber },
 *   score: number,
 *   sections: ScoreSection[],
 *   files: FileRowData[],
 *   checklist: ChecklistItem[],
 *   status: string,
 *   assignedTo: string,
 *   auditLogs: AuditLogEntryData[]
 * }
 */

export type VettingDetailData = {
  id: string;
  ngo: {
    id: string;
    name: string;
    regNumber: string;
  };
  score: number;
  sections: ScoreSection[];
  files: FileRowData[];
  checklist: ChecklistItem[];
  status: 'pending' | 'conditional' | 'approved' | 'rejected';
  assignedTo?: string;
  riskFlags?: string[];
  auditLogs: AuditLogEntryData[];
};

export type VettingDetailDrawerProps = {
  vettingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (vettingId: string) => void;
  onConditional: (vettingId: string) => void;
  onReject: (vettingId: string) => void;
  onAddNote: (vettingId: string) => void;
  onAssign: (vettingId: string) => void;
};

export function VettingDetailDrawer({
  vettingId,
  isOpen,
  onClose,
  onApprove,
  onConditional,
  onReject,
  onAddNote,
  onAssign,
}: VettingDetailDrawerProps) {
  const [vettingData, setVettingData] = useState<VettingDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  // Fetch vetting details
  useEffect(() => {
    if (vettingId && isOpen) {
      fetchVettingDetails(vettingId);
    }
  }, [vettingId, isOpen]);

  const fetchVettingDetails = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockData: VettingDetailData = {
        id,
        ngo: {
          id: 'ngo-001',
          name: 'Pakistan Education Foundation',
          regNumber: 'NGO-2024-001',
        },
        score: 78,
        sections: [
          {
            id: 'legal',
            label: 'Legal & Registration',
            weight: 20,
            score: 4.5,
            notes: 'Valid registration certificate. SECP verified.',
            helpText: 'Verifies legal status and registration validity',
          },
          {
            id: 'financial',
            label: 'Financial Transparency',
            weight: 20,
            score: 3.5,
            notes: '2022 audit present. Missing 2023 report.',
            helpText: 'Reviews financial audits and transparency',
          },
          {
            id: 'delivery',
            label: 'Past Delivery',
            weight: 15,
            score: 4.0,
            notes: 'Successfully completed 3 previous projects.',
            helpText: 'Track record of project execution',
          },
          {
            id: 'safeguarding',
            label: 'Safeguarding & Policies',
            weight: 15,
            score: 4.0,
            notes: 'Safeguarding policy submitted and reviewed.',
            helpText: 'Child protection and safeguarding policies',
          },
          {
            id: 'capacity',
            label: 'Staff Capacity',
            weight: 10,
            score: 3.5,
            notes: '8 full-time staff. 2 with relevant degrees.',
            helpText: 'Team size and qualifications',
          },
          {
            id: 'digital',
            label: 'Digital Presence & References',
            weight: 10,
            score: 4.5,
            notes: 'Active website and social media. 3 positive references.',
            helpText: 'Online presence and stakeholder references',
          },
        ],
        files: [
          {
            id: 'file-001',
            name: 'Registration_Certificate.pdf',
            url: '/files/reg.pdf',
            type: 'pdf',
            uploadedBy: 'NGO Admin',
            uploadedAt: '2025-12-01T10:00:00Z',
            sizeBytes: 245000,
          },
          {
            id: 'file-002',
            name: 'Financial_Audit_2022.pdf',
            url: '/files/audit.pdf',
            type: 'pdf',
            uploadedBy: 'NGO Admin',
            uploadedAt: '2025-12-01T10:05:00Z',
            sizeBytes: 1200000,
          },
          {
            id: 'file-003',
            name: 'Safeguarding_Policy.pdf',
            url: '/files/safeguarding.pdf',
            type: 'pdf',
            uploadedBy: 'NGO Admin',
            uploadedAt: '2025-12-01T10:10:00Z',
            sizeBytes: 345000,
          },
          {
            id: 'file-004',
            name: 'Project_Photos.jpg',
            url: '/files/photos.jpg',
            type: 'image',
            uploadedBy: 'NGO Admin',
            uploadedAt: '2025-12-01T10:15:00Z',
            sizeBytes: 890000,
            geoTag: { lat: 24.8607, lng: 67.0011 },
          },
        ],
        checklist: [
          {
            id: 'check-001',
            label: 'Registration certificate verified with SECP',
            checked: true,
            required: true,
          },
          {
            id: 'check-002',
            label: 'Bank account number matches registration',
            checked: true,
            required: true,
          },
          {
            id: 'check-003',
            label: 'Financial audit present (last 2 years)',
            checked: false,
            required: true,
            notes: 'Missing 2023 audit',
          },
          {
            id: 'check-004',
            label: 'References checked and verified',
            checked: true,
            required: false,
          },
          {
            id: 'check-005',
            label: 'Site visit completed',
            checked: false,
            required: false,
          },
        ],
        status: 'pending',
        assignedTo: 'Sarah Ahmed',
        riskFlags: ['Missing 2023 financial audit'],
        auditLogs: [
          {
            id: 'log-001',
            resourceType: 'vetting',
            resourceId: id,
            action: 'assign',
            actorId: 'admin-001',
            actorName: 'Ahmed Khan',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            details: {
              assignedTo: 'Sarah Ahmed',
            },
          },
        ],
      };

      setVettingData(mockData);
      setChecklist(mockData.checklist);
    } catch (error) {
      console.error('Error fetching vetting details:', error);
      toast.error('Failed to load vetting details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked } : item))
    );

    // In production, save to backend
    console.log('Checklist updated:', itemId, checked);
  };

  const handleChecklistNote = (itemId: string, note: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, notes: note } : item))
    );
  };

  const handleDownloadFile = (fileId: string) => {
    console.log('Download file:', fileId);
    toast.success('File download started');
  };

  const handleOpenLightbox = (fileId: string) => {
    console.log('Open lightbox:', fileId);
  };

  const handleDownloadAll = () => {
    console.log('Download all files');
    toast.success('Downloading all files');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const canApprove = () => {
    if (!vettingData) return false;
    const requiredChecked = checklist
      .filter((item) => item.required)
      .every((item) => item.checked);
    return requiredChecked;
  };

  if (!isOpen || !vettingId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full sm:max-w-3xl lg:max-w-5xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              {isLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <h2 id="drawer-title" className="text-gray-900 truncate">
                    {vettingData?.ngo.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {vettingData?.ngo.regNumber}
                    </span>
                    {vettingData?.status && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          vettingData.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : vettingData.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : vettingData.status === 'conditional'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {vettingData.status.charAt(0).toUpperCase() + vettingData.status.slice(1)}
                      </span>
                    )}
                    {vettingData?.assignedTo && (
                      <span className="text-sm text-gray-600">• Assigned to {vettingData.assignedTo}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : vettingData ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
              {/* Left Column - Documents (60%) */}
              <div className="lg:col-span-3 space-y-6">
                <DocViewer
                  files={vettingData.files}
                  onDownload={handleDownloadFile}
                  onOpenLightbox={handleOpenLightbox}
                  onDownloadAll={handleDownloadAll}
                />
              </div>

              {/* Right Column - Scorecard & Checklist (40%) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Scorecard */}
                <Scorecard
                  totalScore={vettingData.score}
                  sections={vettingData.sections}
                  riskFlags={vettingData.riskFlags}
                />

                {/* Verification Checklist */}
                <VerificationChecklist
                  items={checklist}
                  onChange={handleChecklistChange}
                  onAddNote={handleChecklistNote}
                  editable={true}
                />

                {/* Action Buttons */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm text-gray-900 mb-3">Actions</h3>

                  {/* Warning if required items not checked */}
                  {!canApprove() && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900">
                        Some required checklist items are not completed. These must be checked before approval.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => onApprove(vettingId)}
                    disabled={!canApprove()}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => onConditional(vettingId)}
                    className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    Conditional Approval
                  </button>

                  <button
                    onClick={() => onReject(vettingId)}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reject
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => onAddNote(vettingId)}
                      className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Note
                    </button>
                    <button
                      onClick={() => onAssign(vettingId)}
                      className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Audit Log Preview */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="p-4">
                    {vettingData.auditLogs.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No activity yet</p>
                    ) : (
                      <div className="space-y-3">
                        {vettingData.auditLogs.slice(0, 5).map((log) => (
                          <AuditLogEntry key={log.id} entry={log} compact />
                        ))}
                      </div>
                    )}
                  </div>
                  {vettingData.auditLogs.length > 5 && (
                    <div className="px-4 pb-4">
                      <button className="w-full text-sm text-blue-700 hover:underline focus:outline-none focus:underline">
                        View all activity
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
