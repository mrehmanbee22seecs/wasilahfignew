import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbNavProps {
  opportunityTitle: string;
  onBack: () => void;
}

export function BreadcrumbNav({ opportunityTitle, onBack }: BreadcrumbNavProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600 hover:text-teal-600 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 hover:text-teal-600 cursor-pointer">Volunteer Opportunities</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 truncate max-w-md">{opportunityTitle}</span>
        </div>
      </div>
    </div>
  );
}
