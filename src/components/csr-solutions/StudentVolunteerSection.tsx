import React from 'react';
import { Users, DollarSign, Zap, Heart, ArrowRight } from 'lucide-react';

export function StudentVolunteerSection() {
  const advantages = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Reduce operational costs while increasing impact',
      description: 'Access skilled volunteers at a fraction of traditional CSR program costs'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'High-energy student teams for large-scale activities',
      description: 'Mobilize 50-500 volunteers for events, campaigns, and community projects'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Skilled volunteers matched with relevant CSR themes',
      description: 'Engineering, medical, business students aligned to your CSR initiatives'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Builds goodwill & supports student development',
      description: 'Create employer brand value while investing in future talent'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 via-blue-100 to-violet-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-teal-600" />
                  </div>
                  <p className="text-slate-700">Student Volunteer Workforce</p>
                  <p className="text-slate-500 text-sm mt-2">Image Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-teal-200 hidden lg:block">
              <div className="text-teal-600 text-sm mb-1">Active Volunteers</div>
              <div className="text-slate-900 text-2xl">5,240+</div>
            </div>

            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-blue-200 hidden lg:block">
              <div className="text-blue-600 text-sm mb-1">Universities</div>
              <div className="text-slate-900 text-2xl">28</div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-6">
              <Users className="w-4 h-4" />
              <span>Student Workforce</span>
            </div>

            <h2 className="text-slate-900 mb-6 leading-tight">
              Your CSR, Powered by the<br />
              <span className="text-teal-600">Largest Student Volunteer Workforce</span>
            </h2>

            <p className="text-slate-600 mb-8 leading-relaxed">
              Wasilah's network of 5,000+ trained student volunteers across Pakistan provides 
              corporates with unmatched execution capacity for CSR initiatives.
            </p>

            {/* Advantages */}
            <div className="space-y-6 mb-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                    {advantage.icon}
                  </div>
                  <div>
                    <div className="text-slate-900 mb-1">{advantage.title}</div>
                    <div className="text-slate-600 text-sm">{advantage.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all group">
              Partner with Student Volunteers
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
