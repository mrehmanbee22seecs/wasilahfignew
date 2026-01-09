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

export function SDGSection() {
  const sdgs = [
    { icon: <Heart className="w-6 h-6" />, title: 'No Poverty', color: 'bg-red-500' },
    { icon: <Utensils className="w-6 h-6" />, title: 'Zero Hunger', color: 'bg-yellow-600' },
    { icon: <HeartPulse className="w-6 h-6" />, title: 'Good Health', color: 'bg-green-500' },
    { icon: <GraduationCap className="w-6 h-6" />, title: 'Quality Education', color: 'bg-red-600' },
    { icon: <Users className="w-6 h-6" />, title: 'Gender Equality', color: 'bg-orange-500' },
    { icon: <Droplet className="w-6 h-6" />, title: 'Clean Water', color: 'bg-cyan-500' },
    { icon: <Zap className="w-6 h-6" />, title: 'Clean Energy', color: 'bg-yellow-500' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Economic Growth', color: 'bg-pink-600' },
    { icon: <Building2 className="w-6 h-6" />, title: 'Infrastructure', color: 'bg-orange-600' },
    { icon: <Lightbulb className="w-6 h-6" />, title: 'Reduce Inequalities', color: 'bg-purple-600' },
    { icon: <Home className="w-6 h-6" />, title: 'Sustainable Cities', color: 'bg-yellow-600' },
    { icon: <Recycle className="w-6 h-6" />, title: 'Responsible Consumption', color: 'bg-amber-600' },
    { icon: <CloudRain className="w-6 h-6" />, title: 'Climate Action', color: 'bg-green-600' },
    { icon: <Fish className="w-6 h-6" />, title: 'Life Below Water', color: 'bg-blue-500' },
    { icon: <Leaf className="w-6 h-6" />, title: 'Life on Land', color: 'bg-green-500' },
    { icon: <Scale className="w-6 h-6" />, title: 'Peace & Justice', color: 'bg-blue-600' },
    { icon: <Globe className="w-6 h-6" />, title: 'Partnerships', color: 'bg-blue-700' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white mb-6">
            <Globe className="w-4 h-4" />
            <span>UN Sustainable Development Goals</span>
          </div>
          
          <h2 className="text-white mb-6">
            SDG-Aligned CSR Programs
          </h2>
          
          <p className="text-blue-100 max-w-3xl mx-auto text-lg">
            All CSR projects are strategically aligned with UN Sustainable Development Goals, 
            ensuring your corporate impact contributes to global sustainability targets.
          </p>
        </div>

        {/* SDG Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sdgs.map((sdg, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 ${sdg.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                {sdg.icon}
              </div>
              <p className="text-white text-xs leading-snug">
                {sdg.title}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">17/17</div>
            <div className="text-blue-100">SDG Goals Covered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">200+</div>
            <div className="text-blue-100">SDG-Aligned Projects</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">100%</div>
            <div className="text-blue-100">Impact Tracking</div>
          </div>
        </div>
      </div>
    </section>
  );
}
