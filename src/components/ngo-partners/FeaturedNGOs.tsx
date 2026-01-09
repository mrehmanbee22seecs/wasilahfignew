import React from 'react';
import { CheckCircle, ArrowRight, Building2 } from 'lucide-react';

export function FeaturedNGOs() {
  const ngos = [
    {
      name: 'The Citizens Foundation',
      description: 'Leading education-focused NGO providing quality schooling to underserved communities across Pakistan',
      sdgs: ['Education', 'Quality', 'Equality'],
      focus: 'Education',
      verified: true
    },
    {
      name: 'Akhuwat Foundation',
      description: 'Interest-free microfinance institution empowering economically disadvantaged communities',
      sdgs: ['Poverty', 'Economic', 'Growth'],
      focus: 'Economic Development',
      verified: true
    },
    {
      name: 'LRBT',
      description: 'Free eye care hospital network serving millions of patients annually',
      sdgs: ['Health', 'Well-being', 'Access'],
      focus: 'Healthcare',
      verified: true
    },
    {
      name: 'WWF Pakistan',
      description: 'Environmental conservation and climate action initiatives for sustainable future',
      sdgs: ['Climate', 'Environment', 'Life'],
      focus: 'Environment',
      verified: true
    },
    {
      name: 'Indus Hospital',
      description: 'Healthcare services network providing free medical treatment to underserved populations',
      sdgs: ['Health', 'Accessibility', 'Quality'],
      focus: 'Healthcare',
      verified: true
    },
    {
      name: 'SOS Children Villages',
      description: 'Child welfare organization providing family-based care and education support',
      sdgs: ['Children', 'Education', 'Welfare'],
      focus: 'Child Welfare',
      verified: true
    },
    {
      name: 'Edhi Foundation',
      description: 'Humanitarian services including healthcare, shelter, and emergency response',
      sdgs: ['Humanitarian', 'Emergency', 'Support'],
      focus: 'Humanitarian Aid',
      verified: true
    },
    {
      name: 'The Hunar Foundation',
      description: 'Skills training and vocational education for youth employment',
      sdgs: ['Skills', 'Employment', 'Youth'],
      focus: 'Skill Development',
      verified: true
    },
    {
      name: 'Shaukat Khanum',
      description: 'Cancer hospital providing world-class treatment to all patients',
      sdgs: ['Health', 'Cancer', 'Treatment'],
      focus: 'Healthcare',
      verified: true
    },
    {
      name: 'Mama Baby Fund',
      description: 'Maternal and child healthcare services in rural and urban communities',
      sdgs: ['Maternal', 'Child', 'Health'],
      focus: 'Healthcare',
      verified: true
    },
    {
      name: 'CDA Foundation',
      description: 'Community development and social welfare programs nationwide',
      sdgs: ['Community', 'Development', 'Welfare'],
      focus: 'Community Development',
      verified: true
    },
    {
      name: 'Read Foundation',
      description: 'Literacy and education programs for children in underserved areas',
      sdgs: ['Literacy', 'Education', 'Children'],
      focus: 'Education',
      verified: true
    }
  ];

  const focusColors: Record<string, string> = {
    'Education': 'bg-blue-100 text-blue-700',
    'Economic Development': 'bg-emerald-100 text-emerald-700',
    'Healthcare': 'bg-red-100 text-red-700',
    'Environment': 'bg-green-100 text-green-700',
    'Child Welfare': 'bg-violet-100 text-violet-700',
    'Humanitarian Aid': 'bg-amber-100 text-amber-700',
    'Skill Development': 'bg-teal-100 text-teal-700',
    'Community Development': 'bg-cyan-100 text-cyan-700'
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <CheckCircle className="w-4 h-4 fill-current" />
            <span>Verified Partners</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Featured NGO Partners
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Join Pakistan's most impactful NGOs in our verified network
          </p>
        </div>

        {/* NGOs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ngos.map((ngo, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Logo Placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>

              {/* NGO Name */}
              <h3 className="text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {ngo.name}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
                {ngo.description}
              </p>

              {/* Focus Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${focusColors[ngo.focus]}`}>
                  {ngo.focus}
                </span>
              </div>

              {/* SDG Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {ngo.sdgs.map((sdg, sIndex) => (
                  <span
                    key={sIndex}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                  >
                    {sdg}
                  </span>
                ))}
              </div>

              {/* Verified Badge & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {ngo.verified && (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs">
                    <CheckCircle className="w-4 h-4 fill-current" />
                    <span>Verified NGO</span>
                  </div>
                )}
                <button className="flex items-center gap-1 text-blue-600 text-sm hover:gap-2 transition-all">
                  <span>View Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full">
            <span className="text-blue-700">180+ Verified NGO Partners</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Across 12 Impact Areas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
