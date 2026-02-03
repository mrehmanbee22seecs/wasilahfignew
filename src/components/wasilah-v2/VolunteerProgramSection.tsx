import React from 'react';
import { Users, TrendingUp, Heart, Zap, ArrowRight } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  navyLight: '#2A3F6E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function VolunteerProgramSection() {
  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Increased CSR capacity',
      description: 'Scale your impact without scaling your team'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Cost-effective manpower',
      description: 'Access skilled volunteers at fraction of cost'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'High brand goodwill',
      description: 'Build reputation through authentic impact'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Gen-Z engagement',
      description: 'Connect with next generation of talent'
    }
  ];

  return (
    <section 
      className="py-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 50%, ${BRAND.teal} 100%)`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: BRAND.teal }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Empowering Students.<br />Strengthening Communities.
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Our student volunteer network transforms CSR initiatives into powerful learning experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center border border-white/30">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white text-lg font-semibold">Students Collaborating</p>
                  <p className="text-white/70 text-sm mt-2">Volunteer Program Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8">
              <h3 className="text-white text-xl font-semibold mb-6">
                Why Corporates Choose Our Volunteer Program
              </h3>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: `${BRAND.teal}40` }}
                    >
                      {benefit.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium mb-1">{benefit.title}</div>
                      <div className="text-white/70 text-sm">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl hover:shadow-2xl transition-all group font-semibold"
              style={{ color: BRAND.navy }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND.cream;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Become a Corporate Partner
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {[
            { value: '5,240+', label: 'Active Volunteers' },
            { value: '45 Cities', label: 'Nationwide Coverage' },
            { value: '89%', label: 'Retention Rate' },
            { value: '4.8/5', label: 'Corporate Rating' },
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-white text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}