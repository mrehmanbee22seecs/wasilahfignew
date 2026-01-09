import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, ArrowRight } from 'lucide-react';

interface ServiceBlockProps {
  title: string;
  summary: string;
  outcomes: string[];
  sdgs: number[];
  processSteps: string[];
  duration: string;
  costModel: string;
  deliverables: string[];
  caseStudyLink?: string;
  onRequestService: (serviceName: string) => void;
  isHighlighted?: boolean;
}

export function ServiceBlock({
  title,
  summary,
  outcomes,
  sdgs,
  processSteps,
  duration,
  costModel,
  deliverables,
  caseStudyLink,
  onRequestService,
  isHighlighted = false
}: ServiceBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sdgColors: Record<number, string> = {
    1: 'bg-red-500', 2: 'bg-yellow-500', 3: 'bg-green-500', 4: 'bg-red-600',
    5: 'bg-orange-500', 6: 'bg-cyan-500', 7: 'bg-yellow-400', 8: 'bg-red-700',
    9: 'bg-orange-600', 10: 'bg-pink-500', 11: 'bg-orange-400', 12: 'bg-yellow-600',
    13: 'bg-green-600', 14: 'bg-blue-500', 15: 'bg-green-700', 16: 'bg-blue-600',
    17: 'bg-blue-700'
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-200 ${
        isHighlighted 
          ? 'border-teal-600 shadow-lg ring-4 ring-teal-100' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Collapsed View */}
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{summary}</p>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            {sdgs.map(sdg => (
              <div
                key={sdg}
                className={`w-10 h-10 ${sdgColors[sdg]} rounded text-white flex items-center justify-center text-sm shadow-sm`}
                title={`SDG ${sdg}`}
              >
                {sdg}
              </div>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-2 mb-6">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{outcome}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => onRequestService(title)}
            data-analytics="solutions_request_service"
            data-service-name={title}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Request This
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            data-analytics="solutions_expand_service"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 transition-all"
          >
            {isExpanded ? 'Show Less' : 'See Details'}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-8 bg-slate-50 animate-in slide-in-from-top-2 duration-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Process Steps */}
            <div>
              <h4 className="text-slate-900 mb-4">Process</h4>
              <ol className="space-y-3">
                {processSteps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-slate-900 mb-2">Duration</h4>
                <p className="text-slate-700">{duration}</p>
              </div>

              <div>
                <h4 className="text-slate-900 mb-2">Cost Model</h4>
                <p className="text-slate-700">{costModel}</p>
              </div>

              <div>
                <h4 className="text-slate-900 mb-2">Sample Deliverables</h4>
                <ul className="space-y-2">
                  {deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span className="text-slate-700">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {caseStudyLink && (
                <div>
                  <a
                    href={caseStudyLink}
                    className="text-teal-600 hover:text-teal-700 flex items-center gap-2"
                    data-analytics="solutions_case_study_click"
                  >
                    View Case Study
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
