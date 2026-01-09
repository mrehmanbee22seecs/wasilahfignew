import React from 'react';
import { Music, Utensils, Music2, Plane } from 'lucide-react';

export function CSREventsSection() {
  const events = [
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Fundraising Concerts',
      subtitle: 'with Donation Drives',
      description: 'Live music events that combine entertainment with charitable giving, creating memorable experiences while raising funds for social causes.',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50'
    },
    {
      icon: <Music2 className="w-8 h-8" />,
      title: 'Qawali Nights',
      subtitle: 'Community Engagement',
      description: 'Traditional Qawali performances paired with CSR storytelling and community connection for culturally-rooted social impact.',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Corporate CSR Dinners',
      subtitle: 'Award Ceremonies',
      description: 'Elegant corporate events to unveil CSR achievements, honor partners, and celebrate impact with stakeholders and leadership.',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50'
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: 'CSR Celebration Trips',
      subtitle: 'Tree Plantations & Cleanups',
      description: 'Team excursions combining CSR activities like tree planting and cleanup drives with employee engagement and recognition.',
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">
            CSR Events & Corporate Engagement
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg mb-2">
            These events combine corporate engagement and meaningful social contribution
          </p>
          <p className="text-slate-500">
            Create memorable experiences that strengthen culture while driving real impact
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className={`${event.bgColor} rounded-2xl p-8 border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 group`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {event.icon}
              </div>

              <div className="mb-4">
                <h3 className="text-slate-900 mb-1">
                  {event.title}
                </h3>
                <p className={`text-transparent bg-clip-text bg-gradient-to-r ${event.color}`}>
                  {event.subtitle}
                </p>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 border border-teal-200 rounded-full text-teal-700">
            <span>All events designed with CSR purpose at the core</span>
          </div>
        </div>
      </div>
    </section>
  );
}
