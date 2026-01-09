import React from 'react';
import { Check, Star, ArrowRight, Award } from 'lucide-react';

export function CSRTieredPackages() {
  const packages = [
    {
      name: 'Bronze',
      subtitle: 'Community Engagement',
      icon: '🥉',
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-200',
      bgGradient: 'from-amber-50 to-orange-50',
      features: [
        'Quarterly CSR activities',
        'NGO partnership visits',
        'Community cleanup campaigns',
        'Awareness and outreach events',
        'Basic impact summary reports'
      ],
      cta: 'View Details',
      ctaStyle: 'border-2 border-slate-300 text-slate-700 hover:border-amber-600 hover:text-amber-600'
    },
    {
      name: 'Silver',
      subtitle: 'Skill-Based Volunteering',
      icon: '🥈',
      color: 'from-slate-400 to-slate-600',
      borderColor: 'border-slate-300',
      bgGradient: 'from-slate-50 to-gray-50',
      features: [
        'Monthly CSR initiatives',
        'Student talent pool utilization',
        'Corporate mentoring programs',
        'Educational workshops and training',
        'NGO partnership support',
        'Detailed impact reports'
      ],
      cta: 'Request Proposal',
      ctaStyle: 'border-2 border-slate-300 text-slate-700 hover:border-slate-600 hover:text-slate-600'
    },
    {
      name: 'Gold',
      subtitle: 'CSR Execution & Reporting',
      icon: '🥇',
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-300',
      bgGradient: 'from-yellow-50 to-amber-50',
      popular: true,
      features: [
        'Bi-weekly CSR project execution',
        'Full project management & coordination',
        'Multi-channel impact reporting',
        'Strategic NGO partnerships',
        'Professional media & content production',
        'Employee volunteer training programs',
        'Impact measurement dashboard'
      ],
      cta: 'Book Consultation',
      ctaStyle: 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white hover:shadow-xl'
    },
    {
      name: 'Platinum',
      subtitle: 'Annual CSR Partnership',
      icon: '💎',
      color: 'from-teal-600 to-blue-700',
      borderColor: 'border-teal-300',
      bgGradient: 'from-teal-50 to-blue-50',
      premium: true,
      features: [
        'Continuous year-round CSR operations',
        'Dedicated account manager',
        'Full-service impact reporting & analytics',
        'Strategic CSR planning & advisory',
        'Premium NGO network access',
        'Custom content & storytelling',
        'Annual CSR summit participation',
        'Executive stakeholder presentations',
        'Complete event management'
      ],
      cta: 'Schedule Strategy Call',
      ctaStyle: 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:shadow-xl'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Award className="w-4 h-4" />
            <span>Tiered Solutions</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            CSR Packages Tailored to Your Impact Goals
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Choose from structured CSR partnership tiers designed to scale with your corporate commitment and deliver measurable results
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${pkg.bgGradient} rounded-2xl p-8 border-2 ${pkg.borderColor} hover:shadow-2xl transition-all duration-300 group ${
                pkg.popular ? 'ring-4 ring-yellow-300 ring-offset-4' : ''
              } ${
                pkg.premium ? 'ring-4 ring-teal-300 ring-offset-4 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-full text-sm shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              {/* Premium Badge */}
              {pkg.premium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full text-sm shadow-lg flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Recommended
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-4">{pkg.icon}</div>

              {/* Package Name */}
              <div className={`inline-flex px-4 py-2 bg-gradient-to-r ${pkg.color} text-white rounded-lg mb-2`}>
                {pkg.name}
              </div>

              <h3 className="text-slate-900 mb-6">
                {pkg.subtitle}
              </h3>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-slate-600 text-sm">
                    <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${pkg.ctaStyle}`}>
                {pkg.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Solutions Note */}
        <div className="mt-12 text-center">
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8 max-w-2xl mx-auto">
            <h4 className="text-slate-900 mb-2">Need a Custom Solution?</h4>
            <p className="text-slate-600 mb-4">
              We design bespoke CSR programs tailored to your industry, values, and impact objectives.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all">
              Contact Our CSR Team
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
