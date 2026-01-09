import React from 'react';
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';

export function BenefitCards() {
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Access to Corporate CSR Funding',
      description: 'Get matched with companies looking to support your cause through corporate-backed campaigns, events, and long-term programs.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Volunteer Support From Universities',
      description: 'Access 5,000+ verified student volunteers and skilled volunteers for design, tech, content creation, and on-ground support.',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Operational Assistance',
      description: 'Professional support for event planning, logistics, resource management, reporting templates, and monitoring systems.',
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Transparent Impact Reporting',
      description: 'Wasilah handles all corporate reporting requirements so you can focus entirely on project execution and community impact.',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Why NGOs Partner With Wasilah
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Unlock corporate partnerships, volunteer networks, and operational support to scale your impact
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${benefit.bgGradient} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-slate-900 mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
