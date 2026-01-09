import React from 'react';
import { 
  Heart, Utensils, HeartPulse, GraduationCap, Users, Droplet,
  Zap, TrendingUp, Building2, Lightbulb, Home, Recycle,
  CloudRain, Fish, Leaf, Scale, Globe
} from 'lucide-react';

export function SDGAlignment() {
  const sdgs = [
    { 
      number: 1, 
      icon: <Heart className="w-6 h-6" />, 
      title: 'No Poverty',
      color: 'bg-red-500',
      contribution: 'Economic support programs and skills training for underserved communities'
    },
    { 
      number: 2, 
      icon: <Utensils className="w-6 h-6" />, 
      title: 'Zero Hunger',
      color: 'bg-yellow-600',
      contribution: 'Food donation drives and community feeding programs through NGO partnerships'
    },
    { 
      number: 3, 
      icon: <HeartPulse className="w-6 h-6" />, 
      title: 'Good Health',
      color: 'bg-green-500',
      contribution: 'Health screening camps and medical outreach initiatives'
    },
    { 
      number: 4, 
      icon: <GraduationCap className="w-6 h-6" />, 
      title: 'Quality Education',
      color: 'bg-red-600',
      contribution: 'Digital literacy programs and educational workshops for students'
    },
    { 
      number: 5, 
      icon: <Users className="w-6 h-6" />, 
      title: 'Gender Equality',
      color: 'bg-orange-500',
      contribution: 'Women empowerment workshops and equal opportunity initiatives'
    },
    { 
      number: 6, 
      icon: <Droplet className="w-6 h-6" />, 
      title: 'Clean Water',
      color: 'bg-cyan-500',
      contribution: 'Water filtration projects and clean water access programs'
    },
    { 
      number: 7, 
      icon: <Zap className="w-6 h-6" />, 
      title: 'Clean Energy',
      color: 'bg-yellow-500',
      contribution: 'Renewable energy awareness and solar panel installation projects'
    },
    { 
      number: 8, 
      icon: <TrendingUp className="w-6 h-6" />, 
      title: 'Economic Growth',
      color: 'bg-pink-600',
      contribution: 'Entrepreneurship mentorship and job skills development'
    },
    { 
      number: 11, 
      icon: <Home className="w-6 h-6" />, 
      title: 'Sustainable Cities',
      color: 'bg-yellow-600',
      contribution: 'Urban cleanup drives and community infrastructure projects'
    },
    { 
      number: 13, 
      icon: <CloudRain className="w-6 h-6" />, 
      title: 'Climate Action',
      color: 'bg-green-600',
      contribution: 'Tree plantation drives and environmental awareness campaigns'
    },
    { 
      number: 15, 
      icon: <Leaf className="w-6 h-6" />, 
      title: 'Life on Land',
      color: 'bg-green-500',
      contribution: 'Biodiversity protection and green space development'
    },
    { 
      number: 17, 
      icon: <Globe className="w-6 h-6" />, 
      title: 'Partnerships',
      color: 'bg-blue-700',
      contribution: 'Cross-sector collaboration between corporates, NGOs, and communities'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-4">
            <Globe className="w-4 h-4" />
            <span>UN SDG Alignment</span>
          </div>
          <h2 className="text-slate-900 mb-6">
            CSR Philosophy & Impact Framework
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Every Wasilah CSR initiative aligns with the UN Sustainable Development Goals (SDGs). 
            We ensure your corporate efforts contribute to measurable global development indicators.
          </p>
        </div>

        {/* SDG Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sdgs.map((sdg, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group"
            >
              {/* SDG Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 ${sdg.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  {sdg.icon}
                </div>
                <div>
                  <div className="text-slate-500 text-sm">SDG {sdg.number}</div>
                  <div className="text-slate-900">{sdg.title}</div>
                </div>
              </div>

              {/* Contribution */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {sdg.contribution}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-200 text-center">
            <div className="text-teal-700 mb-2">12/17</div>
            <div className="text-slate-600">SDG Goals Actively Tracked</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8 border border-blue-200 text-center">
            <div className="text-blue-700 mb-2">100%</div>
            <div className="text-slate-600">Programs SDG-Aligned</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200 text-center">
            <div className="text-emerald-700 mb-2">Quarterly</div>
            <div className="text-slate-600">SDG Impact Reporting</div>
          </div>
        </div>
      </div>
    </section>
  );
}
