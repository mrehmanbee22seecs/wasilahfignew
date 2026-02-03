import React from 'react';
import { ArrowRight, Users, Clock, Building2, Sparkles } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function HeroSection() {
  return (
    <section 
      className="relative pt-32 pb-24 overflow-hidden"
      style={{ backgroundColor: BRAND.cream }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.navy} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>
      
      {/* Decorative Elements */}
      <div 
        className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: BRAND.teal }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: BRAND.navy }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 border"
              style={{ 
                backgroundColor: 'white',
                borderColor: BRAND.teal,
                color: BRAND.navy
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: BRAND.teal }} />
              <span className="font-medium text-sm">Pakistan's Premier CSR Platform</span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: BRAND.navy }}
            >
              Corporate Social Responsibility That Creates{' '}
              <span style={{ color: BRAND.teal }}>Real Impact</span>
            </h1>

            <p 
              className="text-lg mb-10 leading-relaxed max-w-xl"
              style={{ color: '#4B5563' }}
            >
              Wasilah connects companies with skilled student volunteers, NGOs, and meaningful 
              social projects — enabling high-value CSR activation with measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                style={{ backgroundColor: BRAND.navy }}
              >
                Explore CSR Solutions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
                style={{ 
                  borderColor: BRAND.navy,
                  color: BRAND.navy
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.navy;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = BRAND.navy;
                }}
              >
                Book a Consultation
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div 
                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${BRAND.teal}15` }}
                >
                  <Users className="w-5 h-5" style={{ color: BRAND.teal }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: BRAND.navy }}>5,240+</div>
                <div className="text-gray-500 text-sm">Volunteers Engaged</div>
              </div>
              <div 
                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${BRAND.navy}10` }}
                >
                  <Clock className="w-5 h-5" style={{ color: BRAND.navy }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: BRAND.navy }}>45,000+</div>
                <div className="text-gray-500 text-sm">CSR Hours Delivered</div>
              </div>
              <div 
                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${BRAND.teal}15` }}
                >
                  <Building2 className="w-5 h-5" style={{ color: BRAND.teal }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: BRAND.navy }}>180+</div>
                <div className="text-gray-500 text-sm">NGOs Supported</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)`
              }}
            >
              {/* Hero Visual */}
              <div className="aspect-[4/3] flex items-center justify-center p-10">
                <div className="text-center text-white">
                  <div 
                    className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/30"
                  >
                    <Users className="w-14 h-14 text-white" />
                  </div>
                  <p className="text-xl font-semibold mb-2">Corporate + Students + Community</p>
                  <p className="text-white/80">Building Pakistan's Future Together</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div 
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 hidden lg:block"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: BRAND.teal }}
                >
                  ✓
                </div>
                <div>
                  <div className="font-semibold" style={{ color: BRAND.navy }}>Impact Verified</div>
                  <div className="text-gray-500 text-sm">Measurable Results</div>
                </div>
              </div>
            </div>

            <div 
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 hidden lg:block"
            >
              <div className="text-gray-500 text-sm mb-1">Active Projects</div>
              <div className="text-3xl font-bold" style={{ color: BRAND.navy }}>48</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
