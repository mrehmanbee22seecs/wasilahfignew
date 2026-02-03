import React from 'react';
import { Check, ArrowRight, Award } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function CSRServicesSection() {
  const tiers = [
    {
      name: 'Bronze',
      subtitle: 'Community Engagement',
      color: BRAND.teal,
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
      color: '#64748B',
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
      color: '#D97706',
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
      color: BRAND.navy,
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <Award className="w-4 h-4" />
            <span className="font-medium">CSR Solutions</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            Corporate CSR Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Flexible CSR partnership tiers designed to match your company's commitment level and impact goals
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 hover:shadow-2xl transition-all duration-300 group ${
                tier.popular ? 'ring-2 ring-offset-4 ring-[#2EC4B6]' : ''
              }`}
              style={{ 
                borderColor: `${tier.color}30`
              }}
            >
              {tier.popular && (
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-white rounded-full text-sm font-medium"
                  style={{ backgroundColor: BRAND.teal }}
                >
                  Most Popular
                </div>
              )}

              <div 
                className="inline-flex px-4 py-2 text-white rounded-xl mb-4 font-semibold"
                style={{ backgroundColor: tier.color }}
              >
                {tier.name}
              </div>

              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: BRAND.navy }}
              >
                {tier.subtitle}
              </h3>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-gray-600">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.teal }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300"
                style={{ 
                  borderColor: BRAND.navy,
                  color: BRAND.navy
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.navy;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = BRAND.navy;
                }}
              >
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
