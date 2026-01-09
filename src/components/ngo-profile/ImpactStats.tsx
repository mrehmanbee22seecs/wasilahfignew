import React from 'react';
import { Users, FolderCheck, Calendar, MapPin } from 'lucide-react';

interface ImpactStatsProps {
  stats: {
    volunteersEngaged: number;
    projectsCompleted: number;
    yearsActive: number;
    regionsServed: number;
  };
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const statCards = [
    {
      icon: <Users className="w-8 h-8" />,
      value: stats.volunteersEngaged.toLocaleString(),
      label: 'Volunteers Engaged',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: <FolderCheck className="w-8 h-8" />,
      value: stats.projectsCompleted.toLocaleString(),
      label: 'Projects Completed',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: stats.yearsActive,
      label: 'Years Active',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: stats.regionsServed,
      label: 'Regions Served',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8 text-center">
          Impact Overview
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-xl transition-all text-center`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-slate-900 mb-2 text-3xl">
                {stat.value}
              </div>
              <div className="text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
