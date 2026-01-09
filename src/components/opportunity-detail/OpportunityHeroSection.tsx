import React from 'react';
import { MapPin, Clock, Calendar, Monitor, Bookmark } from 'lucide-react';

interface OpportunityHeroSectionProps {
  opportunity: {
    title: string;
    ngoName: string;
    impactSummary: string;
    location: string;
    duration: string;
    commitment: string;
    opportunityType: string;
    sdgs: number[];
  };
  onApply: () => void;
  onSave: () => void;
}

export function OpportunityHeroSection({ opportunity, onApply, onSave }: OpportunityHeroSectionProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  const getOpportunityTypeIcon = (type: string) => {
    switch (type) {
      case 'Remote':
        return <Monitor className="w-4 h-4" />;
      case 'On-ground':
        return <MapPin className="w-4 h-4" />;
      case 'Hybrid':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getOpportunityTypeColor = (type: string) => {
    switch (type) {
      case 'Remote':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'On-ground':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hybrid':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-teal-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Primary Information */}
          <div className="lg:col-span-2">
            <h1 className="text-slate-900 mb-4">
              {opportunity.title}
            </h1>
            
            <button className="text-teal-600 hover:text-teal-700 mb-4 inline-flex items-center gap-2">
              <span className="text-lg">{opportunity.ngoName}</span>
              <span className="text-sm">→</span>
            </button>

            <p className="text-slate-700 text-lg leading-relaxed">
              {opportunity.impactSummary}
            </p>
          </div>

          {/* Right: Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 sticky top-24">
              {/* Quick Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Location</div>
                    <div className="text-slate-900">{opportunity.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Duration</div>
                    <div className="text-slate-900">{opportunity.duration}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Commitment</div>
                    <div className="text-slate-900">{opportunity.commitment}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    opportunity.opportunityType === 'Remote' ? 'bg-blue-100' :
                    opportunity.opportunityType === 'On-ground' ? 'bg-emerald-100' :
                    'bg-violet-100'
                  }`}>
                    {getOpportunityTypeIcon(opportunity.opportunityType)}
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Mode</div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm border ${getOpportunityTypeColor(opportunity.opportunityType)}`}>
                      {opportunity.opportunityType}
                    </div>
                  </div>
                </div>
              </div>

              {/* SDG Icons */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="text-slate-500 text-sm mb-3">SDG Alignment</div>
                <div className="flex gap-2 flex-wrap">
                  {opportunity.sdgs.map((sdg) => (
                    <div
                      key={sdg}
                      className={`w-10 h-10 ${sdgColors[sdg - 1]} rounded-lg flex items-center justify-center text-white text-sm shadow-sm`}
                      title={`SDG ${sdg}`}
                    >
                      {sdg}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onApply}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Apply Now
                </button>
                <button
                  onClick={onSave}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  <Bookmark className="w-4 h-4" />
                  Save Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
