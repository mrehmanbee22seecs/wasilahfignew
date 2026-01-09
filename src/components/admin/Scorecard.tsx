import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';

/**
 * Scorecard Component
 * 
 * @description Display vetting scorecard with weighted sections and risk flags
 * @accessibility Tooltips on keyboard focus, proper ARIA labels
 * 
 * Score computation logic (backend should handle this):
 * - Each section has weight (%) and score (0-5)
 * - Weighted points = (score / 5) * weight
 * - Total score = sum of all weighted points
 * - Risk flags reduce total score
 */

export type ScoreSection = {
  id: string;
  label: string;
  weight: number; // percentage, e.g., 20
  score: number; // 0-5
  notes?: string;
  helpText?: string;
};

export type ScorecardProps = {
  totalScore: number; // 0-100 computed
  sections: ScoreSection[];
  riskFlags?: string[];
  className?: string;
};

export function Scorecard({ totalScore, sections, riskFlags = [], className = '' }: ScorecardProps) {
  const getOverallStatus = (): { label: string; color: string } => {
    if (totalScore >= 75) return { label: 'Approve', color: 'text-emerald-600 bg-emerald-50' };
    if (totalScore >= 50) return { label: 'Conditional', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Reject', color: 'text-red-600 bg-red-50' };
  };

  const status = getOverallStatus();

  const getScoreColor = (score: number): string => {
    if (score >= 4) return 'text-emerald-600';
    if (score >= 2.5) return 'text-amber-600';
    return 'text-red-600';
  };

  const computeWeightedPoints = (section: ScoreSection): number => {
    return (section.score / 5) * section.weight;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm text-gray-900">Vetting Scorecard</h3>
      </div>

      {/* Total Score */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-3xl text-gray-900 mb-1">
              {totalScore}
              <span className="text-lg text-gray-500"> / 100</span>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${status.color}`}>
              {status.label}
            </div>
          </div>
          
          {/* Visual Score Ring */}
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(totalScore / 100) * 201} 201`}
                className={
                  totalScore >= 75
                    ? 'text-emerald-600'
                    : totalScore >= 50
                    ? 'text-amber-600'
                    : 'text-red-600'
                }
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-900">
              {totalScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Score Sections */}
      <div className="p-4">
        <div className="space-y-3">
          {sections.map((section) => {
            const weightedPoints = computeWeightedPoints(section);
            return (
              <div
                key={section.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                role="article"
                aria-label={`${section.label}: ${section.score} out of 5, weight ${section.weight}%`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <h4 className="text-sm text-gray-900">{section.label}</h4>
                    {section.helpText && (
                      <div className="group relative">
                        <HelpCircle
                          className="w-3.5 h-3.5 text-gray-400 cursor-help"
                          aria-label="Help"
                        />
                        <div className="absolute left-full top-0 ml-2 w-48 bg-slate-900 text-white text-xs p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                          {section.helpText}
                        </div>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">({section.weight}%)</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getScoreColor(section.score)}`}>
                      {section.score.toFixed(1)} / 5
                    </div>
                    <div className="text-xs text-gray-500">{weightedPoints.toFixed(1)} pts</div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                      section.score >= 4
                        ? 'bg-emerald-500'
                        : section.score >= 2.5
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(section.score / 5) * 100}%` }}
                  />
                </div>

                {/* Notes */}
                {section.notes && (
                  <p className="text-xs text-gray-600 line-clamp-2">{section.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Flags */}
      {riskFlags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-red-900 mb-1">Risk Flags</h4>
                <ul className="text-xs text-red-700 space-y-1">
                  {riskFlags.map((flag, index) => (
                    <li key={index}>• {flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
