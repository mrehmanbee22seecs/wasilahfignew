import React from 'react';
import { Briefcase } from 'lucide-react';

interface OpportunityHeroProps {
  totalOpportunities: number;
}

export function OpportunityHero({ totalOpportunities }: OpportunityHeroProps) {
  return (
    <section className="pt-32 pb-12 bg-gradient-to-br from-blue-50 via-teal-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm mb-6">
            <Briefcase className="w-4 h-4" />
            {totalOpportunities}+ Active Opportunities
          </div>
          
          <h1 className="text-slate-900 mb-4">
            Volunteer Opportunities
          </h1>
          
          <p className="text-slate-600 text-lg leading-relaxed">
            Discover verified volunteering roles from trusted NGOs and organizations. 
            Make an impact while building skills and contributing to the UN Sustainable Development Goals.
          </p>
        </div>
      </div>
    </section>
  );
}
