import React, { useState } from 'react';
import { 
  Users, Search, Filter, CheckCircle, XCircle, MessageSquare,
  Eye, Award, Download, Mail, Phone, MapPin, Calendar,
  UserCheck, UserX, ChevronDown, ChevronUp, Clock, FileDown
} from 'lucide-react';
import { QuickMessageModal } from '../modals/QuickMessageModal';
import { IssueCertificateModal } from '../modals/IssueCertificateModal';

interface VolunteersTabProps {
  projectId: string;
  volunteerTarget: number;
}

interface VolunteerApplication {
  id: string;
  volunteer: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    phone: string;
    location: string;
  };
  status: 'applied' | 'accepted' | 'rejected' | 'completed';
  appliedDate: string;
  skills: string[];
  availability: string;
  note?: string;
  hoursCommitted?: number;
  hoursCompleted?: number;
}

// Mock data
const MOCK_APPLICATIONS: VolunteerApplication[] = [
  {
    id: 'app_1',
    volunteer: {
      id: 'v1',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      phone: '+92-300-1234567',
      location: 'Karachi'
    },
    status: 'applied',
    appliedDate: '2026-02-10T09:30:00Z',
    skills: ['Community Outreach', 'Event Management'],
    availability: 'Weekends',
    hoursCommitted: 16
  },
  {
    id: 'app_2',
    volunteer: {
      id: 'v2',
      name: 'Ali Hassan',
      email: 'ali.hassan@email.com',
      phone: '+92-321-7654321',
      location: 'Karachi'
    },
    status: 'accepted',
    appliedDate: '2026-02-09T14:15:00Z',
    skills: ['Photography', 'Social Media'],
    availability: 'Flexible',
    note: 'Accepted - Photography lead for documentation',
    hoursCommitted: 20,
    hoursCompleted: 8
  },
  {
    id: 'app_3',
    volunteer: {
      id: 'v3',
      name: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      phone: '+92-333-9876543',
      location: 'Karachi'
    },
    status: 'accepted',
    appliedDate: '2026-02-08T10:00:00Z',
    skills: ['First Aid', 'Coordination'],
    availability: 'Weekdays',
    note: 'Accepted - Safety coordinator',
    hoursCommitted: 24,
    hoursCompleted: 12
  },
  {
    id: 'app_4',
    volunteer: {
      id: 'v4',
      name: 'Ahmed Raza',
      email: 'ahmed.raza@email.com',
      phone: '+92-345-1122334',
      location: 'Lahore'
    },
    status: 'rejected',
    appliedDate: '2026-02-07T16:45:00Z',
    skills: ['Teaching', 'Training'],
    availability: 'Weekends',
    note: 'Rejected - Geographic distance'
  },
  {
    id: 'app_5',
    volunteer: {
      id: 'v5',
      name: 'Zainab Malik',
      email: 'zainab.malik@email.com',
      phone: '+92-311-5566778',
      location: 'Karachi'
    },
    status: 'completed',
    appliedDate: '2026-02-06T11:20:00Z',
    skills: ['Data Entry', 'Reporting'],
    availability: 'Flexible',
    note: 'Completed - Certificate issued',
    hoursCommitted: 12,
    hoursCompleted: 14
  },
  {
    id: 'app_6',
    volunteer: {
      id: 'v6',
      name: 'Hassan Ali',
      email: 'hassan.ali@email.com',
      phone: '+92-322-9988776',
      location: 'Karachi'
    },
    status: 'applied',
    appliedDate: '2026-02-11T08:15:00Z',
    skills: ['Transportation', 'Logistics'],
    availability: 'Weekdays',
    hoursCommitted: 16
  },
  {
    id: 'app_7',
    volunteer: {
      id: 'v7',
      name: 'Ayesha Siddiqui',
    email: 'ayesha.s@email.com',
      phone: '+92-300-4455667',
      location: 'Karachi'
    },
    status: 'applied',
    appliedDate: '2026-02-11T13:30:00Z',
    skills: ['Public Speaking', 'Fundraising'],
    availability: 'Weekends',
    hoursCommitted: 20
  },
  {
    id: 'app_8',
    volunteer: {
      id: 'v8',
      name: 'Bilal Ahmed',
      email: 'bilal.ahmed@email.com',
      phone: '+92-333-2233445',
      location: 'Karachi'
    },
    status: 'accepted',
    appliedDate: '2026-02-05T09:00:00Z',
    skills: ['Video Production', 'Editing'],
    availability: 'Flexible',
    note: 'Accepted - Media team lead',
    hoursCommitted: 18,
    hoursCompleted: 6
  }
];

export function VolunteersTab({ projectId, volunteerTarget }: VolunteersTabProps) {
  const [applications, setApplications] = useState<VolunteerApplication[]>(MOCK_APPLICATIONS);
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'all' | VolunteerApplication['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplication | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  const handleAccept = (applicationId: string) => {
    setApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status: 'accepted' as const, note: 'Accepted' } : app
    ));
    setSelectedApplications(prev => {
      const next = new Set(prev);
      next.delete(applicationId);
      return next;
    });
  };

  const handleReject = (applicationId: string) => {
    setApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status: 'rejected' as const, note: 'Rejected' } : app
    ));
    setSelectedApplications(prev => {
      const next = new Set(prev);
      next.delete(applicationId);
      return next;
    });
  };

  const handleBulkAccept = () => {
    setApplications(prev => prev.map(app =>
      selectedApplications.has(app.id) ? { ...app, status: 'accepted' as const, note: 'Bulk accepted' } : app
    ));
    setSelectedApplications(new Set());
  };

  const handleBulkReject = () => {
    setApplications(prev => prev.map(app =>
      selectedApplications.has(app.id) ? { ...app, status: 'rejected' as const, note: 'Bulk rejected' } : app
    ));
    setSelectedApplications(new Set());
  };

  const handleMessage = (application: VolunteerApplication) => {
    setSelectedVolunteer(application);
    setMessageModalOpen(true);
  };

  const handleIssueCertificate = (application: VolunteerApplication) => {
    setSelectedVolunteer(application);
    setCertificateModalOpen(true);
  };

  const handleBulkMessage = () => {
    // Open message modal with bulk selection
    setMessageModalOpen(true);
  };

  const handleExportCSV = () => {
    // Export selected or all applications
    const dataToExport = selectedApplications.size > 0
      ? applications.filter(app => selectedApplications.has(app.id))
      : filteredApplications;
    
    // Create CSV header
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Status', 'Applied Date', 'Skills', 'Availability', 'Hours Committed', 'Hours Completed', 'Note'];
    
    // Create CSV rows
    const rows = dataToExport.map(app => [
      app.volunteer.name,
      app.volunteer.email,
      app.volunteer.phone,
      app.volunteer.location,
      app.status,
      new Date(app.appliedDate).toLocaleDateString(),
      app.skills.join('; '),
      app.availability,
      app.hoursCommitted || 0,
      app.hoursCompleted || 0,
      app.note || ''
    ]);
    
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
    link.setAttribute('download', `volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelection = (applicationId: string) => {
    setSelectedApplications(prev => {
      const next = new Set(prev);
      if (next.has(applicationId)) {
        next.delete(applicationId);
      } else {
        next.add(applicationId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = !searchQuery || 
      app.volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDateRange = !dateFrom || !dateTo || (
      new Date(app.appliedDate) >= new Date(dateFrom) && new Date(app.appliedDate) <= new Date(dateTo)
    );
    const matchesSkills = skillsFilter.length === 0 || app.skills.some(skill => skillsFilter.includes(skill));
    return matchesStatus && matchesSearch && matchesDateRange && matchesSkills;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    completed: applications.filter(a => a.status === 'completed').length
  };

  const getStatusConfig = (status: VolunteerApplication['status']) => {
    switch (status) {
      case 'applied':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'Applied' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Accepted' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Rejected' };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Award, label: 'Completed' };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Users, label: status };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-2xl text-slate-900">{stats.accepted}</p>
          <p className="text-xs text-slate-600 mt-1">Accepted</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg text-center border-2 border-yellow-200">
          <p className="text-2xl text-yellow-700">{stats.applied}</p>
          <p className="text-xs text-yellow-700 mt-1">Pending</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-2xl text-blue-700">{stats.completed}</p>
          <p className="text-xs text-blue-700 mt-1">Completed</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-2xl text-slate-900">{stats.total} <span className="text-base text-slate-500">/ {volunteerTarget}</span></p>
          <p className="text-xs text-slate-600 mt-1">Total / Target</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or skills..."
            className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700">Date Range:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700">Skills:</label>
            <input
              type="text"
              value={skillsFilter.join(', ')}
              onChange={(e) => setSkillsFilter(e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill))}
              placeholder="Enter skills separated by commas..."
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedApplications.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
          <span className="text-sm text-teal-900">
            {selectedApplications.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkAccept}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Accept All
            </button>
            <button
              onClick={handleBulkReject}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <UserX className="w-4 h-4" />
              Reject All
            </button>
            <button
              onClick={handleBulkMessage}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-slate-700">
            Volunteer Applications ({filteredApplications.length})
          </h3>
          {filteredApplications.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
            >
              {selectedApplications.size === filteredApplications.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredApplications.map(application => {
            const statusConfig = getStatusConfig(application.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedApplication === application.id;
            const isSelected = selectedApplications.has(application.id);

            return (
              <div
                key={application.id}
                className={`p-4 bg-white border-2 rounded-xl transition-all ${
                  isSelected ? 'border-teal-300 bg-teal-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(application.id)}
                    className="mt-1 w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-300"
                  />

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    {application.volunteer.name.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-900">{application.volunteer.name}</h4>
                        <p className="text-xs text-slate-600 truncate">{application.volunteer.email}</p>
                      </div>
                      
                      <div className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border-2 text-xs ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {application.skills.map(skill => (
                        <span 
                          key={skill}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Quick Info */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(application.appliedDate)}
                      </span>
                      <span>•</span>
                      <span>{application.availability}</span>
                      <span>•</span>
                      <span>{application.hoursCommitted}h committed</span>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-lg space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-3 h-3" />
                          {application.volunteer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="w-3 h-3" />
                          {application.volunteer.location}
                        </div>
                        {application.hoursCompleted !== undefined && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Award className="w-3 h-3" />
                            {application.hoursCompleted} / {application.hoursCommitted} hours completed
                          </div>
                        )}
                        {application.note && (
                          <div className="pt-2 border-t-2 border-slate-200">
                            <p className="text-slate-600">Note: {application.note}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {application.status === 'applied' && (
                        <>
                          <button
                            onClick={() => handleAccept(application.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(application.id)}
                            className="px-3 py-2 text-sm bg-white border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleMessage(application)}
                        className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
                        title="Send message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      
                      <a
                        href={`/volunteer/${application.volunteer.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
                        title="View profile"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      {application.status === 'completed' && (
                        <button
                          onClick={() => handleIssueCertificate(application)}
                          className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
                          title="Issue certificate"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => setExpandedApplication(isExpanded ? null : application.id)}
                        className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No applications found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-teal-600 hover:text-teal-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedVolunteer && (
        <>
          <QuickMessageModal
            isOpen={messageModalOpen}
            onClose={() => {
              setMessageModalOpen(false);
              setSelectedVolunteer(null);
            }}
            volunteer={selectedVolunteer.volunteer}
          />
          
          <IssueCertificateModal
            isOpen={certificateModalOpen}
            onClose={() => {
              setCertificateModalOpen(false);
              setSelectedVolunteer(null);
            }}
            volunteer={selectedVolunteer.volunteer}
            hoursCompleted={selectedVolunteer.hoursCompleted || 0}
          />
        </>
      )}
    </div>
  );
}