import React from 'react';
import { Check, ArrowRight, Award } from 'lucide-react';

export function CSRServicesSection() {
  const tiers = [
    {
      name: 'Bronze',
      subtitle: 'Community Engagement',
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-200',
      features: [
        'Quarterly CSR activities',
        'Basic volunteer coordination',
        'Community outreach programs',
        'Impact summary reports'
      ]
    },
    {
      name: 'Silver',
      subtitle: 'Skill-Based Volunteering',
      color: 'from-slate-400 to-slate-500',
      borderColor: 'border-slate-200',
      features: [
        'Monthly CSR initiatives',
        'Skilled volunteer matching',
        'Employee engagement programs',
        'Detailed impact reports',
        'NGO partnership support'
      ]
    },
    {
      name: 'Gold',
      subtitle: 'Full CSR Activation & Reporting',
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-200',
      popular: true,
      features: [
        'Bi-weekly CSR projects',
        'Complete program management',
        'Multi-channel impact reports',
        'Strategic NGO partnerships',
        'Media & content production',
        'Employee volunteer training'
      ]
    },
    {
      name: 'Platinum',
      subtitle: 'Year-Round CSR Partnership',
      color: 'from-teal-600 to-blue-600',
      borderColor: 'border-teal-200',
      features: [
        'Continuous CSR operations',
        'Dedicated account manager',
        'Full-service impact reporting',
        'Strategic planning & advisory',
        'Premium NGO network access',
        'Custom content & storytelling',
        'Annual CSR summit participation'
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Award className="w-4 h-4" />
            <span>CSR Solutions</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Corporate CSR Services
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Flexible CSR partnership tiers designed to match your company's commitment level and impact goals
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl p-8 border-2 ${tier.borderColor} hover:shadow-2xl transition-all duration-300 group ${
                tier.popular ? 'ring-2 ring-teal-600 ring-offset-4' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full text-sm">
                  Most Popular
                </div>
              )}

              <div className={`inline-flex px-4 py-2 bg-gradient-to-r ${tier.color} text-white rounded-lg mb-4`}>
                {tier.name}
              </div>

              <h3 className="text-slate-900 mb-2">
                {tier.subtitle}
              </h3>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-slate-600">
                    <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all group-hover:bg-teal-50">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
