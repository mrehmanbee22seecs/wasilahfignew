import React from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Briefcase } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  ngoName: string;
  ngoLogo?: string;
  description: string;
  location: string;
  duration: string;
  commitment: string;
  skillsRequired: string[];
  sdgs: number[];
  deadline: string;
  opportunityType: string;
  spotsAvailable?: number;
  applicants?: number;
}

interface OpportunityGridProps {
  opportunities: Opportunity[];
  onLearnMore: (opportunityId: string) => void;
  onApply: (opportunityId: string) => void;
}

export function OpportunityGrid({ opportunities, onLearnMore, onApply }: OpportunityGridProps) {
  if (opportunities.length === 0) {
    return (
      <div className="col-span-full text-center py-24 bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-3">No opportunities found</h3>
          <p className="text-slate-600 mb-6">
            No opportunities match your search. Try adjusting filters or check again later.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onLearnMore={() => onLearnMore(opportunity.id)}
          onApply={() => onApply(opportunity.id)}
        />
      ))}
    </>
  );
}
