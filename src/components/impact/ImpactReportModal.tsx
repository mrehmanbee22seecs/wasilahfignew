import React from 'react';
import { X, FileDown, FileText, BarChart3, Map, Target, TrendingUp, Search, CheckCircle, Image, Info } from 'lucide-react';
import { REPORT_PREVIEW_PAGES } from '../../data/mockImpactData';

interface ImpactReportModalProps {
  onClose: () => void;
  onDownload: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  BarChart3,
  Map,
  Target,
  TrendingUp,
  Search,
  CheckCircle,
  Image,
  Info,
};

export function ImpactReportModal({ onClose, onDownload }: ImpactReportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl animate-in zoom-in duration-300">
        {/* Header */}
        <div className="border-b-2 border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 text-2xl mb-1">
              Sample Impact Report
            </h2>
            <p className="text-slate-600 text-sm">
              Comprehensive, audit-ready documentation of project outcomes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 max-h-[600px] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg mb-2">
              Report Structure
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Each Wasilah impact report follows a standardized framework to ensure consistency, 
              transparency, and compliance with corporate CSR reporting requirements.
            </p>
          </div>

          {/* Report Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {REPORT_PREVIEW_PAGES.map((page, index) => {
              const Icon = ICON_MAP[page.icon];
              return (
                <div
                  key={index}
                  className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-teal-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900 mb-1">
                        {index + 1}. {page.title}
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {page.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Specs */}
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl mb-8">
            <h4 className="text-blue-900 mb-3">
              Technical Specifications
            </h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Format:</strong> PDF, A4 portrait, 300 DPI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Length:</strong> 15-25 pages (varies by project scale)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Charts:</strong> Vector graphics for clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Photos:</strong> 16:9 ratio, minimum 1600px wide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Verification:</strong> NGO partner sign-off on all KPIs</span>
              </li>
            </ul>
          </div>

          {/* Standards Compliance */}
          <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
            <h4 className="text-emerald-900 mb-3">
              Reporting Standards Compliance
            </h4>
            <div className="space-y-2 text-emerald-800 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Aligned with UN SDG Impact Standards</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>GRI (Global Reporting Initiative) compatible</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>SECP CSR reporting guidelines (Pakistan)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Third-party verification available on request</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-200 px-8 py-6 bg-slate-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">
              Download a sample report to see the full structure and methodology
            </p>
            <button
              onClick={onDownload}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Download Sample PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
