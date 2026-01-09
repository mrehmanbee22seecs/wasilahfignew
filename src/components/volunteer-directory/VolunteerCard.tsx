import React from 'react';
import { MapPin, GraduationCap, Clock, CheckCircle, Star, Award } from 'lucide-react';

interface VolunteerCardProps {
  volunteer: {
    id: string;
    name: string;
    role: string;
    location: string;
    university: string;
    verified: boolean;
    sdgs: number[];
    totalHours: number;
    rating?: number;
    topSkills: string[];
    availability: string;
    profileImage?: string;
  };
  onClick: () => void;
}

export function VolunteerCard({ volunteer, onClick }: VolunteerCardProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Profile Photo */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xl border-2 border-white shadow-lg flex-shrink-0 relative">
          {volunteer.profileImage ? (
            <img src={volunteer.profileImage} alt={volunteer.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{volunteer.name.charAt(0)}</span>
          )}
          {volunteer.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
            {volunteer.name}
          </h3>
          <p className="text-slate-600 text-sm mb-2 line-clamp-1">
            {volunteer.role}
          </p>
          {volunteer.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-slate-700 text-sm">{volunteer.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Location & University */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="truncate">{volunteer.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <GraduationCap className="w-4 h-4 text-violet-600 flex-shrink-0" />
          <span className="truncate">{volunteer.university}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-slate-900 text-sm">{volunteer.totalHours}</div>
            <div className="text-slate-500 text-xs">Hours</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <div className="text-slate-900 text-sm">{volunteer.sdgs.length}</div>
            <div className="text-slate-500 text-xs">SDGs</div>
          </div>
        </div>
      </div>

      {/* Top Skills */}
      <div className="mb-4">
        <div className="text-slate-500 text-xs mb-2">Top Skills</div>
        <div className="flex flex-wrap gap-2">
          {volunteer.topSkills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200"
            >
              {skill}
            </span>
          ))}
          {volunteer.topSkills.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
              +{volunteer.topSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* SDG Badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-500 text-xs">SDG Focus:</span>
        <div className="flex gap-1 flex-wrap">
          {volunteer.sdgs.slice(0, 5).map((sdg) => (
            <div
              key={sdg}
              className={`w-6 h-6 ${sdgColors[sdg - 1]} rounded text-white text-xs flex items-center justify-center shadow-sm`}
              title={`SDG ${sdg}`}
            >
              {sdg}
            </div>
          ))}
          {volunteer.sdgs.length > 5 && (
            <div className="w-6 h-6 bg-slate-300 rounded text-white text-xs flex items-center justify-center">
              +{volunteer.sdgs.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs">Availability:</span>
        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
          {volunteer.availability}
        </span>
      </div>

      {/* CTA */}
      <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all group-hover:from-blue-700 group-hover:to-violet-700">
        View Full Profile
      </button>
    </div>
  );
}
