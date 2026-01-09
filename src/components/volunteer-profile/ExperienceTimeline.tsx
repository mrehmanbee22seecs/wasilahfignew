import React from 'react';
import { Calendar, Building2, ExternalLink } from 'lucide-react';

interface Experience {
  id: string;
  ngoName: string;
  ngoLogo?: string;
  opportunityTitle: string;
  duration: string;
  description: string;
  sdgs: number[];
  startDate: string;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8">Volunteer Experience</h2>

        {experiences.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-slate-200">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-slate-900 mb-2">No Experience Listed</h3>
            <p className="text-slate-600">Volunteer experiences will appear here</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-violet-300 to-teal-300" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full border-4 border-white shadow-lg" />

                  {/* Experience Card */}
                  <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* NGO Logo */}
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                          {exp.ngoLogo ? (
                            <img src={exp.ngoLogo} alt={exp.ngoName} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-slate-900 mb-1">{exp.opportunityTitle}</h3>
                          <div className="text-slate-600 text-sm">{exp.ngoName}</div>
                        </div>
                      </div>

                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* SDG Tags */}
                    {exp.sdgs.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-500 text-xs">SDG Alignment:</span>
                        {exp.sdgs.map((sdg) => (
                          <div
                            key={sdg}
                            className={`w-7 h-7 ${sdgColors[sdg - 1]} rounded flex items-center justify-center text-white text-xs shadow-sm`}
                            title={`SDG ${sdg}`}
                          >
                            {sdg}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
