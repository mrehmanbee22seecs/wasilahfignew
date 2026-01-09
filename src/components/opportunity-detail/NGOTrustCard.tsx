import React from 'react';
import { Building2, CheckCircle, ArrowRight, Calendar, MapPin } from 'lucide-react';

interface NGOTrustCardProps {
  ngo: {
    name: string;
    logo?: string;
    description: string;
    yearsActive: number;
    focusAreas: string[];
    verified: boolean;
  };
  onViewProfile: () => void;
}

export function NGOTrustCard({ ngo, onViewProfile }: NGOTrustCardProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">About the NGO</h2>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 p-8">
          <div className="flex items-start gap-6 mb-6">
            {/* NGO Logo */}
            <div className="w-20 h-20 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              {ngo.logo ? (
                <img src={ngo.logo} alt={ngo.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-slate-400" />
              )}
            </div>

            {/* NGO Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-slate-900">{ngo.name}</h3>
                {ngo.verified && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </div>
                )}
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-4">
                {ngo.description}
              </p>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{ngo.yearsActive}+ years active</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="mb-4">
                <div className="text-slate-500 text-sm mb-2">Focus Areas</div>
                <div className="flex flex-wrap gap-2">
                  {ngo.focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white text-slate-700 rounded-full text-sm border border-slate-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-slate-900 text-sm mb-1">Vetted by Wasilah</h4>
                <p className="text-slate-600 text-sm">
                  This NGO has passed Wasilah's verification and compliance checks, ensuring legitimacy, 
                  financial transparency, and adherence to ethical standards.
                </p>
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <button
            onClick={onViewProfile}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            View NGO Profile
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
