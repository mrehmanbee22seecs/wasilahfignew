import React, { useState } from 'react';
import { X, User, Clock, AlertCircle, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import { CaseData } from './CaseCard';
import { EvidenceGallery, EvidenceItem } from './EvidenceGallery';
import { toast } from 'sonner@2.0.3';

interface CaseDetailDrawerProps {
  caseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (caseId: string, status: CaseData['status']) => void;
  onEscalate: (caseId: string) => void;
}

export function CaseDetailDrawer({
  caseId,
  isOpen,
  onClose,
  onUpdateStatus,
  onEscalate,
}: CaseDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');

  // Mock data - in production, fetch based on caseId
  const caseData: CaseData | null = caseId
    ? {
        caseId: caseId,
        title: 'Suspicious Financial Report',
        description:
          'Financial statements show inconsistencies in reported expenditure. Multiple invoices appear to be duplicates with different dates.',
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
      }
    : null;

  const evidenceItems: EvidenceItem[] = [
    {
      id: 'ev-001',
      type: 'image',
      name: 'invoice-duplicate-1.jpg',
      url: '/evidence/invoice-1.jpg',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      uploadedAt: '2025-12-10T11:00:00Z',
      uploadedBy: 'Ahmed Khan',
      size: '2.4 MB',
      caption: 'First duplicate invoice dated March 2024',
    },
    {
      id: 'ev-002',
      type: 'image',
      name: 'invoice-duplicate-2.jpg',
      url: '/evidence/invoice-2.jpg',
      thumbnail: 'https://images.unsplash.com/photo-1586953208270-e4d5b62d31bb?w=400',
      uploadedAt: '2025-12-10T11:05:00Z',
      uploadedBy: 'Ahmed Khan',
      size: '2.3 MB',
      caption: 'Second duplicate invoice dated April 2024',
    },
    {
      id: 'ev-003',
      type: 'document',
      name: 'financial-audit-2024.pdf',
      url: '/evidence/audit.pdf',
      uploadedAt: '2025-12-11T09:15:00Z',
      uploadedBy: 'Sarah Ahmed',
      size: '5.8 MB',
    },
    {
      id: 'ev-004',
      type: 'link',
      name: 'SECP Registration Verification',
      url: 'https://eservices.secp.gov.pk',
      uploadedAt: '2025-12-12T14:00:00Z',
      uploadedBy: 'System',
    },
  ];

  const notes = [
    {
      id: 'note-001',
      author: 'Ahmed Khan',
      timestamp: '2025-12-10T10:30:00Z',
      content: 'Initial review completed. Found 3 duplicate invoices totaling PKR 450,000.',
    },
    {
      id: 'note-002',
      author: 'Sarah Ahmed',
      timestamp: '2025-12-11T15:20:00Z',
      content:
        'Requested additional documentation from NGO. Awaiting response. Set deadline for Dec 18.',
    },
    {
      id: 'note-003',
      author: 'Ahmed Khan',
      timestamp: '2025-12-13T09:45:00Z',
      content:
        'NGO responded with explanation. Claims invoices were re-submitted after payment failure. Verifying with bank.',
    },
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    toast.success('Note added successfully');
    setNewNote('');
  };

  const handleDownloadEvidence = (id: string) => {
    toast.success('Downloading evidence...');
  };

  if (!isOpen || !caseData) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">#{caseData.caseId}</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                    caseData.priority === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : caseData.priority === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : caseData.priority === 'medium'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {caseData.priority}
                </span>
              </div>
              <h2 id="drawer-title" className="text-xl text-gray-900">
                {caseData.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{caseData.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Assigned to {caseData.assignedTo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Created {new Date(caseData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>
                {caseData.relatedEntity.type}: {caseData.relatedEntity.name}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="px-6">
            <div className="flex gap-6">
              {[
                { id: 'overview', label: 'Overview', icon: AlertCircle },
                { id: 'evidence', label: 'Evidence', icon: FileText, count: caseData.evidenceCount },
                { id: 'notes', label: 'Notes', icon: MessageSquare, count: notes.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-1 py-3 border-b-2 text-sm transition-colors
                    focus:outline-none
                    ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status & Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm text-blue-900 mb-3">Case Status & Actions</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={caseData.status}
                    onChange={(e) =>
                      onUpdateStatus(caseData.caseId, e.target.value as CaseData['status'])
                    }
                    className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                  <button
                    onClick={() => onEscalate(caseData.caseId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Escalate Case
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(caseData.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(caseData.lastUpdate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Assigned To</label>
                  <p className="text-sm text-gray-900">{caseData.assignedTo}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Evidence Count</label>
                  <p className="text-sm text-gray-900">{caseData.evidenceCount} items</p>
                </div>
              </div>

              {/* Related Entity */}
              <div>
                <h3 className="text-sm text-gray-700 mb-2">Related Entity</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{caseData.relatedEntity.type}</p>
                      <p className="text-sm text-gray-900 mt-1">{caseData.relatedEntity.name}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {caseData.relatedEntity.id}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Evidence Files</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Upload Evidence
                </button>
              </div>
              <EvidenceGallery items={evidenceItems} onDownload={handleDownloadEvidence} />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="text-sm text-blue-900 block mb-2">Add New Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Note
                </button>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-3">
                <h3 className="text-sm text-gray-700">Previous Notes</h3>
                {notes.map((note) => (
                  <div key={note.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-700">
                            {note.author
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{note.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(note.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-10">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              Export Case Report
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark Resolved
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
