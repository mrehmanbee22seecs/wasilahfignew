import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingSnapshotProps {
  onRequestPricing: (model: string) => void;
}

export function PricingSnapshot({ onRequestPricing }: PricingSnapshotProps) {
  const models = [
    {
      name: 'Pilot',
      model: 'Fixed-Price',
      description: 'Perfect for first-time CSR projects or testing new initiatives',
      priceRange: 'PKR 50k – 200k',
      inclusions: [
        'Single project execution',
        'Pre-vetted NGO partner',
        'Impact report with photos',
        'Board presentation deck',
        '2-4 week delivery'
      ],
      highlight: false
    },
    {
      name: 'Project',
      model: 'Fee %',
      description: 'For mid-to-large CSR programs with defined budgets',
      priceRange: '8-12% of project budget',
      inclusions: [
        'Full project management',
        'NGO vetting and selection',
        'Volunteer coordination',
        'Real-time monitoring',
        'Comprehensive impact reporting',
        'ESG documentation'
      ],
      highlight: true
    },
    {
      name: 'Retainer',
      model: 'Monthly',
      description: 'Ongoing CSR operations and strategic advisory',
      priceRange: 'Custom (PKR 100k+/month)',
      inclusions: [
        'Dedicated CSR manager',
        'Quarterly strategy reviews',
        'Unlimited project execution',
        'Priority NGO vetting',
        'Annual impact assessment',
        'Board reporting support'
      ],
      highlight: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">Pricing & Engagement Models</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Flexible pricing to match your CSR maturity and budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 overflow-hidden transition-all ${
                model.highlight
                  ? 'border-teal-600 shadow-lg ring-4 ring-teal-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className={`p-6 ${
                model.highlight
                  ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white'
                  : 'bg-slate-50'
              }`}>
                {model.highlight && (
                  <div className="text-xs uppercase tracking-wide mb-2 text-white/80">
                    Most Popular
                  </div>
                )}
                <h3 className={model.highlight ? 'text-white' : 'text-slate-900'}>
                  {model.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  model.highlight ? 'text-white/90' : 'text-slate-600'
                }`}>
                  {model.model}
                </p>
                <div className={`text-2xl ${
                  model.highlight ? 'text-white' : 'text-slate-900'
                }`}>
                  {model.priceRange}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {model.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-slate-900 text-sm mb-3">Includes:</h4>
                  <ul className="space-y-3">
                    {model.inclusions.map((inclusion, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onRequestPricing(model.name)}
                  data-analytics="request_pricing"
                  data-pricing-model={model.name}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    model.highlight
                      ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-teal-600'
                  }`}
                >
                  Request Pricing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">
            All prices are indicative. Final pricing depends on project scope, timeline, and complexity.
          </p>
        </div>
      </div>
    </section>
  );
}
