import React from 'react';
import { Users, TrendingUp, Heart, Zap, ArrowRight } from 'lucide-react';

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
    <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-4">
            Empowering Students.<br />Strengthening Communities.
          </h2>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg">
            Our student volunteer network transforms CSR initiatives into powerful learning experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white">Students Collaborating</p>
                  <p className="text-teal-100 text-sm mt-2">Volunteer Program Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
              <h3 className="text-white mb-6">
                Why Corporates Choose Our Volunteer Program
              </h3>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <div className="text-white mb-1">{benefit.title}</div>
                      <div className="text-teal-100 text-sm">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-all shadow-xl group">
              Become a Corporate Partner
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-white mb-2">5,240+</div>
            <div className="text-teal-100">Active Volunteers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-white mb-2">45 Cities</div>
            <div className="text-teal-100">Nationwide Coverage</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-white mb-2">89%</div>
            <div className="text-teal-100">Retention Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-white mb-2">4.8/5</div>
            <div className="text-teal-100">Corporate Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}