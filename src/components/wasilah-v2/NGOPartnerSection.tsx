import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NGOPartnerSection() {
  const partners = [
    'The Citizens Foundation',
    'Akhuwat Foundation',
    'LRBT',
    'Indus Hospital',
    'Edhi Foundation',
    'SOS Children Villages',
    'WWF Pakistan',
    'CDA Foundation'
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">
            Trusted By NGOs Creating Real Impact
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We partner with Pakistan's most credible and impactful NGOs across health, education, environment, and community development
          </p>
        </div>

        {/* Partners Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center mb-3 border border-slate-200 group-hover:border-teal-300 transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-slate-400 text-xs">LOGO</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 text-center text-sm">{partner}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 border border-teal-200 rounded-full text-teal-700">
            <span>180+ Verified NGO Partners</span>
          </div>
        </div>
      </div>
    </section>
  );
}