import React from 'react';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';

interface FeaturedOpportunityBannerProps {
  opportunity: {
    id: string;
    title: string;
    ngoName: string;
    description: string;
    location: string;
    duration: string;
    sdgs: number[];
  };
  onApply: () => void;
}

export function FeaturedOpportunityBanner({ opportunity, onApply }: FeaturedOpportunityBannerProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  return (
    <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-violet-600 rounded-2xl p-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <Star className="w-4 h-4 fill-white" />
            <span className="text-sm">Featured Opportunity</span>
          </div>

          <div className="flex gap-2">
            {opportunity.sdgs.map((sdg) => (
              <div
                key={sdg}
                className={`w-8 h-8 ${sdgColors[sdg - 1]} rounded-lg flex items-center justify-center text-white text-sm shadow-lg`}
                title={`SDG ${sdg}`}
              >
                {sdg}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Content */}
          <div className="md:col-span-2">
            <div className="text-white/80 text-sm mb-2">{opportunity.ngoName}</div>
            <h2 className="text-white mb-4">{opportunity.title}</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              {opportunity.description}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white/80" />
                <span className="text-white/90">{opportunity.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white/80" />
                <span className="text-white/90">{opportunity.duration}</span>
              </div>
            </div>

            <button
              onClick={onApply}
              className="flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-lg hover:shadow-xl transition-all"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Visual Element */}
          <div className="hidden md:block">
            <div className="w-full aspect-square bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 fill-white" />
                </div>
                <div className="text-white text-sm">
                  Editor's Pick
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
