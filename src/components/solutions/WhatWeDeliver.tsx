import React from 'react';
import { Lightbulb, Target, FileCheck } from 'lucide-react';

export function WhatWeDeliver() {
  const usps = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Plan',
      summary: 'SDG-aligned CSR strategy mapped to your business goals',
      helpText: 'Skip months of committee meetings—we deliver executive-ready plans in 2 weeks',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Execute',
      summary: 'End-to-end project delivery with vetted NGO partners',
      helpText: 'We handle logistics, volunteer coordination, and on-ground operations',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Report',
      summary: 'Audit-ready documentation with photos, metrics, and compliance',
      helpText: 'Board presentations, ESG reports, and social media kits—all delivered',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">What We Deliver</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            A complete CSR operations layer for corporates who need execution, not just advice
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {usps.map((usp, index) => (
            <div
              key={index}
              className={`${usp.bgColor} rounded-xl p-8 border-2 border-slate-200 hover:border-teal-300 transition-all group`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${usp.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {usp.icon}
              </div>
              <h3 className="text-slate-900 mb-3">{usp.title}</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                {usp.summary}
              </p>
              <div className="pt-4 border-t border-slate-300">
                <p className="text-slate-600 text-sm italic">
                  How it helps: {usp.helpText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
