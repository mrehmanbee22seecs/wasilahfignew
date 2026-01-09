import React from 'react';
import { DollarSign, Users, Handshake, Megaphone } from 'lucide-react';

export function CSRInitiativeTypes() {
  const initiatives = [
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: 'Corporate-Funded Projects',
      description: 'Direct funding from companies for specific initiatives aligned with their CSR goals',
      sdgs: ['SDG 1', 'SDG 4', 'SDG 8'],
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Volunteers for On-Ground Activities',
      description: 'Access to trained student volunteers for events, drives, and community engagement',
      sdgs: ['SDG 3', 'SDG 6', 'SDG 13'],
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50'
    },
    {
      icon: <Handshake className="w-10 h-10" />,
      title: 'Long-Term Partnerships With Companies',
      description: 'Multi-year engagements with corporates for sustained program support and growth',
      sdgs: ['SDG 17', 'SDG 11', 'SDG 16'],
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50'
    },
    {
      icon: <Megaphone className="w-10 h-10" />,
      title: 'Awareness Campaigns & CSR Events',
      description: 'Joint campaigns, fundraisers, and corporate events to amplify your cause',
      sdgs: ['SDG 5', 'SDG 10', 'SDG 12'],
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Types of CSR Initiatives NGOs Can Receive
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Diverse partnership opportunities to support your mission and expand your reach
          </p>
        </div>

        {/* Initiatives Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${initiative.bgGradient} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${initiative.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {initiative.icon}
              </div>

              {/* Title */}
              <h3 className="text-slate-900 mb-3">
                {initiative.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {initiative.description}
              </p>

              {/* SDG Badges */}
              <div className="flex flex-wrap gap-2">
                {initiative.sdgs.map((sdg, sIndex) => (
                  <span
                    key={sIndex}
                    className="px-2 py-1 bg-white border border-slate-300 text-slate-700 rounded text-xs"
                  >
                    {sdg}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
