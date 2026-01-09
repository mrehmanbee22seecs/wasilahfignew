import React from 'react';
import { Heart, Shield, Leaf, TrendingUp } from 'lucide-react';

export function CSRActivityTypes() {
  const activityTypes = [
    {
      icon: <Heart className="w-10 h-10" />,
      title: 'Philanthropic CSR',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      activities: [
        'Donation drives for NGOs and communities',
        'Fundraising concerts and charity events',
        'Emergency relief and disaster response',
        'Support for healthcare and education'
      ]
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Ethical CSR',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      activities: [
        'Employee engagement and volunteering',
        'Values-driven corporate initiatives',
        'Fair labor practices and transparency',
        'Community stakeholder engagement'
      ]
    },
    {
      icon: <Leaf className="w-10 h-10" />,
      title: 'Environmental CSR',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      activities: [
        'Tree plantation and reforestation',
        'Community cleanup drives',
        'Recycling and waste management programs',
        'Climate action and sustainability'
      ]
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Economic CSR',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      activities: [
        'Skills training and capacity building',
        'Employment support for students',
        'Entrepreneurship mentorship programs',
        'Microfinance and small business support'
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            Four CSR Activity Types
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Comprehensive CSR solutions across all dimensions of corporate social responsibility
          </p>
        </div>

        {/* Activity Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activityTypes.map((type, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${type.bgColor} rounded-2xl p-8 border-2 ${type.borderColor} hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {type.icon}
              </div>

              {/* Title */}
              <h3 className="text-slate-900 mb-4">
                {type.title}
              </h3>

              {/* Activities List */}
              <ul className="space-y-3">
                {type.activities.map((activity, actIndex) => (
                  <li key={actIndex} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 max-w-3xl mx-auto">
            Our programs integrate multiple CSR types to create holistic impact that addresses social, 
            environmental, and economic development simultaneously.
          </p>
        </div>
      </div>
    </section>
  );
}
