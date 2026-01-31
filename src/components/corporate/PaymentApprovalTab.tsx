import React, { useState } from 'react';
import { 
  DollarSign, FileText, Calendar, CheckCircle, XCircle, 
  Clock, AlertCircle, Download, ExternalLink, Eye, MessageSquare 
} from 'lucide-react';
import type { PendingPayment } from '../../types/corporate';
import { toast } from 'sonner';

interface PaymentApprovalTabProps {
  pendingPayments: PendingPayment[];
  paymentHistory: PendingPayment[];
  onApprovePayment: (paymentId: string, notes: string) => Promise<void>;
  onRejectPayment: (paymentId: string, reason: string) => Promise<void>;
}

export function PaymentApprovalTab({ 
  pendingPayments, 
  paymentHistory,
  onApprovePayment, 
  onRejectPayment 
}: PaymentApprovalTabProps) {
  const [activeView, setActiveView] = useState<'pending' | 'history'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    if (!selectedPayment) return;
    
    setProcessing(true);
    try {
      await onApprovePayment(selectedPayment.id, approvalNotes);
      toast.success('Payment approved successfully');
      setShowApproveModal(false);
      setSelectedPayment(null);
      setApprovalNotes('');
    } catch (error) {
      toast.error('Failed to approve payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    setProcessing(true);
    try {
      await onRejectPayment(selectedPayment.id, rejectionReason);
      toast.success('Payment rejected');
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: PendingPayment['status']) => {
    const configs = {
      pending_corporate: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending Your Approval' },
      pending_admin: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending Admin Approval' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' }
    };
    
    const config = configs[status];
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const isPastDue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Payment Approvals</h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve payment requests from NGO partners
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('pending')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeView === 'pending'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingPayments.filter(p => p.status === 'pending_corporate').length})
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
        </div>
      </div>

      {/* Pending Payments */}
      {activeView === 'pending' && (
        <div className="space-y-4">
          {pendingPayments.filter(p => p.status === 'pending_corporate').length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600 text-sm">No pending payment requests at the moment.</p>
            </div>
          ) : (
            pendingPayments
              .filter(p => p.status === 'pending_corporate')
              .map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{payment.projectName}</h3>
                        {isPastDue(payment.dueDate) && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Past Due
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{payment.ngoName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-gray-900 mb-1">
                        {formatCurrency(payment.amount)}
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Invoice Number</p>
                      <p className="text-sm text-gray-900">{payment.invoiceNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Milestone</p>
                      <p className="text-sm text-gray-900">{payment.milestone || 'General Payment'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Requested By</p>
                      <p className="text-sm text-gray-900">{payment.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Requested On</p>
                      <p className="text-sm text-gray-900">{formatDate(payment.requestedAt)}</p>
                    </div>
                    {payment.dueDate && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Due Date</p>
                        <p className={`text-sm ${isPastDue(payment.dueDate) ? 'text-red-700' : 'text-gray-900'}`}>
                          {formatDate(payment.dueDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-900">{payment.description}</p>
                  </div>

                  {/* Documents */}
                  {payment.invoiceUrl && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={payment.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Invoice
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {payment.supportingDocs?.map((doc, idx) => (
                          <a
                            key={idx}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Supporting Doc {idx + 1}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowApproveModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* Pending Admin Approval */}
          {pendingPayments.filter(p => p.status === 'pending_admin').length > 0 && (
            <div className="mt-8">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Awaiting Admin Approval
              </h3>
              <div className="space-y-3">
                {pendingPayments
                  .filter(p => p.status === 'pending_admin')
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-gray-900">{payment.projectName}</p>
                        <p className="text-sm text-gray-600">{payment.ngoName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-600">
                          Approved by you on {formatDate(payment.corporateApprovedAt!)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment History */}
      {activeView === 'history' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">NGO</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.projectName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.ngoName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.requestedAt)}</td>
                  <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Approve Payment</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Project</p>
              <p className="text-gray-900 mb-3">{selectedPayment.projectName}</p>
              
              <p className="text-sm text-gray-600 mb-1">Amount</p>
              <p className="text-2xl text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">
                Approval Notes (Optional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes about this approval..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After your approval, this payment will be sent to Admin Finance 
                for final approval (dual approval system).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalNotes('');
                }}
                disabled={processing}
                className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Reject Payment</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Project</p>
              <p className="text-gray-900 mb-3">{selectedPayment.projectName}</p>
              
              <p className="text-sm text-gray-600 mb-1">Amount</p>
              <p className="text-2xl text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejection..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={processing}
                className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}