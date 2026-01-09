import React, { useState } from 'react';
import { X, MapPin, Calendar, Building2, FileDown, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CaseStudy } from '../../types/impact';
import { KPIStatTile } from './KPIStatTile';

interface CaseStudyDetailModalProps {
  caseStudy: CaseStudy;
  onClose: () => void;
  onDownloadReport: () => void;
  onViewSampleReport: () => void;
}

const SDG_COLORS: Record<number, string> = {
  3: 'bg-green-600',
  4: 'bg-red-600',
  5: 'bg-orange-600',
  6: 'bg-cyan-600',
  8: 'bg-rose-600',
  9: 'bg-amber-600',
  10: 'bg-pink-600',
  11: 'bg-yellow-600',
  13: 'bg-emerald-600',
  15: 'bg-lime-600',
};

export function CaseStudyDetailModal({
  caseStudy,
  onClose,
  onDownloadReport,
  onViewSampleReport,
}: CaseStudyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % caseStudy.media.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + caseStudy.media.length) % caseStudy.media.length);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-xl max-w-5xl w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-8 py-6 flex items-start justify-between rounded-t-xl z-10">
          <div className="flex-1 pr-8">
            <h2 className="text-slate-900 text-2xl md:text-3xl mb-2">
              {caseStudy.title}
            </h2>
            <div className="flex items-center gap-4 text-slate-600 text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{caseStudy.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{caseStudy.year} • {caseStudy.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{caseStudy.corporatePartner.name}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {/* SDGs */}
          <div>
            <h3 className="text-slate-900 text-sm uppercase tracking-wide mb-3">
              SDGs Addressed
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {caseStudy.sdgs.map((sdg) => (
                <span
                  key={sdg}
                  className={`${SDG_COLORS[sdg] || 'bg-slate-600'} text-white px-3 py-1 rounded`}
                  aria-label={`SDG ${sdg}`}
                >
                  SDG {sdg}
                </span>
              ))}
            </div>
          </div>

          {/* Primary KPIs */}
          <div>
            <h3 className="text-slate-900 text-lg mb-4">
              Key Performance Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseStudy.kpis.map((kpi, index) => (
                <KPIStatTile key={index} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Problem */}
          <div>
            <h3 className="text-slate-900 text-lg mb-3">
              Problem Statement
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {caseStudy.problem}
            </p>
          </div>

          {/* Approach */}
          <div>
            <h3 className="text-slate-900 text-lg mb-3">
              Our Approach
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {caseStudy.approach}
            </p>
            {caseStudy.ngoPartner && (
              <div className="mt-3 px-4 py-3 bg-teal-50 border border-teal-200 rounded-lg">
                <span className="text-teal-700 text-sm">
                  <strong>NGO Partner:</strong> {caseStudy.ngoPartner}
                </span>
              </div>
            )}
          </div>

          {/* Outcomes */}
          <div>
            <h3 className="text-slate-900 text-lg mb-3">
              Measured Outcomes
            </h3>
            <ul className="space-y-2">
              {caseStudy.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                  <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="flex-1 leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Media Gallery */}
          {caseStudy.media.length > 0 && (
            <div>
              <h3 className="text-slate-900 text-lg mb-4">
                Project Documentation
              </h3>
              
              {/* Main Image */}
              <div className="relative bg-slate-100 rounded-xl overflow-hidden mb-4">
                <img
                  src={caseStudy.media[currentImageIndex].url}
                  alt={caseStudy.media[currentImageIndex].caption}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation */}
                {caseStudy.media.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>
                  </>
                )}
                
                {/* Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {caseStudy.media.length}
                </div>
              </div>

              {/* Caption */}
              <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700 text-sm">
                  {caseStudy.media[currentImageIndex].caption}
                </p>
                {caseStudy.media[currentImageIndex].timestamp && (
                  <p className="text-slate-500 text-xs mt-1">
                    {caseStudy.media[currentImageIndex].timestamp}
                  </p>
                )}
              </div>

              {/* Thumbnails */}
              {caseStudy.media.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {caseStudy.media.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-teal-600 ring-2 ring-teal-200'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Report CTAs */}
          <div className="pt-6 border-t-2 border-slate-200">
            <h3 className="text-slate-900 text-lg mb-4">
              Impact Reporting
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onDownloadReport}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Download Impact Report
              </button>
              <button
                onClick={onViewSampleReport}
                className="px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                View Sample Report Structure
              </button>
            </div>
            <p className="text-slate-600 text-sm mt-3">
              All impact reports are verified by partner NGOs and include detailed methodology, limitations, and audit notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
