import React from 'react';
import { Users, Activity, Handshake, Clock } from 'lucide-react';

export function ImpactShowcase() {
  const metrics = [
    {
      icon: <Users className="w-10 h-10" />,
      value: '5,240+',
      label: 'Student Volunteers',
      color: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Activity className="w-10 h-10" />,
      value: '200+',
      label: 'Corporate Activities Supported',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: <Handshake className="w-10 h-10" />,
      value: '180+',
      label: 'NGO Partnerships',
      color: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100'
    },
    {
      icon: <Clock className="w-10 h-10" />,
      value: '50,000+',
      label: 'Volunteer Hours Completed',
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Volunteer Impact Showcase
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Join thousands of students creating measurable change across Pakistan
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${metric.bgGradient} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-xl transition-all duration-300 text-center group`}
            >
              {/* Icon */}
              <div className={`w-20 h-20 bg-gradient-to-br ${metric.color} rounded-full flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {metric.icon}
              </div>

              {/* Value */}
              <div className="text-slate-900 mb-2 text-3xl">
                {metric.value}
              </div>

              {/* Label */}
              <div className="text-slate-600">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 max-w-3xl mx-auto">
            Every volunteer hour contributes to Pakistan's social development while building 
            your professional portfolio and network.
          </p>
        </div>
      </div>
    </section>
  );
}
