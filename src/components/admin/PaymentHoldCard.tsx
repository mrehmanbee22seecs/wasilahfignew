import React from 'react';
import { DollarSign, Clock, AlertCircle, CheckCircle, User, FileText, Receipt } from 'lucide-react';

export interface PaymentHold {
  holdId: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'approved_once' | 'released' | 'rejected';
  createdAt: string;
  createdBy: string;
  firstApprover?: {
    name: string;
    approvedAt: string;
  };
  secondApprover?: {
    name: string;
    approvedAt: string;
  };
  urgency: 'normal' | 'urgent';
}

interface PaymentHoldCardProps {
  hold: PaymentHold;
  onApprove: (holdId: string) => void;
  onReject: (holdId: string) => void;
  onViewDetails: (holdId: string) => void;
  onRequestRelease?: (holdId: string) => void;
  onViewLedger?: (holdId: string) => void;
  onAddNote?: (holdId: string) => void;
  currentUserId?: string;
}

const statusConfig = {
  pending: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    label: 'Awaiting First Approval',
  },
  approved_once: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    label: 'Awaiting Second Approval',
  },
  released: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    label: 'Released',
  },
  rejected: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    label: 'Rejected',
  },
};

export function PaymentHoldCard({
  hold,
  onApprove,
  onReject,
  onViewDetails,
  onRequestRelease,
  onViewLedger,
  onAddNote,
  currentUserId = 'user-001',
}: PaymentHoldCardProps) {
  const config = statusConfig[hold.status];
  const canApprove = hold.status === 'pending' || hold.status === 'approved_once';
  const needsSecondApproval = hold.status === 'approved_once';

  return (
    <div
      className={`p-4 bg-white border rounded-lg ${
        hold.urgency === 'urgent' ? 'border-red-300 shadow-md' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">#{hold.holdId}</span>
            {hold.urgency === 'urgent' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 border border-red-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Urgent
              </span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${config.bg} ${config.border} ${config.text}`}
            >
              {config.label}
            </span>
          </div>
          <h3 className="text-gray-900">{hold.projectName}</h3>
          <p className="text-sm text-gray-600">{hold.ngoName}</p>
        </div>
        <div className="text-right">
          <p className="text-xl text-gray-900">
            {hold.currency} {hold.amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Hold Amount</p>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 uppercase mb-1">Reason for Hold</p>
        <p className="text-sm text-gray-900">{hold.reason}</p>
      </div>

      {/* Approval Status */}
      <div className="mb-3 space-y-2">
        {/* First Approver */}
        <div
          className={`flex items-center gap-2 text-sm ${
            hold.firstApprover ? 'text-emerald-700' : 'text-gray-500'
          }`}
        >
          {hold.firstApprover ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <span>
            First Approval:{' '}
            {hold.firstApprover
              ? `${hold.firstApprover.name} on ${new Date(hold.firstApprover.approvedAt).toLocaleString()}`
              : 'Pending'}
          </span>
        </div>

        {/* Second Approver */}
        <div
          className={`flex items-center gap-2 text-sm ${
            hold.secondApprover
              ? 'text-emerald-700'
              : hold.status === 'approved_once'
              ? 'text-blue-700'
              : 'text-gray-400'
          }`}
        >
          {hold.secondApprover ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <span>
            Second Approval:{' '}
            {hold.secondApprover
              ? `${hold.secondApprover.name} on ${new Date(hold.secondApprover.approvedAt).toLocaleString()}`
              : needsSecondApproval
              ? 'Awaiting...'
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="mb-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Created by {hold.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(hold.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewDetails(hold.holdId)}
          className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          View Details
        </button>
        
        {/* Additional Actions */}
        {onViewLedger && (
          <button
            onClick={() => onViewLedger(hold.holdId)}
            className="px-3 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="View Ledger"
          >
            <Receipt className="w-4 h-4" />
          </button>
        )}
        
        {onAddNote && (
          <button
            onClick={() => onAddNote(hold.holdId)}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            title="Add Note"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}
        
        {/* Request Release (only for approved_once status) */}
        {hold.status === 'approved_once' && onRequestRelease && (
          <button
            onClick={() => onRequestRelease(hold.holdId)}
            className="px-3 py-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Request Release"
          >
            Request Release
          </button>
        )}
        
        {canApprove && hold.status !== 'released' && hold.status !== 'rejected' && (
          <>
            <button
              onClick={() => onApprove(hold.holdId)}
              className="flex-1 px-3 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {needsSecondApproval ? 'Give 2nd Approval' : 'Give 1st Approval'}
            </button>
            <button
              onClick={() => onReject(hold.holdId)}
              className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}