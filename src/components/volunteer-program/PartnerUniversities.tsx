import React from 'react';
import { GraduationCap } from 'lucide-react';

export function PartnerUniversities() {
  const universities = [
    'NUST',
    'LUMS',
    'IBA Karachi',
    'UET Lahore',
    'FAST',
    'Karachi University',
    'Punjab University',
    'GIKI',
    'Habib University',
    'Aga Khan University',
    'Bahria University',
    'COMSATS'
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>University Network</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Supported by Leading Universities
          </h2>
          <p className="text-slate-600">
            Partnering with top institutions across Pakistan to empower student volunteers
          </p>
        </div>

        {/* University Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {universities.map((university, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all group cursor-pointer flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                  <GraduationCap className="w-8 h-8 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <p className="text-slate-700 text-sm">{university}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-teal-200 rounded-full">
            <span className="text-teal-700">28 Partner Universities</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">45 Cities Covered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
