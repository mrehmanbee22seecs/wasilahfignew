import React, { useState } from 'react';
import { 
  Plus, FileText, DollarSign, Calendar, CheckCircle, 
  Clock, XCircle, AlertCircle, Upload, Trash2, Eye, Download 
} from 'lucide-react';
import type { PaymentRequest, PaymentMilestone } from '../../types/ngo-payments';
import { toast } from 'sonner';

interface PaymentRequestsTabProps {
  requests: PaymentRequest[];
  milestones?: PaymentMilestone[];
  onCreateRequest: (data: Partial<PaymentRequest>) => Promise<void>;
  onUploadInvoice: (file: File) => Promise<string>;
  onUploadDocument: (file: File) => Promise<string>;
  onDeleteDraft: (requestId: string) => void;
}

export function PaymentRequestsTab({ 
  requests, 
  milestones = [],
  onCreateRequest,
  onUploadInvoice,
  onUploadDocument,
  onDeleteDraft
}: PaymentRequestsTabProps) {
  const [activeView, setActiveView] = useState<'pending' | 'history' | 'drafts'>('pending');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const pendingRequests = requests.filter(r => 
    ['submitted', 'corporate_approved', 'admin_approved'].includes(r.status)
  );
  const historyRequests = requests.filter(r => 
    ['paid', 'rejected'].includes(r.status)
  );
  const draftRequests = requests.filter(r => r.status === 'draft');

  const totalReceived = requests
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPending = requests
    .filter(r => ['submitted', 'corporate_approved', 'admin_approved'].includes(r.status))
    .reduce((sum, r) => sum + r.amount, 0);

  const getStatusBadge = (status: PaymentRequest['status']) => {
    const configs = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft', icon: FileText },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted', icon: Clock },
      corporate_approved: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Corporate Approved', icon: Clock },
      admin_approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Admin Approved', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid', icon: CheckCircle }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Payment Requests</h2>
          <p className="text-sm text-gray-600 mt-1">
            Request payments from corporate partners
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Received YTD</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl text-gray-900">{formatCurrency(totalReceived)}</div>
          <div className="text-xs text-gray-600 mt-1">
            {requests.filter(r => r.status === 'paid').length} payment(s) received
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Approval</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl text-gray-900">{formatCurrency(totalPending)}</div>
          <div className="text-xs text-gray-600 mt-1">
            {pendingRequests.length} request(s) in progress
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Drafts</span>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl text-gray-900">{draftRequests.length}</div>
          <div className="text-xs text-gray-600 mt-1">
            Incomplete requests
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView('pending')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeView === 'pending'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeView === 'history'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveView('drafts')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeView === 'drafts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Drafts ({draftRequests.length})
        </button>
      </div>

      {/* Pending Requests */}
      {activeView === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create a payment request to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create Request
              </button>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <PaymentRequestCard 
                key={request.id} 
                request={request} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      )}

      {/* History */}
      {activeView === 'history' && (
        <div className="space-y-4">
          {historyRequests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No payment history</h3>
              <p className="text-gray-600 text-sm">
                Completed payment requests will appear here
              </p>
            </div>
          ) : (
            historyRequests.map((request) => (
              <PaymentRequestCard 
                key={request.id} 
                request={request} 
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      )}

      {/* Drafts */}
      {activeView === 'drafts' && (
        <div className="space-y-4">
          {draftRequests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No drafts</h3>
              <p className="text-gray-600 text-sm">
                Incomplete payment requests will be saved here
              </p>
            </div>
          ) : (
            draftRequests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{request.projectName || 'Untitled Request'}</h3>
                    <p className="text-sm text-gray-600">Draft saved {formatDate(request.requestedAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowCreateModal(true);
                        // TODO: Pre-fill form with draft data
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Continue Editing
                    </button>
                    <button
                      onClick={() => onDeleteDraft(request.id)}
                      className="px-3 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Payment Request Modal */}
      {showCreateModal && (
        <CreatePaymentRequestModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateRequest}
          onUploadInvoice={onUploadInvoice}
          onUploadDocument={onUploadDocument}
          milestones={milestones}
        />
      )}
    </div>
  );
}

// Payment Request Card Component
function PaymentRequestCard({ 
  request, 
  formatCurrency, 
  formatDate, 
  getStatusBadge 
}: { 
  request: PaymentRequest;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getStatusBadge: (status: PaymentRequest['status']) => JSX.Element;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-gray-900">{request.projectName}</h3>
            {request.milestoneName && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {request.milestoneName}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{request.corporateName}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-gray-900 mb-2">{formatCurrency(request.amount)}</div>
          {getStatusBadge(request.status)}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 mb-1">Invoice Number</p>
          <p className="text-sm text-gray-900">{request.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Requested On</p>
          <p className="text-sm text-gray-900">{formatDate(request.requestedAt)}</p>
        </div>
        {request.paidAt && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Paid On</p>
            <p className="text-sm text-emerald-700 font-medium">{formatDate(request.paidAt)}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">Description</p>
        <p className="text-sm text-gray-900">{request.description}</p>
      </div>

      {/* Status Timeline */}
      {request.status !== 'draft' && request.status !== 'rejected' && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-3">Approval Progress</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-700">Submitted</span>
            </div>
            <div className={`flex items-center gap-2 flex-1 ${
              request.corporateApprovedAt ? 'opacity-100' : 'opacity-40'
            }`}>
              {request.corporateApprovedAt ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-700">Corporate</span>
            </div>
            <div className={`flex items-center gap-2 flex-1 ${
              request.adminApprovedAt ? 'opacity-100' : 'opacity-40'
            }`}>
              {request.adminApprovedAt ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-700">Admin</span>
            </div>
            <div className={`flex items-center gap-2 flex-1 ${
              request.paidAt ? 'opacity-100' : 'opacity-40'
            }`}>
              {request.paidAt ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-700">Paid</span>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason */}
      {request.status === 'rejected' && request.rejectionReason && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-900 font-medium mb-1">Rejection Reason</p>
          <p className="text-sm text-red-800">{request.rejectionReason}</p>
          {request.rejectedBy && (
            <p className="text-xs text-red-700 mt-2">
              Rejected by {request.rejectedBy} on {formatDate(request.rejectedAt!)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Create Payment Request Modal Component
function CreatePaymentRequestModal({
  onClose,
  onCreate,
  onUploadInvoice,
  onUploadDocument,
  milestones
}: {
  onClose: () => void;
  onCreate: (data: Partial<PaymentRequest>) => Promise<void>;
  onUploadInvoice: (file: File) => Promise<string>;
  onUploadDocument: (file: File) => Promise<string>;
  milestones: PaymentMilestone[];
}) {
  const [formData, setFormData] = useState({
    projectId: 'proj-1',
    amount: '',
    description: '',
    invoiceNumber: '',
    milestoneId: ''
  });
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingInvoice, setUploadingInvoice] = useState(false);

  const handleInvoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Invoice must be a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Invoice must be under 5MB');
      return;
    }

    setInvoiceFile(file);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSupportingDocs(prev => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.amount || !formData.description || !formData.invoiceNumber || !invoiceFile) {
      toast.error('Please fill all required fields and upload invoice');
      return;
    }

    setUploading(true);

    try {
      // Upload invoice
      setUploadingInvoice(true);
      const invoiceUrl = await onUploadInvoice(invoiceFile);
      setUploadingInvoice(false);

      // Upload supporting documents
      const supportingDocUrls = await Promise.all(
        supportingDocs.map(doc => onUploadDocument(doc))
      );

      // Create payment request
      await onCreate({
        ...formData,
        amount: parseFloat(formData.amount),
        invoiceUrl,
        supportingDocs: supportingDocUrls,
        status: 'submitted'
      });

      toast.success('Payment request submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit payment request');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl text-gray-900 mb-6">Create Payment Request</h3>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Amount <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">PKR</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="150000"
              />
            </div>
          </div>

          {/* Milestone (Optional) */}
          {milestones.length > 0 && (
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Milestone (Optional)
              </label>
              <select
                value={formData.milestoneId}
                onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">No milestone</option>
                {milestones.filter(m => m.status === 'completed').map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} - PKR {m.amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Invoice Number */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Invoice Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="INV-2025-001"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={4}
              placeholder="Describe what this payment is for..."
            />
          </div>

          {/* Invoice Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Invoice (PDF) <span className="text-red-600">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {invoiceFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-900">{invoiceFile.name}</span>
                  </div>
                  <button
                    onClick={() => setInvoiceFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload invoice (PDF, max 5MB)</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleInvoiceUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Supporting Documents */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="cursor-pointer block text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Upload receipts, photos, etc.</p>
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>
              {supportingDocs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {supportingDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{doc.name}</span>
                      <button
                        onClick={() => setSupportingDocs(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {uploading ? (uploadingInvoice ? 'Uploading Invoice...' : 'Submitting...') : 'Submit Request'}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
