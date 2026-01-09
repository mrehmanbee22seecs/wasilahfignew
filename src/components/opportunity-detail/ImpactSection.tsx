import React from 'react';
import { Target, Users, Calendar, TrendingUp } from 'lucide-react';

interface ImpactSectionProps {
  impact: {
    beneficiaries: string;
    outcomes: string[];
    volunteerContribution: string;
  };
}

export function ImpactSection({ impact }: ImpactSectionProps) {
  const impactStats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Beneficiaries',
      value: impact.beneficiaries,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Program Duration',
      value: '12 weeks',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Expected Outcome',
      value: 'High Impact',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-slate-900">Your Impact</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Your volunteer contribution will directly support meaningful outcomes for the community. 
          Here's how your time and skills will make a difference.
        </p>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 border-2 border-slate-200`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-slate-900 text-2xl mb-1">{stat.value}</div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Measurable Outcomes */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
          <h3 className="text-slate-900 mb-6">Measurable Outcomes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {impact.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600">✓</span>
                </div>
                <p className="text-slate-700">{outcome}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Contribution */}
        <div className="mt-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-200 p-6">
          <h3 className="text-slate-900 mb-3">How Your Contribution is Used</h3>
          <p className="text-slate-700 leading-relaxed">{impact.volunteerContribution}</p>
        </div>
      </div>
    </section>
  );
}
