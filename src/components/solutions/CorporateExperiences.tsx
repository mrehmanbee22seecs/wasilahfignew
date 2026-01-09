import React from 'react';
import { Calendar, Users, Coffee, Music, TreePine } from 'lucide-react';

interface CorporateExperiencesProps {
  onBookExperience: (experienceType: string) => void;
}

export function CorporateExperiences({ onBookExperience }: CorporateExperiencesProps) {
  const experiences = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: 'CSR Appreciation Dinner',
      csrFraming: 'Recognize employee volunteers and celebrate social impact in an elegant setting',
      timeline: '4-6 weeks planning, 1 evening event',
      deliverables: [
        'Venue booking and catering coordination',
        'Impact presentation with video montage',
        'Awards and recognition ceremony',
        'Professional photography and event coverage',
        'Post-event social media kit'
      ],
      sampleSize: '50-200 attendees',
      sdgs: [17]
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Qawali Night with Purpose',
      csrFraming: 'Cultural evening where ticket sales fund educational scholarships',
      timeline: '6-8 weeks planning, 1 evening event',
      deliverables: [
        'Artist booking and sound setup',
        'Scholarship fund structure and beneficiary selection',
        'Ticketing and registration management',
        'Impact storytelling during intermission',
        'Post-event scholarship distribution report'
      ],
      sampleSize: '100-300 attendees',
      sdgs: [4, 17]
    },
    {
      icon: <TreePine className="w-8 h-8" />,
      title: 'Executive Field Trip',
      csrFraming: 'Leadership team visits project sites to see CSR impact firsthand',
      timeline: '3-4 weeks planning, 1 day trip',
      deliverables: [
        'Site selection and NGO coordination',
        'Transportation and safety logistics',
        'Structured itinerary with beneficiary interaction',
        'Professional photography and videography',
        'Executive debrief session and insights report'
      ],
      sampleSize: '10-30 executives',
      sdgs: [1, 4, 11]
    }
  ];

  const sdgColors: Record<number, string> = {
    1: 'bg-red-500', 4: 'bg-red-600', 11: 'bg-orange-400', 17: 'bg-blue-700'
  };

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">Corporate Experiences</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Premium CSR events that build culture, celebrate impact, and create lasting memories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 hover:border-violet-300 transition-all overflow-hidden group"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-violet-500 to-blue-600 p-6 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  {exp.icon}
                </div>
                <h3 className="text-white mb-2">{exp.title}</h3>
                <p className="text-white/90 text-sm">{exp.csrFraming}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700 text-sm">{exp.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700 text-sm">{exp.sampleSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">SDGs:</span>
                    <div className="flex gap-1">
                      {exp.sdgs.map(sdg => (
                        <div
                          key={sdg}
                          className={`w-6 h-6 ${sdgColors[sdg]} rounded text-white flex items-center justify-center text-xs`}
                        >
                          {sdg}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-slate-900 text-sm mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {exp.deliverables.map((deliverable, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                        <span className="text-violet-600 mt-1">✓</span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onBookExperience(exp.title)}
                  data-analytics="book_experience"
                  data-experience-type={exp.title}
                  className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Book Experience
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">
            All experiences can be customized to your budget, timeline, and brand guidelines
          </p>
        </div>
      </div>
    </section>
  );
}
