import React from 'react';
import { Target, ShieldCheck, Users, Briefcase, Megaphone, BarChart3 } from 'lucide-react';

export function CSRServices() {
  const services = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'CSR Strategy & Planning',
      features: [
        'Annual CSR planning',
        'Budget allocation optimization',
        'SDG alignment mapping',
        'Multi-project roadmaps'
      ],
      color: 'blue'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'NGO Vetting & Partnership Management',
      features: [
        'Documentation review',
        'Financial screening',
        'Impact record evaluation',
        'Transparent matching'
      ],
      color: 'emerald'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Volunteer Mobilization',
      features: [
        'University student volunteers',
        'Skill-based volunteers',
        'Corporate employee volunteer days',
        'Team coordination'
      ],
      color: 'violet'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Event Execution & Field Activity Management',
      features: [
        'Medical camps & school engagements',
        'Green drives & donation drives',
        'Qawali nights & fundraising dinners',
        'End-to-end logistics'
      ],
      color: 'teal'
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: 'CSR Campaign Management',
      features: [
        'Awareness events',
        'Digital campaigns',
        'Long-term recurring programs',
        'Brand integration'
      ],
      color: 'amber'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Monitoring, Evaluation & Reporting',
      features: [
        'Photos, videos, attendance tracking',
        'Impact metrics & analytics',
        'PR-ready material',
        'Audit-compliant documents'
      ],
      color: 'indigo'
    }
  ];

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-600', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-600', border: 'border-emerald-200' },
    violet: { bg: 'bg-violet-50', icon: 'bg-violet-600', border: 'border-violet-200' },
    teal: { bg: 'bg-teal-50', icon: 'bg-teal-600', border: 'border-teal-200' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-600', border: 'border-amber-200' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-600', border: 'border-indigo-200' }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Our Services</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Overview of Our CSR Services
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Comprehensive CSR solutions designed for Pakistan's corporate landscape
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = colorMap[service.color];
            return (
              <div
                key={index}
                className={`${colors.bg} rounded-2xl p-8 border-2 ${colors.border} hover:shadow-xl transition-all duration-300`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-slate-900 mb-4">
                  {service.title}
                </h3>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-slate-700 text-sm">
                      <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
