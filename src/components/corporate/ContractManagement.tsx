import React, { useState } from 'react';
import { 
  FileText, Calendar, AlertCircle, CheckCircle, Clock, 
  Download, ExternalLink, Plus, Search, Filter, Eye, XCircle 
} from 'lucide-react';
import type { Contract } from '../../types/corporate';
import { toast } from 'sonner';

interface ContractManagementProps {
  contracts: Contract[];
  onCreateContract?: () => void;
  onViewContract?: (contractId: string) => void;
}

export function ContractManagement({ 
  contracts, 
  onCreateContract = () => {},
  onViewContract = () => {}
}: ContractManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Contract['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Contract['contractType'] | 'all'>('all');

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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: Contract['status']) => {
    const configs = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft', icon: FileText },
      pending_signature: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending Signature', icon: Clock },
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', icon: CheckCircle },
      expired: { bg: 'bg-red-100', text: 'text-red-700', label: 'Expired', icon: AlertCircle },
      terminated: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Terminated', icon: XCircle }
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

  const getTypeBadge = (type: Contract['contractType']) => {
    const labels = {
      mou: 'MOU',
      service_agreement: 'Service Agreement',
      grant_agreement: 'Grant Agreement',
      partnership: 'Partnership'
    };
    
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
        {labels[type]}
      </span>
    );
  };

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.ngoName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.contractType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get expiring contracts (within 30 days)
  const expiringContracts = contracts.filter(c => {
    if (c.status !== 'active') return false;
    const days = getDaysUntilExpiry(c.expiresAt);
    return days <= 30 && days > 0;
  });

  // Get expired contracts
  const expiredContracts = contracts.filter(c => c.status === 'expired');

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Contract Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage agreements with NGO partners
          </p>
        </div>
        <button
          onClick={onCreateContract}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Contract
        </button>
      </div>

      {/* Alerts */}
      {(expiringContracts.length > 0 || expiredContracts.length > 0) && (
        <div className="mb-6 space-y-3">
          {expiringContracts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-900 font-medium mb-2">
                    {expiringContracts.length} Contract{expiringContracts.length > 1 ? 's' : ''} Expiring Soon
                  </p>
                  <div className="space-y-2">
                    {expiringContracts.map(contract => (
                      <div key={contract.id} className="flex items-center justify-between text-sm">
                        <span className="text-amber-800">
                          {contract.projectName} - {contract.ngoName}
                        </span>
                        <span className="text-amber-700">
                          {getDaysUntilExpiry(contract.expiresAt)} days remaining
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {expiredContracts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-red-900 font-medium">
                    {expiredContracts.length} Expired Contract{expiredContracts.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    Please review and renew if needed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Contract['status'] | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending_signature">Pending Signature</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as Contract['contractType'] | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="mou">MOU</option>
              <option value="service_agreement">Service Agreement</option>
              <option value="grant_agreement">Grant Agreement</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No contracts found</h3>
          <p className="text-gray-600 text-sm mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first contract to get started'}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <button
              onClick={onCreateContract}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Create Contract
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const daysUntilExpiry = getDaysUntilExpiry(contract.expiresAt);
            const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
            
            return (
              <div
                key={contract.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{contract.projectName}</h3>
                      {getTypeBadge(contract.contractType)}
                    </div>
                    <p className="text-sm text-gray-600">{contract.ngoName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl text-gray-900 mb-2">
                      {formatCurrency(contract.totalValue)}
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                </div>

                {/* Contract Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Start Date</p>
                    <p className="text-sm text-gray-900">{formatDate(contract.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                    <p className={`text-sm ${isExpiringSoon ? 'text-amber-700 font-medium' : 'text-gray-900'}`}>
                      {formatDate(contract.expiresAt)}
                      {isExpiringSoon && (
                        <span className="block text-xs text-amber-600 mt-0.5">
                          {daysUntilExpiry} days left
                        </span>
                      )}
                    </p>
                  </div>
                  {contract.signedAt && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Signed On</p>
                      <p className="text-sm text-gray-900">{formatDate(contract.signedAt)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Contract ID</p>
                    <p className="text-sm text-gray-900 font-mono">{contract.id}</p>
                  </div>
                </div>

                {/* Signatories */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Signatories</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {contract.signatories.corporateName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {contract.signatories.corporateDesignation}
                      </p>
                      {contract.signatories.corporateSignedAt && (
                        <div className="flex items-center gap-1 mt-1 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">
                            Signed {formatDate(contract.signatories.corporateSignedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {contract.signatories.ngoName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {contract.signatories.ngoDesignation}
                      </p>
                      {contract.signatories.ngoSignedAt ? (
                        <div className="flex items-center gap-1 mt-1 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">
                            Signed {formatDate(contract.signatories.ngoSignedAt)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-1 text-amber-700">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">Awaiting signature</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Key Deliverables</p>
                  <ul className="space-y-1">
                    {contract.clauses.deliverables.slice(0, 3).map((deliverable, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                    {contract.clauses.deliverables.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{contract.clauses.deliverables.length - 3} more deliverables
                      </li>
                    )}
                  </ul>
                </div>

                {/* Milestones */}
                {contract.milestones && contract.milestones.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Payment Milestones</p>
                    <div className="space-y-2">
                      {contract.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {milestone.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span className={milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}>
                              {milestone.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600">{formatCurrency(milestone.amount)}</span>
                            <span className="text-xs text-gray-500">{formatDate(milestone.dueDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onViewContract(contract.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {contract.documentUrl && (
                    <a
                      href={contract.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {isExpiringSoon && (
                    <button
                      onClick={() => toast.info('Renewal workflow coming soon')}
                      className="ml-auto px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                    >
                      Renew Contract
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}