import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Download,
  CheckCircle, Clock, AlertCircle, FileText, ExternalLink, Eye, Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AddInvoiceModal } from '../modals/AddInvoiceModal';
import { RequestDisbursementModal } from '../modals/RequestDisbursementModal';
import { InvoiceAttachmentsModal } from '../modals/InvoiceAttachmentsModal';

interface FinanceTabProps {
  projectId: string;
  totalBudget: number;
}

interface Invoice {
  id: string;
  number: string;
  vendor: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid';
  dueDate: string;
  paidDate?: string;
  category: string;
  attachments?: string[];
  escrowHeld?: number;
}

// Mock data
const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    number: 'INV-2026-001',
    vendor: 'Al-Khidmat Foundation',
    amount: 85000,
    status: 'paid',
    dueDate: '2026-02-15',
    paidDate: '2026-02-14',
    category: 'NGO Services',
    attachments: ['invoice_001.pdf'],
    escrowHeld: 8500
  },
  {
    id: 'inv_2',
    number: 'INV-2026-002',
    vendor: 'SafetyFirst Equipment Co.',
    amount: 32500,
    status: 'paid',
    dueDate: '2026-02-10',
    paidDate: '2026-02-09',
    category: 'Equipment & Supplies',
    attachments: ['invoice_002.pdf', 'receipt_002.pdf'],
    escrowHeld: 0
  },
  {
    id: 'inv_3',
    number: 'INV-2026-003',
    vendor: 'Green Transport Services',
    amount: 18000,
    status: 'sent',
    dueDate: '2026-02-20',
    category: 'Transportation',
    escrowHeld: 1800
  },
  {
    id: 'inv_4',
    number: 'INV-2026-004',
    vendor: 'PrintPro Marketing',
    amount: 12350,
    status: 'draft',
    dueDate: '2026-02-25',
    category: 'Marketing & Communications',
    escrowHeld: 0
  }
];

const MOCK_CHART_DATA = [
  { month: 'Oct', budget: 45000, spent: 38000 },
  { month: 'Nov', budget: 50000, spent: 42000 },
  { month: 'Dec', budget: 55000, spent: 48000 },
  { month: 'Jan', budget: 50000, spent: 47000 },
  { month: 'Feb', budget: 50000, spent: 20850 }
];

export function FinanceTab({ projectId, totalBudget }: FinanceTabProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [disbursementOpen, setDisbursementOpen] = useState(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const totalPending = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalEscrow = invoices.reduce((sum, inv) => sum + (inv.escrowHeld || 0), 0);

  const remaining = totalBudget - totalSpent - totalPending;
  const spentPercentage = (totalSpent / totalBudget) * 100;
  const pendingPercentage = (totalPending / totalBudget) * 100;

  const handleMarkPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId 
        ? { ...inv, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] }
        : inv
    ));
  };

  const handleExportCSV = () => {
    // Create CSV header
    const headers = ['Invoice #', 'Vendor', 'Amount', 'Status', 'Category', 'Due Date', 'Paid Date', 'Escrow Held', 'Attachments'];
    
    // Create CSV rows
    const rows = invoices.map(inv => [
      inv.number,
      inv.vendor,
      inv.amount,
      inv.status,
      inv.category,
      inv.dueDate,
      inv.paidDate || '',
      inv.escrowHeld || 0,
      inv.attachments?.length || 0
    ]);
    
    // Add summary row
    rows.push([]);
    rows.push(['SUMMARY', '', '', '', '', '', '', '', '']);
    rows.push(['Total Budget', '', totalBudget, '', '', '', '', '', '']);
    rows.push(['Total Spent', '', totalSpent, '', '', '', '', '', '']);
    rows.push(['Total Pending', '', totalPending, '', '', '', '', '', '']);
    rows.push(['Total Escrow Held', '', totalEscrow, '', '', '', '', '', '']);
    rows.push(['Remaining', '', remaining, '', '', '', '', '', '']);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusConfig = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Paid' };
      case 'sent':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'Sent' };
      case 'draft':
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText, label: 'Draft' };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText, label: status };
    }
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString('en-PK')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm text-slate-900 mb-1">{payload[0].payload.month}</p>
          <div className="space-y-1">
            <p className="text-xs text-blue-600">
              Budget: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-xs text-teal-600">
              Spent: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div>
        <h3 className="text-sm text-slate-700 mb-3">Budget Summary</h3>
        <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-100">
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div>
              <p className="text-xs text-slate-600 mb-1">Total Budget</p>
              <p className="text-2xl text-slate-900">{formatCurrency(totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Remaining</p>
              <p className={`text-2xl ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-blue-600" />
                <p className="text-xs text-slate-600">Escrow Held</p>
              </div>
              <p className="text-2xl text-blue-600">{formatCurrency(totalEscrow)}</p>
            </div>
          </div>

          {/* Budget Bar */}
          <div className="relative h-8 bg-slate-200 rounded-lg overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
              style={{ width: `${spentPercentage}%` }}
            />
            <div
              className="absolute h-full bg-yellow-400/70 transition-all duration-500"
              style={{ left: `${spentPercentage}%`, width: `${pendingPercentage}%` }}
            />
            
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs text-white mix-blend-difference">
              <span>{spentPercentage.toFixed(0)}% Spent</span>
              <span>{pendingPercentage.toFixed(0)}% Pending</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" />
              <span className="text-slate-700">Spent: {formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-slate-700">Pending: {formatCurrency(totalPending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white border-2 border-slate-200 rounded-lg text-center">
          <p className="text-xs text-slate-600 mb-1">Invoices Paid</p>
          <p className="text-xl text-slate-900">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
        <div className="p-3 bg-white border-2 border-slate-200 rounded-lg text-center">
          <p className="text-xs text-slate-600 mb-1">Pending Payment</p>
          <p className="text-xl text-slate-900">
            {invoices.filter(i => i.status === 'sent').length}
          </p>
        </div>
        <div className="p-3 bg-white border-2 border-slate-200 rounded-lg text-center">
          <p className="text-xs text-slate-600 mb-1">Draft Invoices</p>
          <p className="text-xl text-slate-900">
            {invoices.filter(i => i.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* Spending Chart */}
      <div>
        <h3 className="text-sm text-slate-700 mb-3">Budget vs Spent Over Time</h3>
        <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-300" />
              <span className="text-slate-700">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-teal-500" />
              <span className="text-slate-700">Spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setAddInvoiceOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Invoice</span>
        </button>
        
        <button
          onClick={() => setDisbursementOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">Request Disbursement</span>
        </button>
      </div>

      {/* Invoices List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-slate-700">Invoices ({invoices.length})</h3>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 text-xs text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        <div className="space-y-3">
          {invoices.map(invoice => {
            const statusConfig = getStatusConfig(invoice.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={invoice.id}
                className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm text-slate-900">{invoice.number}</h4>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border-2 text-xs ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{invoice.vendor}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg text-slate-900">{formatCurrency(invoice.amount)}</p>
                    <p className="text-xs text-slate-600">{invoice.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                  <span>Due: {formatDate(invoice.dueDate)}</span>
                  {invoice.paidDate && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">Paid: {formatDate(invoice.paidDate)}</span>
                    </>
                  )}
                  {invoice.attachments && (
                    <>
                      <span>•</span>
                      <span>{invoice.attachments.length} attachment{invoice.attachments.length > 1 ? 's' : ''}</span>
                    </>
                  )}
                  {invoice.escrowHeld && invoice.escrowHeld > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Shield className="w-3 h-3" />
                        Escrow: {formatCurrency(invoice.escrowHeld)}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {invoice.status !== 'paid' && (
                    <button
                      onClick={() => handleMarkPaid(invoice.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Paid
                    </button>
                  )}
                  
                  {invoice.attachments && invoice.attachments.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setAttachmentsModalOpen(true);
                      }}
                      className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AddInvoiceModal
        isOpen={addInvoiceOpen}
        onClose={() => setAddInvoiceOpen(false)}
        onAdd={(invoice) => {
          setInvoices(prev => [...prev, { ...invoice, id: `inv_${Date.now()}` }]);
          setAddInvoiceOpen(false);
        }}
      />

      <RequestDisbursementModal
        isOpen={disbursementOpen}
        onClose={() => setDisbursementOpen(false)}
        projectId={projectId}
        availableBudget={remaining}
      />

      <InvoiceAttachmentsModal
        isOpen={attachmentsModalOpen}
        onClose={() => setAttachmentsModalOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
}