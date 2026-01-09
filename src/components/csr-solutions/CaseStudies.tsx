import React from 'react';
import { ArrowRight, Building2, Heart, Target } from 'lucide-react';

export function CaseStudies() {
  const caseStudies = [
    {
      title: 'Clean Water Access Program',
      partner: 'Engro Corporation × Water.org',
      objective: 'Provide sustainable water filtration systems to 50 rural villages in Sindh',
      outcome: 'Installed 50 filtration units, serving 25,000+ people with clean drinking water daily',
      category: 'Health & Environment',
      image: 'case1'
    },
    {
      title: 'Digital Literacy Initiative',
      partner: 'Lucky Cement × The Citizens Foundation',
      objective: 'Train 1,000 students in computer skills and digital education',
      outcome: 'Certified 1,200 students, 85% employment rate in first 6 months post-training',
      category: 'Education',
      image: 'case2'
    },
    {
      title: 'Urban Tree Plantation Drive',
      partner: 'HBL × WWF Pakistan',
      objective: 'Plant 10,000 trees across Karachi to combat urban heat and pollution',
      outcome: 'Planted 12,500 trees with 92% survival rate, engaging 800 employee volunteers',
      category: 'Environment',
      image: 'case3'
    },
    {
      title: 'Women Entrepreneurship Program',
      partner: 'Unilever × Akhuwat Foundation',
      objective: 'Provide business skills training to 200 women in underserved communities',
      outcome: '180 women launched small businesses, average income increase of 45%',
      category: 'Economic Development',
      image: 'case4'
    },
    {
      title: 'Mobile Healthcare Camps',
      partner: 'Fauji Foundation × LRBT',
      objective: 'Deliver free eye care and general health screenings to remote areas',
      outcome: '5,000 patients screened, 800 surgeries performed, 15 rural camps conducted',
      category: 'Health',
      image: 'case5'
    },
    {
      title: 'Youth Mentorship Network',
      partner: 'Systems Limited × NUST',
      objective: 'Connect corporate professionals with university students for career guidance',
      outcome: '500 students mentored, 70% secured internships/jobs within 4 months',
      category: 'Education & Employment',
      image: 'case6'
    }
  ];

  const categoryColors: Record<string, string> = {
    'Health & Environment': 'bg-teal-100 text-teal-700',
    'Education': 'bg-blue-100 text-blue-700',
    'Environment': 'bg-green-100 text-green-700',
    'Economic Development': 'bg-violet-100 text-violet-700',
    'Health': 'bg-red-100 text-red-700',
    'Education & Employment': 'bg-indigo-100 text-indigo-700'
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Target className="w-4 h-4" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            CSR Case Studies
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real projects, real partnerships, real impact — see how Wasilah helps corporates achieve their CSR goals
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-teal-100 via-blue-100 to-violet-100 flex items-center justify-center relative">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm">Project Image</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${categoryColors[study.category]}`}>
                    {study.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {study.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-4 h-4 text-teal-600" />
                  <p className="text-slate-600 text-sm">{study.partner}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">OBJECTIVE</div>
                    <p className="text-slate-700 text-sm">{study.objective}</p>
                  </div>

                  <div>
                    <div className="text-slate-500 text-xs mb-1">OUTCOME</div>
                    <p className="text-slate-700 text-sm">{study.outcome}</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-teal-600 hover:gap-3 transition-all group-hover:text-teal-700">
                  <span className="text-sm">View Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all">
            View All Case Studies
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
