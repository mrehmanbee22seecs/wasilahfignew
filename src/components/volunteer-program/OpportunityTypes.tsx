import React from 'react';
import { TreePine, Lightbulb, Music, FileText } from 'lucide-react';

export function OpportunityTypes() {
  const types = [
    {
      icon: <TreePine className="w-10 h-10" />,
      title: 'On-Ground Volunteering',
      description: 'Physical participation in community-driven activities and events',
      examples: [
        'Tree plantation drives',
        'Community cleanup campaigns',
        'Health screening camps',
        'Educational workshops'
      ],
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: 'Skill-Based Volunteering',
      description: 'Apply your academic skills to support CSR projects remotely or on-site',
      examples: [
        'Graphic design & content creation',
        'Website development & IT support',
        'Social media management',
        'Data analysis & reporting'
      ],
      gradient: 'from-blue-500 to-violet-600',
      bgGradient: 'from-blue-50 to-violet-50'
    },
    {
      icon: <Music className="w-10 h-10" />,
      title: 'Corporate CSR Events',
      description: 'Support large-scale corporate engagement activities and fundraisers',
      examples: [
        'Fundraising concerts',
        'Qawali nights for charity',
        'Corporate donation drives',
        'CSR celebration events'
      ],
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: 'NGO Support Roles',
      description: 'Behind-the-scenes support helping NGOs execute impactful programs',
      examples: [
        'Project documentation',
        'Logistics coordination',
        'Training & facilitation',
        'Beneficiary surveys'
      ],
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Types of Volunteer Opportunities
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose from diverse volunteering options that match your skills, interests, and availability
          </p>
        </div>

        {/* Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {types.map((type, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${type.bgGradient} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {type.icon}
              </div>

              {/* Title */}
              <h3 className="text-slate-900 mb-3">
                {type.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {type.description}
              </p>

              {/* Examples */}
              <ul className="space-y-2">
                {type.examples.map((example, eIndex) => (
                  <li key={eIndex} className="flex items-start gap-2 text-slate-700 text-xs">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
