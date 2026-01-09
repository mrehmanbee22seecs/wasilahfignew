import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, User, FileText, Send, AlertCircle } from 'lucide-react';

export interface Approver {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  signedAt?: string;
  comments?: string;
  required: boolean;
}

interface ApprovalSignoffsSectionProps {
  approvers: Approver[];
  currentUserRole: string;
  planStatus: 'draft' | 'pending-approval' | 'published';
  onRequestApproval: (approverIds: string[]) => void;
  onApprove: (approverId: string, comments?: string) => void;
  onReject: (approverId: string, comments: string) => void;
  onRemindApprover: (approverId: string) => void;
}

export function ApprovalSignoffsSection({
  approvers,
  currentUserRole,
  planStatus,
  onRequestApproval,
  onApprove,
  onReject,
  onRemindApprover
}: ApprovalSignoffsSectionProps) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const pendingCount = approvers.filter(a => a.status === 'pending').length;
  const approvedCount = approvers.filter(a => a.status === 'approved').length;
  const rejectedCount = approvers.filter(a => a.status === 'rejected').length;
  const requiredCount = approvers.filter(a => a.required).length;
  const requiredApprovedCount = approvers.filter(a => a.required && a.status === 'approved').length;

  const canPublish = requiredApprovedCount === requiredCount && requiredCount > 0;

  const handleRequestApprovals = () => {
    const pendingApprovers = approvers.filter(a => a.status === 'pending').map(a => a.id);
    onRequestApproval(pendingApprovers);
  };

  const handleApprovalAction = () => {
    if (!selectedApprover) return;

    if (actionType === 'approve') {
      onApprove(selectedApprover.id, approvalComments || undefined);
    } else {
      if (!approvalComments.trim()) {
        alert('Please provide a reason for rejection');
        return;
      }
      onReject(selectedApprover.id, approvalComments);
    }

    setShowApprovalModal(false);
    setSelectedApprover(null);
    setApprovalComments('');
  };

  const openApprovalModal = (approver: Approver, type: 'approve' | 'reject') => {
    setSelectedApprover(approver);
    setActionType(type);
    setApprovalComments('');
    setShowApprovalModal(true);
  };

  const getStatusIcon = (status: Approver['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status: Approver['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-900 flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Approvals & Sign-offs
          </h3>
          <p className="text-slate-600 text-sm">
            {canPublish ? (
              <span className="text-green-600 font-medium">✓ All required approvals received</span>
            ) : (
              <span>
                {requiredApprovedCount} of {requiredCount} required approvals received
              </span>
            )}
          </p>
        </div>

        {planStatus === 'draft' && pendingCount > 0 && (
          <button
            onClick={handleRequestApprovals}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
          >
            <Send className="w-4 h-4" />
            Request Approvals ({pendingCount})
          </button>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
          <div className="text-amber-600 text-sm">Pending</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
          <div className="text-green-600 text-sm">Approved</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
          <div className="text-red-600 text-sm">Rejected</div>
        </div>
      </div>

      {/* Approvers List */}
      <div className="space-y-3">
        {approvers.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No approvers configured</p>
            <p className="text-sm mt-1">Add approvers to enable sign-off workflow</p>
          </div>
        )}

        {approvers.map((approver) => {
          const canCurrentUserApprove = approver.email === currentUserRole; // Simplified check

          return (
            <div
              key={approver.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                approver.status === 'approved'
                  ? 'border-green-200 bg-green-50'
                  : approver.status === 'rejected'
                  ? 'border-red-200 bg-red-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                  {approver.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-slate-900 font-medium">{approver.name}</h4>
                        {approver.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full border border-red-300">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm">{approver.role}</p>
                      <p className="text-slate-500 text-xs">{approver.email}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(approver.status)}
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(approver.status)}`}>
                        {approver.status.charAt(0).toUpperCase() + approver.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  {approver.signedAt && (
                    <p className="text-xs text-slate-500 mb-2">
                      {approver.status === 'approved' ? 'Approved' : 'Rejected'} on {formatDate(approver.signedAt)}
                    </p>
                  )}

                  {/* Comments */}
                  {approver.comments && (
                    <div className="bg-white border-2 border-slate-200 rounded-lg p-3 mt-2">
                      <p className="text-slate-700 text-sm italic">"{approver.comments}"</p>
                    </div>
                  )}

                  {/* Actions */}
                  {approver.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-3">
                      {canCurrentUserApprove ? (
                        <>
                          <button
                            onClick={() => openApprovalModal(approver, 'approve')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => openApprovalModal(approver, 'reject')}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRemindApprover(approver.id)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors text-sm"
                        >
                          <Send className="w-4 h-4" />
                          Send Reminder
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning if rejected */}
      {rejectedCount > 0 && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">Plan has rejections</p>
            <p className="text-red-700 text-sm mt-1">
              Address the rejection comments and request approval again.
            </p>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedApprover && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowApprovalModal(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-900 mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} CSR Plan
            </h3>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-slate-600 text-sm mb-1">Approver</p>
              <p className="text-slate-900 font-medium">{selectedApprover.name}</p>
              <p className="text-slate-600 text-sm">{selectedApprover.role}</p>
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 mb-2">
                Comments {actionType === 'reject' && <span className="text-red-600">*</span>}
              </label>
              <textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100 resize-none"
                rows={4}
                placeholder={
                  actionType === 'approve'
                    ? 'Optional: Add comments...'
                    : 'Required: Explain why you are rejecting...'
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovalAction}
                className={`flex-1 px-6 py-3 rounded-lg transition-all ${
                  actionType === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
