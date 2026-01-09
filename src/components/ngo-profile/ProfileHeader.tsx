import React from 'react';
import { MapPin, Calendar, Globe, CheckCircle, Mail, Phone } from 'lucide-react';

interface ProfileHeaderProps {
  ngo: {
    name: string;
    verified: boolean;
    causes: string[];
    location: string;
    yearFounded: number;
    website: string;
    shortDescription: string;
  };
}

export function ProfileHeader({ ngo }: ProfileHeaderProps) {
  const causeColors: Record<string, string> = {
    'Education': 'bg-blue-100 text-blue-700 border-blue-200',
    'Healthcare': 'bg-red-100 text-red-700 border-red-200',
    'Environment': 'bg-green-100 text-green-700 border-green-200',
    'Women Empowerment': 'bg-violet-100 text-violet-700 border-violet-200',
    'Child Welfare': 'bg-pink-100 text-pink-700 border-pink-200',
    'Human Rights': 'bg-amber-100 text-amber-700 border-amber-200',
    'Poverty Alleviation': 'bg-teal-100 text-teal-700 border-teal-200',
    'Economic Development': 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  return (
    <section className="pt-32 pb-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-lg">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left - Logo */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-violet-100 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <span className="text-4xl text-blue-600">🏛️</span>
              </div>
              {ngo.verified && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  <CheckCircle className="w-5 h-5 fill-current" />
                  <span>Verified NGO</span>
                </div>
              )}
            </div>

            {/* Right - Info */}
            <div className="lg:col-span-9">
              {/* Name & Tags */}
              <div className="mb-4">
                <h1 className="text-slate-900 mb-3">
                  {ngo.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {ngo.causes.map((cause, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-lg border ${causeColors[cause] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                    >
                      {cause}
                    </span>
                  ))}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                {ngo.shortDescription}
              </p>

              {/* Meta Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>{ngo.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span>Founded {ngo.yearFounded}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-5 h-5 text-violet-600" />
                  <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all">
                  View Volunteer Opportunities
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                  <Mail className="w-5 h-5" />
                  Contact NGO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
