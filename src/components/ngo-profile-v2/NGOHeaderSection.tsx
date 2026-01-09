import React from 'react';
import { Building2, CheckCircle, Calendar, MapPin, Target } from 'lucide-react';

interface NGOHeaderSectionProps {
  ngo: {
    name: string;
    logo?: string;
    missionOneLiner: string;
    verified: boolean;
    yearsActive: number;
    location: string;
    focusSectors: string[];
  };
}

export function NGOHeaderSection({ ngo }: NGOHeaderSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-teal-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: NGO Identity */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6 mb-6">
              {/* NGO Logo */}
              <div className="w-24 h-24 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                {ngo.logo ? (
                  <img src={ngo.logo} alt={ngo.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-slate-900 mb-3">
                  {ngo.name}
                </h1>
                <p className="text-slate-700 text-lg leading-relaxed">
                  {ngo.missionOneLiner}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Trust Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
              {/* Verification Badge */}
              {ngo.verified && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-6">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verified by Wasilah</span>
                </div>
              )}

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Years Active</div>
                    <div className="text-slate-900">{ngo.yearsActive}+ years</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Registered Location</div>
                    <div className="text-slate-900">{ngo.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Focus Sectors</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ngo.focusSectors.slice(0, 3).map((sector, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200"
                        >
                          {sector}
                        </span>
                      ))}
                      {ngo.focusSectors.length > 3 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-xs">
                          +{ngo.focusSectors.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Micro-copy */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-600 text-sm leading-relaxed">
                  This organization has been vetted for legal, financial, and operational credibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
