import React from 'react';
import { MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import type { CaseStudy } from '../../types/impact';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: () => void;
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

export function CaseStudyCard({ caseStudy, onClick }: CaseStudyCardProps) {
  return (
    <article
      className="group bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:shadow-xl hover:border-teal-300 transition-all cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View case study: ${caseStudy.title}`}
    >
      {/* Hero Image */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <img
          src={caseStudy.heroImage}
          alt={caseStudy.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {caseStudy.isPilot && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-violet-600 text-white text-xs rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Pilot Program
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-slate-900 text-lg mb-3 leading-tight group-hover:text-teal-600 transition-colors">
          {caseStudy.title}
        </h3>

        {/* KPI Snippet */}
        <div className="mb-4 px-4 py-3 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-teal-900 text-sm">
            <span className="text-teal-700 text-xs block mb-1">Key Impact</span>
            <span className="font-medium">{caseStudy.kpiSnippet}</span>
          </p>
        </div>

        {/* SDG Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {caseStudy.sdgs.map((sdg) => (
            <span
              key={sdg}
              className={`${SDG_COLORS[sdg] || 'bg-slate-600'} text-white text-xs px-2 py-1 rounded`}
              aria-label={`SDG ${sdg}`}
            >
              SDG {sdg}
            </span>
          ))}
        </div>

        {/* Location & Year */}
        <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{caseStudy.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{caseStudy.year}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
          <span className="text-teal-600 group-hover:text-teal-700 transition-colors flex items-center gap-2">
            View Case Study
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function CaseStudyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-6">
        <div className="h-6 bg-slate-200 rounded mb-3 w-3/4" />
        <div className="h-16 bg-slate-100 rounded-lg mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded" />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="pt-4 border-t-2 border-slate-100">
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
