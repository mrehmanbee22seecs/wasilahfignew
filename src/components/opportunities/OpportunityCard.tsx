import React from 'react';
import { MapPin, Clock, Calendar, Users, ArrowRight, AlertCircle } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: {
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
  };
  onLearnMore: () => void;
  onApply: () => void;
}

export function OpportunityCard({ opportunity, onLearnMore, onApply }: OpportunityCardProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  // Calculate days until deadline
  const daysUntilDeadline = Math.ceil((new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilDeadline <= 7;
  const hasGoodTime = daysUntilDeadline > 14;

  const getOpportunityTypeColor = (type: string) => {
    switch (type) {
      case 'Remote':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'On-ground':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Hybrid':
        return 'bg-violet-100 text-violet-700 border-violet-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all group">
      {/* Top Section */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between mb-4">
          {/* NGO Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
              {opportunity.ngoLogo ? (
                <img src={opportunity.ngoLogo} alt={opportunity.ngoName} className="w-full h-full rounded-lg object-cover" />
              ) : (
                <span className="text-slate-600 text-sm">{opportunity.ngoName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="text-slate-900 text-sm mb-1">{opportunity.ngoName}</h4>
              <div className={`inline-flex px-2 py-1 rounded text-xs border ${getOpportunityTypeColor(opportunity.opportunityType)}`}>
                {opportunity.opportunityType}
              </div>
            </div>
          </div>

          {/* SDG Badges */}
          <div className="flex gap-1">
            {opportunity.sdgs.slice(0, 3).map((sdg) => (
              <div
                key={sdg}
                className={`w-7 h-7 ${sdgColors[sdg - 1]} rounded flex items-center justify-center text-white text-xs shadow-sm`}
                title={`SDG ${sdg}`}
              >
                {sdg}
              </div>
            ))}
            {opportunity.sdgs.length > 3 && (
              <div className="w-7 h-7 bg-slate-300 rounded flex items-center justify-center text-white text-xs">
                +{opportunity.sdgs.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
          {opportunity.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {opportunity.description}
        </p>

        {/* Skills Required */}
        <div className="mb-4">
          <div className="text-slate-500 text-xs mb-2">Skills Required</div>
          <div className="flex flex-wrap gap-2">
            {opportunity.skillsRequired.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {opportunity.skillsRequired.length > 3 && (
              <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs">
                +{opportunity.skillsRequired.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="p-6 border-b border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs mb-1">Location</div>
              <div className="text-slate-900 text-sm">{opportunity.location}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs mb-1">Duration</div>
              <div className="text-slate-900 text-sm">{opportunity.duration}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs mb-1">Commitment</div>
              <div className="text-slate-900 text-sm">{opportunity.commitment}</div>
            </div>
          </div>

          {opportunity.spotsAvailable && (
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-slate-500 text-xs mb-1">Spots Left</div>
                <div className="text-slate-900 text-sm">{opportunity.spotsAvailable}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6">
        {/* Deadline Indicator */}
        <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
          isUrgent ? 'bg-red-50 border border-red-200' :
          hasGoodTime ? 'bg-green-50 border border-green-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <AlertCircle className={`w-4 h-4 ${
            isUrgent ? 'text-red-600' :
            hasGoodTime ? 'text-green-600' :
            'text-yellow-600'
          }`} />
          <div className="flex-1">
            <div className={`text-sm ${
              isUrgent ? 'text-red-900' :
              hasGoodTime ? 'text-green-900' :
              'text-yellow-900'
            }`}>
              {isUrgent ? 'Urgent: ' : hasGoodTime ? '' : 'Moderate: '}
              {daysUntilDeadline} days until deadline
            </div>
            <div className="text-xs text-slate-600">
              Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onLearnMore}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
