import React from 'react';
import { MapPin, Calendar, Clock, ArrowRight, Building2 } from 'lucide-react';

export function FeaturedOpportunities() {
  const opportunities = [
    {
      title: 'Clean Water Awareness Campaign',
      corporate: 'Engro Corporation',
      ngo: 'Water.org Pakistan',
      duration: '3 weeks',
      dates: 'Jan 15 - Feb 5, 2025',
      location: 'Karachi',
      category: 'Environmental',
      categoryColor: 'bg-green-100 text-green-700',
      image: 'water'
    },
    {
      title: 'Digital Literacy Workshop',
      corporate: 'Systems Limited',
      ngo: 'The Citizens Foundation',
      duration: '2 months',
      dates: 'Feb 1 - Mar 31, 2025',
      location: 'Lahore',
      category: 'Education',
      categoryColor: 'bg-blue-100 text-blue-700',
      image: 'education'
    },
    {
      title: 'Tree Plantation Drive',
      corporate: 'Lucky Cement',
      ngo: 'WWF Pakistan',
      duration: '1 day',
      dates: 'Jan 20, 2025',
      location: 'Islamabad',
      category: 'Environmental',
      categoryColor: 'bg-green-100 text-green-700',
      image: 'tree'
    },
    {
      title: 'Women Empowerment Program',
      corporate: 'Unilever Pakistan',
      ngo: 'Akhuwat Foundation',
      duration: '6 weeks',
      dates: 'Feb 10 - Mar 22, 2025',
      location: 'Multan',
      category: 'Skill-based',
      categoryColor: 'bg-violet-100 text-violet-700',
      image: 'women'
    },
    {
      title: 'Community Health Screening',
      corporate: 'Fauji Foundation',
      ngo: 'LRBT',
      duration: '2 days',
      dates: 'Jan 25-26, 2025',
      location: 'Peshawar',
      category: 'Health',
      categoryColor: 'bg-red-100 text-red-700',
      image: 'health'
    },
    {
      title: 'Youth Mentorship Initiative',
      corporate: 'HBL',
      ngo: 'NUST Alumni',
      duration: '3 months',
      dates: 'Feb 1 - Apr 30, 2025',
      location: 'Rawalpindi',
      category: 'Skill-based',
      categoryColor: 'bg-violet-100 text-violet-700',
      image: 'mentorship'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <span>Open Opportunities</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Featured CSR Opportunities
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Browse active volunteer opportunities from leading corporates and verified NGOs
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opp, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-teal-100 via-emerald-100 to-cyan-100 flex items-center justify-center relative">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-slate-600 text-sm">Opportunity Image</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${opp.categoryColor}`}>
                    {opp.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {opp.title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {opp.corporate}
                  </span>
                  <span className="text-slate-400">×</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                    {opp.ngo}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span>{opp.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Duration: {opp.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    <span>{opp.location}</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all group-hover:gap-3">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all">
            View All Opportunities
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
