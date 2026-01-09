import React from 'react';
import { Briefcase, ShieldCheck, BarChart3, Users, TrendingUp, FileCheck } from 'lucide-react';

export function ValuePropositions() {
  const values = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Fully Outsourced CSR Operations',
      description: 'We execute everything: planning, logistics, volunteers, vendors, NGOs, and reporting. Your CSR runs seamlessly without burdening your internal teams.',
      gradient: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Verified NGOs & Risk-Free Partnerships',
      description: 'Every NGO is vetted through compliance, documentation, site checks, and SDG alignment. Zero risk, maximum transparency.',
      gradient: 'from-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Corporate-Grade Reporting',
      description: 'Impact dashboards, metrics, documentation packs, PR-ready content, and audit-compliant reports delivered on time, every time.',
      gradient: 'from-violet-600 to-violet-700',
      bgGradient: 'from-violet-50 to-violet-100'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Employee Engagement Programs',
      description: 'Volunteer matching, skill-based volunteering, corporate events, and university partnerships that activate your entire workforce.',
      gradient: 'from-teal-600 to-teal-700',
      bgGradient: 'from-teal-50 to-teal-100'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Scalable CSR Models',
      description: 'We run CSR campaigns across Education, Healthcare, Environment, Social Welfare, and Youth Development—tailored to your SDG goals.',
      gradient: 'from-amber-600 to-amber-700',
      bgGradient: 'from-amber-50 to-amber-100'
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Compliance, Transparency & Governance',
      description: 'Standardized processes, complete documentation, and third-party oversight ensure your CSR meets all regulatory and ESG requirements.',
      gradient: 'from-indigo-600 to-indigo-700',
      bgGradient: 'from-indigo-50 to-indigo-100'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Why Corporates Choose Wasilah
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Pakistan's first full-service CSR operations company, delivering measurable impact 
            with complete transparency and zero operational burden on your team
          </p>
        </div>

        {/* Value Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${value.bgGradient} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="text-slate-900 mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
