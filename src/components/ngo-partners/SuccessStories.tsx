import React from 'react';
import { TrendingUp, Users, Clock, Building2 } from 'lucide-react';

export function SuccessStories() {
  const stories = [
    {
      ngo: 'The Citizens Foundation',
      corporate: 'Lucky Cement',
      project: 'Digital Literacy Program for 1,000 Students',
      description: 'Equipped 5 TCF schools with computer labs and trained 1,200 students in digital skills over 6 months',
      outcomes: [
        { icon: <Users className="w-5 h-5" />, label: '500 Volunteers', value: '500' },
        { icon: <Clock className="w-5 h-5" />, label: 'Hours', value: '2,400' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Students', value: '1,200' }
      ],
      image: 'education'
    },
    {
      ngo: 'WWF Pakistan',
      corporate: 'Engro Corporation',
      project: 'Urban Forestation & Climate Action Initiative',
      description: 'Planted 15,000 trees across Karachi with corporate employee volunteers and students',
      outcomes: [
        { icon: <Users className="w-5 h-5" />, label: 'Volunteers', value: '800' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Trees', value: '15,000' },
        { icon: <Clock className="w-5 h-5" />, label: 'Survival Rate', value: '92%' }
      ],
      image: 'environment'
    },
    {
      ngo: 'Akhuwat Foundation',
      corporate: 'HBL',
      project: 'Women Entrepreneurship & Microfinance Program',
      description: 'Provided business skills training and microloans to 250 women entrepreneurs',
      outcomes: [
        { icon: <Users className="w-5 h-5" />, label: 'Women', value: '250' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Businesses', value: '180' },
        { icon: <Clock className="w-5 h-5" />, label: 'Income Rise', value: '+45%' }
      ],
      image: 'economic'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Success Stories & Case Studies
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real partnerships creating measurable impact across Pakistan
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 via-violet-100 to-cyan-100 flex items-center justify-center relative">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-slate-600 text-sm">Project Image</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Partners */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {story.ngo}
                  </span>
                  <span className="text-slate-400">×</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                    {story.corporate}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {story.project}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {story.description}
                </p>

                {/* Outcomes */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  {story.outcomes.map((outcome, oIndex) => (
                    <div key={oIndex} className="text-center">
                      <div className="flex justify-center mb-2 text-blue-600">
                        {outcome.icon}
                      </div>
                      <div className="text-slate-900 mb-1">{outcome.value}</div>
                      <div className="text-slate-500 text-xs">{outcome.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
