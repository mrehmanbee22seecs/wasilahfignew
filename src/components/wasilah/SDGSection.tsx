import React from 'react';
import { 
  Heart, 
  Utensils, 
  HeartPulse, 
  GraduationCap, 
  Users, 
  Droplet,
  Zap,
  TrendingUp,
  Building2,
  Lightbulb,
  Home,
  Recycle,
  CloudRain,
  Fish,
  Leaf,
  Scale,
  Globe
} from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  navyLight: '#2A3F6E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function SDGSection() {
  const sdgs = [
    { icon: <Heart className="w-6 h-6" />, title: 'No Poverty', color: '#E5243B' },
    { icon: <Utensils className="w-6 h-6" />, title: 'Zero Hunger', color: '#DDA63A' },
    { icon: <HeartPulse className="w-6 h-6" />, title: 'Good Health', color: '#4C9F38' },
    { icon: <GraduationCap className="w-6 h-6" />, title: 'Quality Education', color: '#C5192D' },
    { icon: <Users className="w-6 h-6" />, title: 'Gender Equality', color: '#FF3A21' },
    { icon: <Droplet className="w-6 h-6" />, title: 'Clean Water', color: '#26BDE2' },
    { icon: <Zap className="w-6 h-6" />, title: 'Clean Energy', color: '#FCC30B' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Economic Growth', color: '#A21942' },
    { icon: <Building2 className="w-6 h-6" />, title: 'Infrastructure', color: '#FD6925' },
    { icon: <Lightbulb className="w-6 h-6" />, title: 'Reduce Inequalities', color: '#DD1367' },
    { icon: <Home className="w-6 h-6" />, title: 'Sustainable Cities', color: '#FD9D24' },
    { icon: <Recycle className="w-6 h-6" />, title: 'Responsible Consumption', color: '#BF8B2E' },
    { icon: <CloudRain className="w-6 h-6" />, title: 'Climate Action', color: '#3F7E44' },
    { icon: <Fish className="w-6 h-6" />, title: 'Life Below Water', color: '#0A97D9' },
    { icon: <Leaf className="w-6 h-6" />, title: 'Life on Land', color: '#56C02B' },
    { icon: <Scale className="w-6 h-6" />, title: 'Peace & Justice', color: '#00689D' },
    { icon: <Globe className="w-6 h-6" />, title: 'Partnerships', color: '#19486A' }
  ];

  return (
    <section 
      className="py-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: BRAND.teal }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white mb-6">
            <Globe className="w-4 h-4" />
            <span className="font-medium">UN Sustainable Development Goals</span>
          </div>
          
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            SDG-Aligned CSR Programs
          </h2>
          
          <p className="text-white/80 max-w-3xl mx-auto text-lg">
            All CSR projects are strategically aligned with UN Sustainable Development Goals, 
            ensuring your corporate impact contributes to global sustainability targets.
          </p>
        </div>

        {/* SDG Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sdgs.map((sdg, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: sdg.color }}
              >
                {sdg.icon}
              </div>
              <p className="text-white text-xs leading-snug font-medium">
                {sdg.title}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '17/17', label: 'SDG Goals Covered' },
            { value: '200+', label: 'SDG-Aligned Projects' },
            { value: '100%', label: 'Impact Tracking' },
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
              <div className="text-white text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
