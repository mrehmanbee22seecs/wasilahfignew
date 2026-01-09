import React from 'react';
import { Clock, FolderCheck, Building2, Target } from 'lucide-react';

interface SummarySectionProps {
  bio: string;
  stats: {
    totalHours: number;
    opportunitiesCompleted: number;
    ngosHelped: number;
    sdgCategories: number;
  };
}

export function SummarySection({ bio, stats }: SummarySectionProps) {
  const statCards = [
    {
      icon: <Clock className="w-6 h-6" />,
      value: stats.totalHours,
      label: 'Total Hours',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: <FolderCheck className="w-6 h-6" />,
      value: stats.opportunitiesCompleted,
      label: 'Opportunities',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      value: stats.ngosHelped,
      label: 'NGOs Helped',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100'
    },
    {
      icon: <Target className="w-6 h-6" />,
      value: stats.sdgCategories,
      label: 'SDG Categories',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bio */}
          <div className="lg:col-span-1">
            <h2 className="text-slate-900 mb-4">About</h2>
            <p className="text-slate-600 leading-relaxed">
              {bio}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <h2 className="text-slate-900 mb-6">Impact Summary</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 border-2 border-slate-200 text-center`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-slate-900 text-2xl mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
