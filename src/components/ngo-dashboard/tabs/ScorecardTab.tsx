import React from 'react';
import { ScorecardViewer } from '../ScorecardViewer';
import type { NGOScorecard } from '../../../types/ngo';
import { toast } from 'sonner@2.0.3';

interface ScorecardTabProps {
  scorecard: NGOScorecard | undefined;
}

export function ScorecardTab({ scorecard }: ScorecardTabProps) {
  const handleRequestReview = () => {
    toast.success('Review request submitted');
    console.log('Request scorecard review');
  };

  if (!scorecard) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-slate-900 mb-2">No Scorecard Available</h3>
        <p className="text-slate-600 mb-6">
          Your scorecard will be generated after your verification request is processed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ScorecardViewer
        score={scorecard.overall_score}
        breakdown={scorecard.breakdown}
        lastUpdated={scorecard.last_updated}
        notes={scorecard.notes}
        onRequestReview={handleRequestReview}
      />
    </div>
  );
}
