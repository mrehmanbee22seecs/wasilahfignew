import React from 'react';
import { FileDown, BookOpen } from 'lucide-react';

interface ImpactHeroProps {
  onViewCaseStudies: () => void;
  onDownloadSample: () => void;
}

export function ImpactHero({ onViewCaseStudies, onDownloadSample }: ImpactHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50 py-20 md:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-teal-600 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl mb-6">
            Measurable Impact. Credible CSR.
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 text-lg md:text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
            From pilot programs to large-scale initiatives, Wasilah delivers transparent, 
            SDG-aligned outcomes with rigorous verification and comprehensive reporting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onViewCaseStudies}
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              View Case Studies
            </button>
            <button
              onClick={onDownloadSample}
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Download Sample Impact Report
            </button>
          </div>

          {/* SDG Icons Visualization */}
          <div className="mt-16 flex items-center justify-center gap-2 flex-wrap opacity-70">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded flex items-center justify-center text-white text-xs">
              SDG 4
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs">
              SDG 5
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded flex items-center justify-center text-white text-xs">
              SDG 8
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded flex items-center justify-center text-white text-xs">
              SDG 10
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center text-white text-xs">
              SDG 13
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
