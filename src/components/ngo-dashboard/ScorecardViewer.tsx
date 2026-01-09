import React, { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, FileText, RefreshCw, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ScorecardViewerProps } from '../../types/ngo';

const SCORE_COLORS = {
  excellent: '#10b981', // emerald-500
  good: '#3b82f6', // blue-500
  fair: '#f59e0b', // amber-500
  poor: '#ef4444' // rose-500
};

export function ScorecardViewer({ score, breakdown, lastUpdated, notes, onRequestReview }: ScorecardViewerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const getScoreColor = (score: number) => {
    if (score >= 80) return SCORE_COLORS.excellent;
    if (score >= 60) return SCORE_COLORS.good;
    if (score >= 40) return SCORE_COLORS.fair;
    return SCORE_COLORS.poor;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const toggleCategory = (label: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Prepare data for pie chart
  const chartData = breakdown.map(cat => ({
    name: cat.label,
    value: cat.weight,
    score: cat.score
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border-2 border-slate-200">
          <p className="text-xs text-slate-900 font-medium">{data.name}</p>
          <p className="text-xs text-slate-600">Weight: {data.value}%</p>
          <p className="text-xs text-slate-600">Score: {data.score}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Score Display */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-indigo-100 mb-2">Overall Vetting Score</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl">{score}</span>
              <span className="text-2xl text-indigo-200">/100</span>
            </div>
            <p className="text-lg text-indigo-100 mt-2">{getScoreLabel(score)}</p>
            <p className="text-sm text-indigo-200 mt-3">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>

          {/* Donut Chart */}
          <div className="w-64 h-64 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getScoreColor(entry.score)}
                      opacity={0.9}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-6 pt-6 border-t-2 border-indigo-500/30">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-indigo-200 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-100">{notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900">Category Breakdown</h3>
          {onRequestReview && (
            <button
              onClick={onRequestReview}
              className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Request Review
            </button>
          )}
        </div>

        <div className="space-y-3">
          {breakdown.map((category, index) => {
            const isExpanded = expandedCategories.has(category.label);
            const categoryColor = getScoreColor(category.score);

            return (
              <div
                key={index}
                className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.label)}
                  className="w-full p-5 text-left hover:bg-slate-50 transition-colors"
                  aria-expanded={isExpanded}
                  aria-label={`${category.label} - score ${category.score}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-slate-900">{category.label}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                          {category.weight}% weight
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${category.score}%`,
                              backgroundColor: categoryColor
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-900 font-medium w-12 text-right">
                          {category.score}
                        </span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t-2 border-slate-100">
                    <h5 className="text-sm text-slate-700 mb-3">Details</h5>
                    <ul className="space-y-2">
                      {category.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-600">
                          <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Evidence Documents */}
                    {category.evidence_doc_ids && category.evidence_doc_ids.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-slate-100">
                        <h5 className="text-sm text-slate-700 mb-2">Evidence Documents</h5>
                        <div className="flex flex-wrap gap-2">
                          {category.evidence_doc_ids.map((docId, docIndex) => (
                            <button
                              key={docIndex}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors text-xs"
                              onClick={() => {
                                // Would open document preview
                                console.log('View document:', docId);
                              }}
                            >
                              <FileText className="w-3 h-3" />
                              <span>Document {docIndex + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h4 className="text-sm text-slate-700 mb-3">Score Guide</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCORE_COLORS.excellent }} />
            <span className="text-xs text-slate-600">80-100: Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCORE_COLORS.good }} />
            <span className="text-xs text-slate-600">60-79: Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCORE_COLORS.fair }} />
            <span className="text-xs text-slate-600">40-59: Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCORE_COLORS.poor }} />
            <span className="text-xs text-slate-600">0-39: Needs Work</span>
          </div>
        </div>
      </div>
    </div>
  );
}