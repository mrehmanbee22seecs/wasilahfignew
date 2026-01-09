import React, { useState, useEffect } from 'react';
import {
  X,
  FileDown,
  FileText,
  FileSpreadsheet,
  FileJson,
  Calendar,
  Filter,
  Settings,
  Mail,
  ChevronDown,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { ExportConfig, ExportFormat, ExportEntityType, DateRange } from './types';
import { reportTemplates, templatesByCategory } from './reportTemplates';
import { estimateFileSize, formatFileSize } from '../../utils/exportUtils';
import { toast } from 'sonner@2.0.3';

type ExportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig, jobName: string) => void;
  isExporting?: boolean;
  defaultEntityType?: ExportEntityType;
};

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  csv: <FileText className="w-5 h-5" />,
  excel: <FileSpreadsheet className="w-5 h-5" />,
  pdf: <FileText className="w-5 h-5" />,
  json: <FileJson className="w-5 h-5" />,
};

const formatLabels: Record<ExportFormat, string> = {
  csv: 'CSV',
  excel: 'Excel',
  pdf: 'PDF',
  json: 'JSON',
};

const entityTypeLabels: Record<ExportEntityType, string> = {
  projects: 'Projects',
  ngos: 'NGOs',
  volunteers: 'Volunteers',
  opportunities: 'Opportunities',
  payments: 'Payments',
  audit_logs: 'Audit Logs',
  cases: 'Cases',
  users: 'Users',
  custom: 'Custom',
};

// Available columns for each entity type
const columnOptions: Record<ExportEntityType, string[]> = {
  projects: ['id', 'title', 'ngo', 'status', 'budget', 'spent', 'startDate', 'endDate', 'beneficiaries', 'sdgs', 'category', 'impactScore'],
  ngos: ['id', 'name', 'category', 'status', 'founded', 'projectCount', 'volunteerCount', 'contact', 'impactScore'],
  volunteers: ['id', 'name', 'email', 'skills', 'totalHours', 'projectsCompleted', 'joinDate', 'lastActive'],
  opportunities: ['id', 'title', 'ngo', 'category', 'positions', 'applicants', 'location', 'duration', 'postedDate'],
  payments: ['id', 'project', 'ngo', 'amount', 'status', 'paymentDate', 'method', 'approvedBy', 'milestone'],
  audit_logs: ['timestamp', 'user', 'action', 'entity', 'entityId', 'changes', 'ipAddress'],
  cases: ['caseId', 'type', 'priority', 'status', 'assignee', 'createdDate', 'lastUpdate', 'escalated'],
  users: ['id', 'name', 'email', 'role', 'status', 'lastLogin', 'permissions'],
  custom: [],
};

const datePresets: Array<{ value: DateRange['preset']; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting = false,
  defaultEntityType = 'projects',
}: ExportModalProps) {
  const [step, setStep] = useState<'template' | 'configure'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Export configuration
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [entityType, setEntityType] = useState<ExportEntityType>(defaultEntityType);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState<DateRange['preset']>('last_30_days');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [jobName, setJobName] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');

  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Financial', 'Projects']);

  // Initialize with default columns when entity type changes
  useEffect(() => {
    const defaultColumns = columnOptions[entityType] || [];
    setSelectedColumns(defaultColumns.slice(0, 5)); // Select first 5 by default
  }, [entityType]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('template');
        setSelectedTemplate(null);
        setFormat('csv');
        setEntityType(defaultEntityType);
        setJobName('');
        setEmailDelivery(false);
        setEmailRecipients('');
        setShowAdvanced(false);
      }, 300);
    }
  }, [isOpen, defaultEntityType]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(columnOptions[entityType] || []);
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setFormat(template.format);
    setEntityType(template.entityType);
    setJobName(template.name);
    
    if (template.config.includeColumns) {
      setSelectedColumns(template.config.includeColumns);
    }
    if (template.config.includeMetadata !== undefined) {
      setIncludeMetadata(template.config.includeMetadata);
    }

    setStep('configure');
  };

  const handleCustomExport = () => {
    setSelectedTemplate(null);
    setStep('configure');
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }

    if (!jobName.trim()) {
      toast.error('Please enter a job name');
      return;
    }

    const dateRange: DateRange | undefined =
      datePreset === 'custom'
        ? {
            start: customDateStart,
            end: customDateEnd,
            preset: 'custom',
          }
        : datePreset
        ? {
            start: '', // Would calculate based on preset in production
            end: new Date().toISOString(),
            preset: datePreset,
          }
        : undefined;

    const config: ExportConfig = {
      format,
      entityType,
      includeColumns: selectedColumns,
      dateRange,
      includeMetadata,
    };

    onExport(config, jobName);
    onClose();
  };

  const estimatedSize = estimateFileSize(100, selectedColumns.length, format);
  const estimatedRows = 100; // Mock - would be calculated from actual data

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl my-8">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileDown className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-gray-900">
                  {step === 'template' ? 'Export Data' : 'Configure Export'}
                </h2>
                <p className="text-sm text-gray-500">
                  {step === 'template'
                    ? 'Choose a template or create custom export'
                    : 'Customize your export settings'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {step === 'template' ? (
              <div className="space-y-6">
                {/* Quick Export Button */}
                <div>
                  <button
                    onClick={handleCustomExport}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Create Custom Export</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or choose a template</span>
                  </div>
                </div>

                {/* Templates by Category */}
                <div className="space-y-4">
                  {Object.entries(templatesByCategory).map(([category, templates]) => (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <span className="text-gray-900">{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{templates.length} templates</span>
                          {expandedCategories.includes(category) ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Templates */}
                      {expandedCategories.includes(category) && (
                        <div className="p-4 space-y-2">
                          {templates.map((template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template.id)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                                  {template.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm text-gray-900">{template.name}</h4>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                      {formatLabels[template.format]}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">{template.description}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Job Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Export Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    placeholder="e.g., Q4 2025 Financial Report"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Export Format</label>
                  <div className="grid grid-cols-4 gap-3">
                    {(Object.keys(formatIcons) as ExportFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`px-4 py-3 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                          format === fmt
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={format === fmt ? 'text-blue-600' : 'text-gray-400'}>
                          {formatIcons[fmt]}
                        </div>
                        <span className="text-sm text-gray-900">{formatLabels[fmt]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entity Type */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Data Type</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as ExportEntityType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.keys(entityTypeLabels) as ExportEntityType[]).map((type) => (
                      <option key={type} value={type}>
                        {entityTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Column Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-700">
                      Select Columns <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={selectAllColumns}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={deselectAllColumns}
                        className="text-xs text-gray-600 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {columnOptions[entityType]?.map((column) => (
                        <label key={column} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedColumns.includes(column)}
                            onChange={() => toggleColumn(column)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{column}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedColumns.length} of {columnOptions[entityType]?.length || 0} columns selected
                  </p>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Date Range</label>
                  <select
                    value={datePreset}
                    onChange={(e) => setDatePreset(e.target.value as DateRange['preset'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {datePresets.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Date Range */}
                {datePreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={customDateStart}
                        onChange={(e) => setCustomDateStart(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={customDateEnd}
                        onChange={(e) => setCustomDateEnd(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Advanced Options */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Advanced Options</span>
                    {showAdvanced ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMetadata}
                          onChange={(e) => setIncludeMetadata(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Include metadata (export info, filters, etc.)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailDelivery}
                          onChange={(e) => setEmailDelivery(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Email delivery (coming soon)</span>
                      </label>

                      {emailDelivery && (
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Email Recipients</label>
                          <input
                            type="text"
                            value={emailRecipients}
                            onChange={(e) => setEmailRecipients(e.target.value)}
                            placeholder="email@example.com, email2@example.com"
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Export Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm text-blue-900">
                      <p className="mb-1">Export Summary:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Format: {formatLabels[format]}</li>
                        <li>• Data: {entityTypeLabels[entityType]}</li>
                        <li>• Columns: {selectedColumns.length}</li>
                        <li>• Estimated rows: ~{estimatedRows}</li>
                        <li>• Estimated size: ~{formatFileSize(estimatedSize)}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-xl">
            {step === 'configure' ? (
              <>
                <button
                  onClick={() => setStep('template')}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting || selectedColumns.length === 0 || !jobName.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>{isExporting ? 'Exporting...' : 'Export Now'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
