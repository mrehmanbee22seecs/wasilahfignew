import React from 'react';
import { Briefcase } from 'lucide-react';
import { OpportunityCard } from '../opportunities/OpportunityCard';

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

interface AvailableOpportunitiesSectionProps {
  opportunities: Opportunity[];
  onViewOpportunity: (opportunityId: string) => void;
  onApply: (opportunityId: string) => void;
}

export function AvailableOpportunitiesSection({ 
  opportunities, 
  onViewOpportunity, 
  onApply 
}: AvailableOpportunitiesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-slate-900">Open Volunteer Opportunities</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Current volunteering opportunities with this organization. All opportunities are 
          supervised and managed through Wasilah's platform.
        </p>

        {opportunities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onLearnMore={() => onViewOpportunity(opportunity.id)}
                onApply={() => onApply(opportunity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-slate-200">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">No Open Opportunities</h3>
            <p className="text-slate-600">
              This organization doesn't have any volunteer opportunities available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
