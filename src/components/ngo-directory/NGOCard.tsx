import React from 'react';
import { MapPin, CheckCircle, ArrowRight, Building2 } from 'lucide-react';

interface NGOCardProps {
  ngo: {
    id: string;
    name: string;
    description: string;
    causes: string[];
    location: string;
    verified: boolean;
    size?: string;
  };
  onViewProfile?: (id: string) => void;
}

export function NGOCard({ ngo, onViewProfile }: NGOCardProps) {
  const causeColors: Record<string, string> = {
    'Education': 'bg-blue-100 text-blue-700',
    'Healthcare': 'bg-red-100 text-red-700',
    'Environment': 'bg-green-100 text-green-700',
    'Women Empowerment': 'bg-violet-100 text-violet-700',
    'Child Welfare': 'bg-pink-100 text-pink-700',
    'Human Rights': 'bg-amber-100 text-amber-700',
    'Poverty Alleviation': 'bg-teal-100 text-teal-700',
    'Disaster Relief': 'bg-orange-100 text-orange-700',
    'Economic Development': 'bg-emerald-100 text-emerald-700',
    'Animal Welfare': 'bg-cyan-100 text-cyan-700'
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
      {/* Logo & Verified Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        {ngo.verified && (
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3 fill-current" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* NGO Name */}
      <h3 className="text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {ngo.name}
      </h3>

      {/* Description */}
      <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">
        {ngo.description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
        <MapPin className="w-4 h-4" />
        <span>{ngo.location}</span>
      </div>

      {/* Cause Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ngo.causes.slice(0, 3).map((cause, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded text-xs ${causeColors[cause] || 'bg-slate-100 text-slate-600'}`}
          >
            {cause}
          </span>
        ))}
        {ngo.causes.length > 3 && (
          <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600">
            +{ngo.causes.length - 3} more
          </span>
        )}
      </div>

      {/* View Profile Button */}
      <button 
        onClick={() => {
          if (onViewProfile) {
            onViewProfile(ngo.id);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-blue-600 hover:text-white transition-all group-hover:gap-3"
      >
        View Profile
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}