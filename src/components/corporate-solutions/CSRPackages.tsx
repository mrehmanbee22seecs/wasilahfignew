import React from 'react';
import { Check, Target, TrendingUp, Crown } from 'lucide-react';

export function CSRPackages() {
  const packages = [
    {
      icon: <Target className="w-8 h-8" />,
      name: 'Essential CSR Ops',
      subtitle: 'For Small CSR Teams',
      description: 'Foundation-level CSR operations support for focused initiatives',
      features: [
        'Basic NGO partnership matching',
        'Simple project reporting',
        'University volunteer mobilization',
        'Quarterly impact updates',
        'Email support',
        'SDG alignment consultation'
      ],
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      name: 'Growth CSR Ops',
      subtitle: 'For Mid-Size Operations',
      description: 'Comprehensive CSR management for growing corporate programs',
      features: [
        'Multi-event execution & coordination',
        'On-site field management',
        'Interactive impact dashboards',
        'Monthly reporting with analytics',
        'Dedicated account manager',
        'Volunteer training programs',
        'PR-ready content packages',
        'Multi-NGO partnerships'
      ],
      gradient: 'from-teal-500 to-emerald-600',
      bgGradient: 'from-teal-50 to-emerald-50',
      borderColor: 'border-teal-300',
      popular: true
    },
    {
      icon: <Crown className="w-8 h-8" />,
      name: 'Enterprise CSR Ops',
      subtitle: 'For Top Corporate Clients',
      description: 'Full-scale CSR operations with dedicated management and strategic oversight',
      features: [
        'Dedicated CSR operations manager',
        'Multi-city CSR execution',
        'Full reporting & compliance suite',
        'Annual CSR strategic roadmap',
        'Custom impact measurement framework',
        'Executive-level presentations',
        'Priority volunteer allocation',
        'Employee engagement programs',
        'Crisis response coordination',
        'Third-party audit support'
      ],
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-300'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            CSR Packages for Corporates
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Scalable solutions tailored to your organization's CSR maturity and impact goals
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${pkg.bgGradient} rounded-2xl p-8 border-2 ${pkg.borderColor} hover:shadow-2xl transition-all duration-300`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full text-sm shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${pkg.gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                {pkg.icon}
              </div>

              {/* Package Name */}
              <h3 className="text-slate-900 mb-2">
                {pkg.name}
              </h3>
              <div className="text-slate-600 mb-4">{pkg.subtitle}</div>
              
              {/* Description */}
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {pkg.description}
              </p>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* SDG Alignment */}
              <div className="pt-6 border-t border-slate-300">
                <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>SDG Alignment Included</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className={`w-full mt-6 py-3 bg-gradient-to-r ${pkg.gradient} text-white rounded-lg hover:shadow-lg transition-all`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">All packages include compliance support and transparent reporting</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            Request Custom Package
          </button>
        </div>
      </div>
    </section>
  );
}
