import React from 'react';
import { MapPin, GraduationCap, Download, Share2, CheckCircle } from 'lucide-react';

interface VolunteerHeaderProps {
  volunteer: {
    name: string;
    role: string;
    location: string;
    education: string;
    verified: boolean;
    sdgs: number[];
    profileImage?: string;
  };
}

export function VolunteerHeader({ volunteer }: VolunteerHeaderProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-violet-50 to-teal-50 border-b-2 border-slate-200">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Profile Photo */}
        <div className="mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl border-4 border-white shadow-xl">
            {volunteer.profileImage ? (
              <img src={volunteer.profileImage} alt={volunteer.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{volunteer.name.charAt(0)}</span>
            )}
          </div>
          {volunteer.verified && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-full text-sm shadow-lg">
              <CheckCircle className="w-4 h-4" />
              Verified Volunteer
            </div>
          )}
        </div>

        {/* Name & Role */}
        <h1 className="text-slate-900 mb-2">
          {volunteer.name}
        </h1>
        <p className="text-slate-600 text-xl mb-6">
          {volunteer.role}
        </p>

        {/* Location & Education */}
        <div className="flex items-center justify-center gap-6 mb-6 text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>{volunteer.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-violet-600" />
            <span>{volunteer.education}</span>
          </div>
        </div>

        {/* SDG Badges */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <span className="text-slate-600 text-sm mr-2">Aligned with SDGs:</span>
          {volunteer.sdgs.map((sdg) => (
            <div
              key={sdg}
              className={`w-10 h-10 ${sdgColors[sdg - 1]} rounded-lg flex items-center justify-center text-white text-sm shadow-md`}
              title={`SDG ${sdg}`}
            >
              {sdg}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
            <Download className="w-5 h-5" />
            Download Resume
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all">
            <Share2 className="w-5 h-5" />
            Share Profile
          </button>
        </div>
      </div>
    </section>
  );
}
