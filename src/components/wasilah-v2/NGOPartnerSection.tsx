import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

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
    <section className="py-20 bg-white border-y" style={{ borderColor: `${BRAND.navy}10` }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="font-medium">Our Partners</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            Trusted By NGOs Creating Real Impact
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We partner with Pakistan's most credible and impactful NGOs across health, education, environment, and community development
          </p>
        </div>

        {/* Partners Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <button 
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: `${BRAND.navy}08` }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${BRAND.teal}20`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${BRAND.navy}08`}
            >
              <ChevronLeft className="w-6 h-6" style={{ color: BRAND.navy }} />
            </button>
            <button 
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: `${BRAND.navy}08` }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${BRAND.teal}20`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${BRAND.navy}08`}
            >
              <ChevronRight className="w-6 h-6" style={{ color: BRAND.navy }} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="rounded-2xl p-8 border hover:shadow-xl transition-all group cursor-pointer"
                style={{ 
                  backgroundColor: BRAND.cream,
                  borderColor: `${BRAND.navy}10`
                }}
              >
                <div 
                  className="aspect-square bg-white rounded-xl flex items-center justify-center mb-3 border transition-all group-hover:shadow-md"
                  style={{ borderColor: `${BRAND.navy}10` }}
                >
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${BRAND.navy}08` }}
                    >
                      <span className="text-xs font-medium" style={{ color: BRAND.navy }}>LOGO</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm font-medium" style={{ color: BRAND.navy }}>{partner}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span>180+ Verified NGO Partners</span>
          </div>
        </div>
      </div>
    </section>
  );
}