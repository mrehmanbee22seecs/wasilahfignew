import React from 'react';
import { Users, Clock, Building2, Globe } from 'lucide-react';

export function ImpactMetrics() {
  const metrics = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '5,240+',
      label: 'Volunteers Mobilized',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: '45,000+',
      label: 'CSR Hours Delivered',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      value: '180+',
      label: 'NGOs Supported',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: '250K+',
      label: 'Communities Impacted',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-4">
            Impact By The Numbers
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Real metrics from real CSR programs delivered across Pakistan
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {metric.icon}
              </div>

              {/* Value */}
              <div className="text-white mb-2 text-3xl">
                {metric.value}
              </div>

              {/* Label */}
              <div className="text-slate-300">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 max-w-3xl mx-auto">
            These numbers represent lives touched, communities strengthened, and lasting social 
            change created through strategic corporate-NGO-student partnerships.
          </p>
        </div>
      </div>
    </section>
  );
}
