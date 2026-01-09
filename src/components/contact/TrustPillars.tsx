import React from 'react';
import { Shield, Target, FileCheck } from 'lucide-react';

export function TrustPillars() {
  const pillars = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Vetting',
      description: 'All NGO partners undergo legal, financial, and operational verification before they appear on our platform.',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Execution',
      description: 'We manage CSR projects end-to-end: planning, volunteer coordination, logistics, and on-ground delivery.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Audit-Ready',
      description: 'Comprehensive impact reporting with photos, metrics, and documentation that meets corporate compliance standards.',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">Why Work With Wasilah</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We're not a listing site. We're your CSR operations partner.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`${pillar.bgColor} rounded-xl p-8 border-2 border-slate-200 hover:border-teal-300 transition-all`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                {pillar.icon}
              </div>
              <h3 className="text-slate-900 mb-3">{pillar.title}</h3>
              <p className="text-slate-700 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
