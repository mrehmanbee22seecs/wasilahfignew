import React from 'react';
import { ArrowRight, TrendingUp, Users, Target, Building2 } from 'lucide-react';

export function CaseStudies() {
  const cases = [
    {
      corporate: 'Lucky Cement',
      project: 'Employee Volunteer Day at SOS Village',
      ngo: 'SOS Children Villages Pakistan',
      description: 'Mobilized 150 Lucky Cement employees for a day of community engagement, infrastructure support, and mentorship at SOS Village.',
      metrics: [
        { icon: <Users className="w-5 h-5" />, label: 'Volunteers', value: '150' },
        { icon: <Target className="w-5 h-5" />, label: 'Children', value: '280' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Hours', value: '1,200' }
      ],
      sdgs: ['SDG 4', 'SDG 10', 'SDG 17'],
      impact: 'Enhanced learning environment, employee engagement score +35%'
    },
    {
      corporate: 'Engro Corporation',
      project: 'Clean Water Awareness & Infrastructure Campaign',
      ngo: 'Water.org Pakistan',
      description: 'Multi-city campaign educating 10,000+ families on water conservation with infrastructure improvements in 15 communities.',
      metrics: [
        { icon: <Users className="w-5 h-5" />, label: 'Families', value: '10,000' },
        { icon: <Target className="w-5 h-5" />, label: 'Communities', value: '15' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Water Saved', value: '2.5M L' }
      ],
      sdgs: ['SDG 6', 'SDG 13', 'SDG 11'],
      impact: 'Reduced water waste by 40%, improved access for 50,000 individuals'
    },
    {
      corporate: 'HBL',
      project: 'Women Entrepreneurship Training Program',
      ngo: 'Akhuwat Foundation',
      description: 'Six-month program providing business skills, mentorship, and microfinance to 250 women entrepreneurs across 5 cities.',
      metrics: [
        { icon: <Users className="w-5 h-5" />, label: 'Women', value: '250' },
        { icon: <Target className="w-5 h-5" />, label: 'Businesses', value: '180' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Income Rise', value: '+45%' }
      ],
      sdgs: ['SDG 5', 'SDG 8', 'SDG 1'],
      impact: '180 new businesses launched, 72% sustained after 12 months'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Example CSR Projects
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real corporate partnerships creating measurable impact across Pakistan
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 flex items-center justify-center relative">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-slate-600 text-sm">Project Image</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Corporate Logo Placeholder */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {caseStudy.corporate}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {caseStudy.project}
                </h3>

                {/* NGO Partner */}
                <div className="text-emerald-600 text-sm mb-4">
                  Partner: {caseStudy.ngo}
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {caseStudy.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
                  {caseStudy.metrics.map((metric, mIndex) => (
                    <div key={mIndex} className="text-center">
                      <div className="flex justify-center mb-1 text-blue-600">
                        {metric.icon}
                      </div>
                      <div className="text-slate-900 mb-0.5 text-sm">{metric.value}</div>
                      <div className="text-slate-500 text-xs">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* SDG Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseStudy.sdgs.map((sdg, sIndex) => (
                    <span
                      key={sIndex}
                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>

                {/* Impact */}
                <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                  <div className="text-emerald-700 text-xs mb-1">Impact Achieved</div>
                  <div className="text-slate-700 text-sm">{caseStudy.impact}</div>
                </div>

                {/* CTA */}
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group-hover:gap-3">
                  View Full Case Study
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
