import React, { useState } from 'react';
import { X, FileText, Calendar, Download } from 'lucide-react';

interface RequestReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportRequest: ReportRequest) => void;
  availableProjects: Array<{ id: string; title: string }>;
}

export interface ReportRequest {
  reportType: 'monthly' | 'quarterly' | 'annual' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  includedProjects: string[];
  includeFinancials: boolean;
  includeVolunteers: boolean;
  includeMedia: boolean;
  format: 'pdf' | 'excel' | 'both';
  email?: string;
}

export function RequestReportModal({
  isOpen,
  onClose,
  onSubmit,
  availableProjects
}: RequestReportModalProps) {
  const [reportType, setReportType] = useState<ReportRequest['reportType']>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeVolunteers, setIncludeVolunteers] = useState(true);
  const [includeMedia, setIncludeMedia] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'excel' | 'both'>('pdf');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate date range based on report type
  const handleReportTypeChange = (type: ReportRequest['reportType']) => {
    setReportType(type);
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = '';

    switch (type) {
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        break;
      case 'quarterly':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
        break;
      case 'annual':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      case 'custom':
        // User will set dates manually
        break;
    }

    if (type !== 'custom') {
      setStartDate(start);
      setEndDate(end);
    }
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleAllProjects = () => {
    if (selectedProjects.length === availableProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(availableProjects.map(p => p.id));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (selectedProjects.length === 0) {
      newErrors.projects = 'Select at least one project';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const reportRequest: ReportRequest = {
      reportType,
      dateRange: { start: startDate, end: endDate },
      includedProjects: selectedProjects,
      includeFinancials,
      includeVolunteers,
      includeMedia,
      format,
      email: email || undefined
    };

    onSubmit(reportRequest);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-slate-900 text-lg">
                Request CSR Report
              </h2>
              <p className="text-slate-600 text-sm">Generate comprehensive reports for your CSR activities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-slate-700 mb-2">
              Report Type <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['monthly', 'quarterly', 'annual', 'custom'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleReportTypeChange(type)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    reportType === type
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-slate-700 mb-2">
                Start Date <span className="text-red-600">*</span>
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.startDate ? 'border-red-500' : 'border-slate-300 focus:border-teal-600'
                }`}
                disabled={reportType !== 'custom'}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="end-date" className="block text-slate-700 mb-2">
                End Date <span className="text-red-600">*</span>
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.endDate ? 'border-red-500' : 'border-slate-300 focus:border-teal-600'
                }`}
                disabled={reportType !== 'custom'}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-700">
                Include Projects <span className="text-red-600">*</span>
              </label>
              <button
                onClick={toggleAllProjects}
                className="text-teal-600 hover:text-teal-700 text-sm transition-colors"
              >
                {selectedProjects.length === availableProjects.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border-2 border-slate-200 rounded-lg p-3 space-y-2">
              {availableProjects.map((project) => (
                <label
                  key={project.id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleProject(project.id)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-slate-700 text-sm">{project.title}</span>
                </label>
              ))}
            </div>
            {errors.projects && (
              <p className="text-red-600 text-sm mt-1">{errors.projects}</p>
            )}
          </div>

          {/* Report Sections */}
          <div>
            <label className="block text-slate-700 mb-2">Include Sections</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={includeFinancials}
                  onChange={(e) => setIncludeFinancials(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <span className="text-slate-900 text-sm block">Financial Summary</span>
                  <span className="text-slate-500 text-xs">Budget, expenses, and allocations</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={includeVolunteers}
                  onChange={(e) => setIncludeVolunteers(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <span className="text-slate-900 text-sm block">Volunteer Data</span>
                  <span className="text-slate-500 text-xs">Participation and hours contributed</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={includeMedia}
                  onChange={(e) => setIncludeMedia(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <span className="text-slate-900 text-sm block">Media Gallery</span>
                  <span className="text-slate-500 text-xs">Photos and videos from projects</span>
                </div>
              </label>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-slate-700 mb-2">Report Format</label>
            <div className="grid grid-cols-3 gap-3">
              {(['pdf', 'excel', 'both'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    format === fmt
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {fmt === 'pdf' ? 'PDF' : fmt === 'excel' ? 'Excel' : 'Both'}
                </button>
              ))}
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2">
              Send to Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="report@company.com"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                errors.email ? 'border-red-500' : 'border-slate-300 focus:border-teal-600'
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              Leave empty to download immediately
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t-2 border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
