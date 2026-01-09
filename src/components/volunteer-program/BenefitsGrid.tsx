import React from 'react';
import { Briefcase, TrendingUp, Award, Handshake, FileText, Users } from 'lucide-react';

export function BenefitsGrid() {
  const benefits = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Real Corporate Experience',
      points: [
        'Work directly with leading Pakistani companies',
        'Understand corporate CSR operations firsthand',
        'Gain insights into professional environments'
      ],
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Skill Development & Training',
      points: [
        'Pre-project training and capacity building',
        'Learn project management and teamwork',
        'Develop leadership and communication skills'
      ],
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Verified Certificates & Badges',
      points: [
        'Digital certificates for every completed project',
        'LinkedIn-ready achievement badges',
        'Skill verification for your CV and portfolio'
      ],
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100'
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'Work With Top NGOs',
      points: [
        'Partner with verified, impactful NGOs',
        'Contribute to real community development',
        'Learn from experienced social sector professionals'
      ],
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Build Your Portfolio',
      points: [
        'Document your CSR project contributions',
        'Showcase impact-driven work to employers',
        'Stand out in job applications and interviews'
      ],
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Earn Recommendations & Mentorship',
      points: [
        'Get recommendations from corporate partners',
        'Access to mentorship from industry professionals',
        'Networking opportunities with CSR leaders'
      ],
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Why Students Should Join
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Transform your university years into real-world impact while building a competitive edge for your career
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${benefit.bgGradient} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-slate-900 mb-4">
                {benefit.title}
              </h3>

              {/* Points */}
              <ul className="space-y-3">
                {benefit.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="text-teal-600 mt-1 flex-shrink-0">•</span>
                    <span>{point}</span>
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
