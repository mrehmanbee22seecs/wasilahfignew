import React from 'react';
import { Building2, Users, Calendar, Heart, MapPin } from 'lucide-react';

export function NetworkMetrics() {
  const metrics = [
    {
      icon: <Building2 className="w-10 h-10" />,
      value: '180+',
      label: 'Verified NGO Partners',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: <Users className="w-10 h-10" />,
      value: '5,240+',
      label: 'University Volunteers',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      value: '240+',
      label: 'Corporate Events Executed',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100'
    },
    {
      icon: <Heart className="w-10 h-10" />,
      value: '300,000+',
      label: 'Lives Impacted',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      value: '28',
      label: 'Cities Across Pakistan',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100'
    }
  ];

  const sdgs = [
    { number: '1', name: 'No Poverty', color: 'bg-red-600' },
    { number: '3', name: 'Good Health', color: 'bg-green-600' },
    { number: '4', name: 'Quality Education', color: 'bg-red-700' },
    { number: '5', name: 'Gender Equality', color: 'bg-orange-600' },
    { number: '8', name: 'Decent Work', color: 'bg-pink-700' },
    { number: '10', name: 'Reduced Inequalities', color: 'bg-pink-600' },
    { number: '11', name: 'Sustainable Cities', color: 'bg-orange-500' },
    { number: '13', name: 'Climate Action', color: 'bg-green-700' },
    { number: '17', name: 'Partnerships', color: 'bg-blue-900' }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Our Network & Impact Reach
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Pakistan's largest CSR operations network connecting corporations, NGOs, and volunteers
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${metric.bgColor} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-xl transition-all text-center`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                {metric.icon}
              </div>

              {/* Value */}
              <div className="text-slate-900 mb-2 text-2xl">
                {metric.value}
              </div>

              {/* Label */}
              <div className="text-slate-600 text-sm">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* SDG Alignment Section */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-slate-900 mb-3">
              UN SDG Alignment
            </h3>
            <p className="text-slate-600">
              Our CSR programs actively contribute to achieving these Sustainable Development Goals
            </p>
          </div>

          {/* SDG Icons */}
          <div className="flex flex-wrap justify-center gap-4">
            {sdgs.map((sdg, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                title={sdg.name}
              >
                <div className={`w-20 h-20 ${sdg.color} rounded-lg flex flex-col items-center justify-center text-white shadow-md hover:shadow-xl transition-all hover:scale-105`}>
                  <div className="text-2xl">{sdg.number}</div>
                  <div className="text-xs mt-1">SDG</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-6 border border-blue-200 text-center">
            <div className="text-blue-700 mb-2">12 Impact Areas</div>
            <div className="text-slate-600 text-sm">Education, Health, Environment, and more</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200 text-center">
            <div className="text-teal-700 mb-2">100% Verified</div>
            <div className="text-slate-600 text-sm">All NGOs undergo rigorous screening</div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 text-center">
            <div className="text-violet-700 mb-2">Real-Time Tracking</div>
            <div className="text-slate-600 text-sm">Monitor every CSR activity as it happens</div>
          </div>
        </div>
      </div>
    </section>
  );
}
