import React from 'react';
import { Target, Heart, Stethoscope, GraduationCap, Sprout, Users, Building, Globe } from 'lucide-react';

interface FocusAreasSDGSectionProps {
  focusAreas: Array<{
    name: string;
    sdg: number;
  }>;
}

export function FocusAreasSDGSection({ focusAreas }: FocusAreasSDGSectionProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  const getIconForFocusArea = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('education')) return <GraduationCap className="w-6 h-6" />;
    if (lowerName.includes('health')) return <Stethoscope className="w-6 h-6" />;
    if (lowerName.includes('environment') || lowerName.includes('climate')) return <Sprout className="w-6 h-6" />;
    if (lowerName.includes('poverty') || lowerName.includes('economic')) return <Heart className="w-6 h-6" />;
    if (lowerName.includes('women') || lowerName.includes('gender')) return <Users className="w-6 h-6" />;
    if (lowerName.includes('infrastructure')) return <Building className="w-6 h-6" />;
    return <Globe className="w-6 h-6" />;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-slate-900">Focus Areas & SDG Alignment</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          This organization's work aligns with the United Nations Sustainable Development Goals (SDGs), 
          demonstrating commitment to global impact frameworks recognized by corporate ESG initiatives.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6 hover:border-teal-300 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Focus Area Icon */}
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                  {getIconForFocusArea(area.name)}
                </div>

                {/* SDG Badge */}
                <div
                  className={`w-10 h-10 ${sdgColors[area.sdg - 1]} rounded-lg flex items-center justify-center text-white text-sm shadow-sm`}
                  title={`SDG ${area.sdg}`}
                >
                  {area.sdg}
                </div>
              </div>

              <h3 className="text-slate-900 mb-2">{area.name}</h3>
              <div className="text-slate-600 text-sm">
                Sustainable Development Goal {area.sdg}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
