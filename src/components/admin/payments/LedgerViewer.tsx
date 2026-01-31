import React, { useState } from 'react';
import { X, Download, FileText, Image, Receipt, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

export type LedgerEntry = {
  entryId: string;
  date: string;
  type: 'debit' | 'credit' | 'hold' | 'release';
  amount: number;
  balance: number;
  description: string;
  performedBy: string;
  attachments?: {
    id: string;
    name: string;
    type: 'receipt' | 'invoice' | 'document';
    url: string;
    size: number;
  }[];
};

type LedgerViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  holdId: string;
  ngoName: string;
  projectName: string;
  entries: LedgerEntry[];
};

export function LedgerViewer({
  isOpen,
  onClose,
  holdId,
  ngoName,
  projectName,
  entries,
}: LedgerViewerProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadAll = async () => {
    toast.info('Preparing download package...');
    
    // Simulate download preparation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Download started: ledger_' + holdId + '.zip');
  };

  const handleDownloadAttachment = (attachment: NonNullable<LedgerEntry['attachments']>[number]) => {
    toast.success(`Downloading ${attachment.name}`);
    // In production: trigger actual download
  };

  const getTypeColor = (type: LedgerEntry['type']) => {
    switch (type) {
      case 'credit':
        return 'bg-green-100 text-green-800';
      case 'debit':
        return 'bg-red-100 text-red-800';
      case 'hold':
        return 'bg-amber-100 text-amber-800';
      case 'release':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt':
        return <Receipt className="w-4 h-4" />;
      case 'invoice':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const totalCredits = entries
    .filter((e) => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalDebits = entries
    .filter((e) => e.type === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);

  const currentBalance = entries.length > 0 ? entries[entries.length - 1].balance : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl">Payment Ledger</h2>
            <p className="text-sm text-blue-100 mt-1">
              {projectName} • {ngoName}
            </p>
            <p className="text-xs text-blue-200 mt-0.5">
              Ledger ID: {holdId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Credits</p>
            <p className="text-2xl text-green-700">
              {totalCredits.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">PKR</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Debits</p>
            <p className="text-2xl text-red-700">
              {totalDebits.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">PKR</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200 bg-blue-50">
            <p className="text-xs text-blue-700 mb-1">Current Balance</p>
            <p className="text-2xl text-blue-900">
              {currentBalance.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">PKR</p>
          </div>
        </div>

        {/* Entries Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No ledger entries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.entryId}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ${getTypeColor(entry.type)}`}
                        >
                          {entry.type}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-1">{entry.description}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {entry.performedBy}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p
                        className={`text-xl ${
                          entry.type === 'credit' || entry.type === 'release'
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {entry.type === 'credit' || entry.type === 'release' ? '+' : '-'}
                        {entry.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Balance: {entry.balance.toLocaleString()} PKR
                      </p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-2">Attachments:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {entry.attachments.map((attachment) => (
                          <button
                            key={attachment.id}
                            onClick={() => handleDownloadAttachment(attachment)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 text-blue-700">
                              {getTypeIcon(attachment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(attachment.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {entries.length} transaction{entries.length !== 1 ? 's' : ''} recorded
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
