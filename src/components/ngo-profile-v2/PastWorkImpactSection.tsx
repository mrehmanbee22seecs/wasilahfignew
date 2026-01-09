import React from 'react';
import { BarChart3, Users, MapPin, FolderCheck, Image } from 'lucide-react';

interface PastWorkImpactSectionProps {
  impact: {
    projectsCompleted: string;
    beneficiaries: string;
    regionsServed: string;
    featuredProject?: {
      title: string;
      summary: string;
      image?: string;
    };
  };
}

export function PastWorkImpactSection({ impact }: PastWorkImpactSectionProps) {
  const stats = [
    {
      icon: <FolderCheck className="w-6 h-6" />,
      label: 'Projects Completed',
      value: impact.projectsCompleted,
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Beneficiaries Reached',
      value: impact.beneficiaries,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Regions Served',
      value: impact.regionsServed,
      color: 'from-violet-500 to-violet-600'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-slate-900">Past Work & Impact</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Track record and measurable outcomes from previous initiatives. 
          All figures are verified through documentation and third-party reporting.
        </p>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 p-6"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-slate-900 text-3xl mb-2">{stat.value}</div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Project (Optional) */}
        {impact.featuredProject && (
          <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Project Image */}
              <div className="md:col-span-1 bg-gradient-to-br from-slate-100 to-slate-200 min-h-[200px] flex items-center justify-center">
                {impact.featuredProject.image ? (
                  <img 
                    src={impact.featuredProject.image} 
                    alt={impact.featuredProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-16 h-16 text-slate-400" />
                )}
              </div>

              {/* Project Info */}
              <div className="md:col-span-2 p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm mb-4">
                  Featured Project
                </div>
                <h3 className="text-slate-900 mb-3">{impact.featuredProject.title}</h3>
                <p className="text-slate-700 leading-relaxed">
                  {impact.featuredProject.summary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
