import React from 'react';
import { MapPin, Clock, Users, ArrowRight, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  location: string;
  status: 'open' | 'limited' | 'closed';
}

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

export function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Open',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'limited':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Limited Seats',
          classes: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'closed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Closed',
          classes: 'bg-slate-50 text-slate-600 border-slate-200'
        };
      default:
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Open',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-slate-900">
            Volunteer Opportunities
          </h2>
          <span className="text-slate-600">
            {opportunities.filter(o => o.status === 'open').length} Active Opportunities
          </span>
        </div>

        {opportunities.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">No Active Opportunities</h3>
            <p className="text-slate-600">Check back soon for new volunteer opportunities</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => {
              const statusConfig = getStatusConfig(opportunity.status);
              
              return (
                <div
                  key={opportunity.id}
                  className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all group"
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${statusConfig.classes}`}>
                      {statusConfig.icon}
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {opportunity.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {opportunity.description}
                  </p>

                  {/* Skills Needed */}
                  <div className="mb-4">
                    <div className="text-slate-500 text-xs mb-2">Skills Needed</div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {opportunity.skills.length > 3 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs">
                          +{opportunity.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-500" />
                      <span>{opportunity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-500" />
                      <span>{opportunity.location}</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    disabled={opportunity.status === 'closed'}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      opportunity.status === 'closed'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg group-hover:gap-3'
                    }`}
                  >
                    {opportunity.status === 'closed' ? 'Closed' : 'Apply Now'}
                    {opportunity.status !== 'closed' && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
