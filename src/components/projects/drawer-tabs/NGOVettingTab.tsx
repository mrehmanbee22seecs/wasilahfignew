import React, { useState } from 'react';
import { 
  Building2, CheckCircle, XCircle, Info, ExternalLink, 
  Shield, FileCheck, Users, TrendingUp, AlertTriangle,
  Clock, Calendar, Mail, Phone, MapPin, Star, Award, MapPinned, Filter, Link2
} from 'lucide-react';
import { ApproveNGOModal } from '../modals/ApproveNGOModal';
import { RejectNGOModal } from '../modals/RejectNGOModal';
import { RequestInfoModal } from '../modals/RequestInfoModal';
import { RequestSiteVisitModal } from '../modals/RequestSiteVisitModal';
import { AttachNGOModal } from '../modals/AttachNGOModal';

interface NGOVettingTabProps {
  projectId: string;
}

interface NGOCandidate {
  id: string;
  name: string;
  score: number;
  badges: string[];
  lastProjectDate?: string;
  contact: {
    email: string;
    phone: string;
    person: string;
  };
  location: string;
  distance?: number; // Distance in km
  focusAreas: string[];
  status: 'pending' | 'approved' | 'rejected';
  scorecard: {
    registration: number;
    financial: number;
    references: number;
    beneficiary: number;
  };
  recentProjects: number;
  totalBeneficiaries: number;
  documents?: {
    name: string;
    expiryDate: string;
    isExpired: boolean;
  }[];
}

// Mock candidate data
const MOCK_CANDIDATES: NGOCandidate[] = [
  {
    id: 'ngo_1',
    name: 'Al-Khidmat Foundation',
    score: 95,
    badges: ['registered', 'audited', 'verified'],
    lastProjectDate: '2026-01-15',
    contact: {
      email: 'projects@alkhidmat.org',
      phone: '+92-21-3456-7890',
      person: 'Ahmed Hassan'
    },
    location: 'Karachi, Pakistan',
    distance: 5.2,
    focusAreas: ['Education', 'Healthcare', 'Emergency Relief'],
    status: 'pending',
    scorecard: {
      registration: 100,
      financial: 95,
      references: 90,
      beneficiary: 95
    },
    recentProjects: 12,
    totalBeneficiaries: 45000,
    documents: [
      { name: 'Registration Certificate', expiryDate: '2027-06-15', isExpired: false },
      { name: 'Tax Exemption', expiryDate: '2026-02-28', isExpired: false },
      { name: 'Audit Report', expiryDate: '2025-12-31', isExpired: true }
    ]
  },
  {
    id: 'ngo_2',
    name: 'The Citizens Foundation',
    score: 92,
    badges: ['registered', 'audited', 'verified'],
    lastProjectDate: '2025-12-20',
    contact: {
      email: 'partnerships@tcf.org.pk',
      phone: '+92-21-3567-8901',
      person: 'Sana Malik'
    },
    location: 'Lahore, Pakistan',
    distance: 12.8,
    focusAreas: ['Education', 'Women Empowerment'],
    status: 'pending',
    scorecard: {
      registration: 100,
      financial: 90,
      references: 95,
      beneficiary: 85
    },
    recentProjects: 8,
    totalBeneficiaries: 28000,
    documents: [
      { name: 'Registration Certificate', expiryDate: '2028-03-20', isExpired: false },
      { name: 'Tax Exemption', expiryDate: '2026-12-31', isExpired: false },
      { name: 'Audit Report', expiryDate: '2026-06-30', isExpired: false }
    ]
  },
  {
    id: 'ngo_3',
    name: 'Edhi Foundation',
    score: 88,
    badges: ['registered', 'verified'],
    lastProjectDate: '2025-11-10',
    contact: {
      email: 'contact@edhi.org',
      phone: '+92-21-2345-6789',
      person: 'Bilal Edhi'
    },
    location: 'Karachi, Pakistan',
    distance: 8.5,
    focusAreas: ['Healthcare', 'Social Welfare', 'Emergency Relief'],
    status: 'pending',
    scorecard: {
      registration: 100,
      financial: 75,
      references: 90,
      beneficiary: 90
    },
    recentProjects: 15,
    totalBeneficiaries: 62000,
    documents: [
      { name: 'Registration Certificate', expiryDate: '2029-01-10', isExpired: false },
      { name: 'Tax Exemption', expiryDate: '2026-01-05', isExpired: true },
      { name: 'Audit Report', expiryDate: '2026-08-15', isExpired: false }
    ]
  }
];

export function NGOVettingTab({ projectId }: NGOVettingTabProps) {
  const [candidates, setCandidates] = useState<NGOCandidate[]>(MOCK_CANDIDATES);
  const [selectedNGO, setSelectedNGO] = useState<NGOCandidate | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [requestInfoModalOpen, setRequestInfoModalOpen] = useState(false);
  const [siteVisitModalOpen, setSiteVisitModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [expandedScorecard, setExpandedScorecard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'proximity'>('score');
  const [filterMinScore, setFilterMinScore] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const vettingStatus = candidates.some(c => c.status === 'approved' || c.status === 'rejected')
    ? 'in-progress'
    : 'not-started';

  const approvedCount = candidates.filter(c => c.status === 'approved').length;
  const pendingCount = candidates.filter(c => c.status === 'pending').length;

  const handleApprove = (ngo: NGOCandidate) => {
    setSelectedNGO(ngo);
    setApproveModalOpen(true);
  };

  const handleReject = (ngo: NGOCandidate) => {
    setSelectedNGO(ngo);
    setRejectModalOpen(true);
  };

  const handleRequestInfo = (ngo: NGOCandidate) => {
    setSelectedNGO(ngo);
    setRequestInfoModalOpen(true);
  };

  const handleRequestSiteVisit = () => {
    setSiteVisitModalOpen(true);
  };

  const handleAttachToProject = (ngo: NGOCandidate) => {
    setSelectedNGO(ngo);
    setAttachModalOpen(true);
  };

  const confirmApprove = (note: string) => {
    if (!selectedNGO) return;
    
    setCandidates(prev => prev.map(c => 
      c.id === selectedNGO.id ? { ...c, status: 'approved' as const } : c
    ));
    setApproveModalOpen(false);
    setSelectedNGO(null);
  };

  const confirmReject = (reason: string) => {
    if (!selectedNGO) return;
    
    setCandidates(prev => prev.map(c => 
      c.id === selectedNGO.id ? { ...c, status: 'rejected' as const } : c
    ));
    setRejectModalOpen(false);
    setSelectedNGO(null);
  };

  const confirmAttach = () => {
    if (!selectedNGO) return;
    
    setCandidates(prev => prev.map(c => 
      c.id === selectedNGO.id ? { ...c, status: 'approved' as const } : c
    ));
    setAttachModalOpen(false);
    setSelectedNGO(null);
  };

  // Filter candidates by minimum score
  const filteredCandidates = candidates.filter(c => c.score >= filterMinScore);

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else if (sortBy === 'proximity') {
      return (a.distance || 999) - (b.distance || 999);
    } else {
      const dateA = a.lastProjectDate ? new Date(a.lastProjectDate).getTime() : 0;
      const dateB = b.lastProjectDate ? new Date(b.lastProjectDate).getTime() : 0;
      return dateB - dateA;
    }
  });

  const getBadgeConfig = (badge: string) => {
    switch (badge) {
      case 'registered':
        return { label: 'Registered', color: 'bg-green-100 text-green-700', icon: FileCheck };
      case 'audited':
        return { label: 'Audited', color: 'bg-blue-100 text-blue-700', icon: Shield };
      case 'verified':
        return { label: 'Verified', color: 'bg-purple-100 text-purple-700', icon: Award };
      default:
        return { label: badge, color: 'bg-slate-100 text-slate-700', icon: CheckCircle };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVettingStatusConfig = () => {
    switch (vettingStatus) {
      case 'not-started':
        return {
          label: 'Not Started',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Clock
        };
      default:
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle
        };
    }
  };

  const hasExpiredDocs = (ngo: NGOCandidate) => {
    return ngo.documents?.some(doc => doc.isExpired) || false;
  };

  const statusConfig = getVettingStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Vetting Status Header */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm text-slate-700 mb-2">Vetting Status</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs ${statusConfig.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </div>
          </div>
          <button 
            onClick={handleRequestSiteVisit}
            className="px-4 py-2 text-sm bg-white border-2 border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2"
          >
            <MapPinned className="w-4 h-4" />
            Request Site Visit
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-2xl text-slate-900">{approvedCount}</p>
            <p className="text-xs text-slate-600 mt-1">Approved</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-2xl text-slate-900">{pendingCount}</p>
            <p className="text-xs text-slate-600 mt-1">Pending</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-2xl text-slate-900">{candidates.length}</p>
            <p className="text-xs text-slate-600 mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Sorting and Filtering Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-slate-700">Candidate NGOs</h3>
          <span className="text-xs text-slate-500">({sortedCandidates.length} shown)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 text-xs border-2 rounded-lg transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'recent' | 'proximity')}
            className="text-xs px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none"
          >
            <option value="score">Sort by Score</option>
            <option value="proximity">Sort by Proximity</option>
            <option value="recent">Sort by Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-700 mb-2">
                Minimum Score: {filterMinScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filterMinScore}
                onChange={(e) => setFilterMinScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NGO Candidates List */}
      <div className="space-y-4">
        {sortedCandidates.map(ngo => (
          <div 
            key={ngo.id}
            className={`p-4 bg-white border-2 rounded-xl transition-all ${
              ngo.status === 'approved' 
                ? 'border-green-200 bg-green-50/30' 
                : ngo.status === 'rejected'
                ? 'border-red-200 bg-red-50/30 opacity-60'
                : 'border-slate-200 hover:border-teal-300'
            }`}
          >
            {/* Expired Docs Warning */}
            {hasExpiredDocs(ngo) && ngo.status === 'pending' && (
              <div className="mb-3 flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-900 mb-1">Expired Documents Detected</p>
                  <div className="text-xs text-red-700 space-y-0.5">
                    {ngo.documents?.filter(d => d.isExpired).map(doc => (
                      <div key={doc.name}>• {doc.name} (expired {new Date(doc.expiryDate).toLocaleDateString()})</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NGO Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-slate-900">{ngo.name}</h4>
                  {ngo.status === 'approved' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {ngo.status === 'rejected' && (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {ngo.badges.map(badge => {
                    const config = getBadgeConfig(badge);
                    const Icon = config.icon;
                    return (
                      <span 
                        key={badge}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    );
                  })}
                </div>

                {/* Location and Focus */}
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {ngo.location}
                    {ngo.distance && (
                      <span className="ml-1 text-teal-600">({ngo.distance}km)</span>
                    )}
                  </span>
                  <span>•</span>
                  <span>{ngo.focusAreas.join(', ')}</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className={`text-3xl ${getScoreColor(ngo.score)}`}>
                  {ngo.score}
                </div>
                <p className="text-xs text-slate-600">Score</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-900">{ngo.recentProjects}</p>
                <p className="text-xs text-slate-600">Projects</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-900">{(ngo.totalBeneficiaries / 1000).toFixed(0)}K</p>
                <p className="text-xs text-slate-600">Beneficiaries</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-900">
                  {ngo.lastProjectDate 
                    ? new Date(ngo.lastProjectDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-slate-600">Last Project</p>
              </div>
            </div>

            {/* Scorecard */}
            <div className="mb-3">
              <button
                onClick={() => setExpandedScorecard(expandedScorecard === ngo.id ? null : ngo.id)}
                className="flex items-center gap-2 text-xs text-teal-600 hover:text-teal-700 transition-colors"
              >
                <Info className="w-3 h-3" />
                {expandedScorecard === ngo.id ? 'Hide' : 'View'} Scorecard Details
              </button>
              
              {expandedScorecard === ngo.id && (
                <div className="mt-3 space-y-2 p-3 bg-slate-50 rounded-lg">
                  {Object.entries(ngo.scorecard).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-700 capitalize">
                          {key === 'beneficiary' ? 'Beneficiary Verification' : `${key} Status`}
                        </span>
                        <span className={`text-xs ${getScoreColor(value)}`}>
                          {value}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            value >= 90 ? 'bg-green-500' : 
                            value >= 75 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mb-3 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-2">Contact: {ngo.contact.person}</p>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {ngo.contact.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {ngo.contact.phone}
                </span>
              </div>
            </div>

            {/* Actions */}
            {ngo.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(ngo)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAttachToProject(ngo)}
                  className="px-4 py-2 bg-white border-2 border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-sm flex items-center gap-1"
                  title="Attach to Project"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReject(ngo)}
                  className="px-4 py-2 bg-white border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleRequestInfo(ngo)}
                  className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors text-sm"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {ngo.status === 'approved' && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span>Approved and attached to project</span>
              </div>
            )}

            {ngo.status === 'rejected' && (
              <div className="flex items-center gap-2 text-sm text-red-700">
                <XCircle className="w-4 h-4" />
                <span>Rejected</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedNGO && (
        <>
          <ApproveNGOModal
            isOpen={approveModalOpen}
            onClose={() => {
              setApproveModalOpen(false);
              setSelectedNGO(null);
            }}
            ngoName={selectedNGO.name}
            onConfirm={confirmApprove}
          />
          
          <RejectNGOModal
            isOpen={rejectModalOpen}
            onClose={() => {
              setRejectModalOpen(false);
              setSelectedNGO(null);
            }}
            ngoName={selectedNGO.name}
            onConfirm={confirmReject}
          />
          
          <RequestInfoModal
            isOpen={requestInfoModalOpen}
            onClose={() => {
              setRequestInfoModalOpen(false);
              setSelectedNGO(null);
            }}
            ngo={selectedNGO}
          />

          <AttachNGOModal
            isOpen={attachModalOpen}
            onClose={() => {
              setAttachModalOpen(false);
              setSelectedNGO(null);
            }}
            ngoName={selectedNGO.name}
            projectId={projectId}
            onConfirm={confirmAttach}
          />
        </>
      )}

      <RequestSiteVisitModal
        isOpen={siteVisitModalOpen}
        onClose={() => setSiteVisitModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}