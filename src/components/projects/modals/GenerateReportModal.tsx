import React, { useState } from 'react';
import { X, FileText, Check, Image, Calendar, Loader, Mail } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onGenerate?: (title: string, type: string, emailOnReady: boolean) => void;
}

const TEMPLATES = [
  {
    id: 'short',
    title: 'Short Summary',
    description: '2-3 pages with key metrics and highlights',
    icon: FileText,
    pages: '2-3',
    includesMedia: false
  },
  {
    id: 'full',
    title: 'Full Report',
    description: 'Comprehensive report with charts, analysis, and recommendations',
    icon: FileText,
    pages: '8-12',
    includesMedia: true
  },
  {
    id: 'pr',
    title: 'PR Kit',
    description: 'Media-ready package with photos, quotes, and social media assets',
    icon: Image,
    pages: '5-7',
    includesMedia: true
  }
];

export function GenerateReportModal({ isOpen, onClose, projectId, onGenerate }: GenerateReportModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('full');
  const [includeMedia, setIncludeMedia] = useState(true);
  const [emailOnReady, setEmailOnReady] = useState(true);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    // If callback provided, use it (for polling)
    if (onGenerate) {
      onGenerate(template.title, template.title, emailOnReady);
      onClose();
      return;
    }

    // Otherwise, use old flow
    setIsGenerating(true);
    setGenerationStatus('generating');

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    setGenerationStatus('ready');
    setIsGenerating(false);

    // Auto close after showing success
    setTimeout(() => {
      setGenerationStatus('idle');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isGenerating) {
      setGenerationStatus('idle');
      setSelectedTemplate('full');
      setIncludeMedia(true);
      setEmailOnReady(true);
      setDateRange({ from: '', to: '' });
      onClose();
    }
  };

  const template = TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {generationStatus === 'idle' || generationStatus === 'generating' ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b-2 border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900">Generate Impact Report</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Choose a template and customize your report
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  disabled={isGenerating}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Select Report Template
                  </label>
                  <div className="grid gap-3">
                    {TEMPLATES.map(tmpl => {
                      const Icon = tmpl.icon;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => setSelectedTemplate(tmpl.id)}
                          disabled={isGenerating}
                          className={`flex items-start gap-4 p-4 text-left rounded-xl border-2 transition-all ${
                            selectedTemplate === tmpl.id
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-300'
                          } disabled:opacity-50`}
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedTemplate === tmpl.id
                              ? 'bg-teal-100'
                              : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              selectedTemplate === tmpl.id
                                ? 'text-teal-600'
                                : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm text-slate-900 mb-1">{tmpl.title}</h4>
                            <p className="text-xs text-slate-600 mb-2">{tmpl.description}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{tmpl.pages} pages</span>
                              {tmpl.includesMedia && (
                                <>
                                  <span>•</span>
                                  <span>Includes media</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedTemplate === tmpl.id
                              ? 'border-teal-600 bg-teal-600'
                              : 'border-slate-300'
                          }`}>
                            {selectedTemplate === tmpl.id && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Report Period (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="date-from" className="block text-xs text-slate-600 mb-1">
                        From
                      </label>
                      <input
                        id="date-from"
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        disabled={isGenerating}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="date-to" className="block text-xs text-slate-600 mb-1">
                        To
                      </label>
                      <input
                        id="date-to"
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        disabled={isGenerating}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-300 focus:outline-none text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Leave empty to include all project data
                  </p>
                </div>

                {/* Include Media Toggle */}
                {template?.includesMedia && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMedia}
                        onChange={(e) => setIncludeMedia(e.target.checked)}
                        disabled={isGenerating}
                        className="mt-0.5 w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-300"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-slate-900 block">
                          Include photos and media
                        </span>
                        <p className="text-xs text-slate-600 mt-1">
                          Adds project photos, videos, and documentation to the report (increases file size)
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Email on Ready Toggle */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailOnReady}
                      onChange={(e) => setEmailOnReady(e.target.checked)}
                      disabled={isGenerating}
                      className="mt-0.5 w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-300"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-slate-900 block">
                        Email report when ready
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        We will send the report to your email once it's ready
                      </p>
                    </div>
                  </label>
                </div>

                {/* Generation Status */}
                {generationStatus === 'generating' && (
                  <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
                    <Loader className="w-12 h-12 text-blue-600 mx-auto mb-3 animate-spin" />
                    <h4 className="text-sm text-blue-900 mb-1">Generating Report...</h4>
                    <p className="text-xs text-blue-700">
                      This may take a few moments. Please don't close this window.
                    </p>
                  </div>
                )}

                {/* Info */}
                {generationStatus === 'idle' && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800">
                      Report will be generated as a PDF and sent to your email. 
                      It will also be available in the Impact tab for download.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-slate-900 mb-2">Report Generated!</h3>
              <p className="text-sm text-slate-600 mb-4">
                Your impact report is ready for download
              </p>
              <div className="p-3 bg-slate-50 rounded-lg inline-block">
                <p className="text-xs text-slate-600">Check your email for the download link</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}