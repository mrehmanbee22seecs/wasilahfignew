import React from 'react';
import { Target, Eye, CheckCircle } from 'lucide-react';

interface AboutSectionProps {
  about: {
    description: string[];
    mission: string;
    vision: string;
    focusAreas: string[];
  };
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8">
          About the Organization
        </h2>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {about.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Right Column - Mission, Vision, Focus */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-slate-900">Mission</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {about.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 border-2 border-violet-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-slate-900">Vision</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {about.vision}
              </p>
            </div>

            {/* Focus Areas */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border-2 border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-slate-900">Key Focus Areas</h3>
              </div>
              <div className="space-y-2">
                {about.focusAreas.map((area, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
