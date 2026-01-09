import React from 'react';
import { Music, Utensils, Music2, Plane, ArrowRight } from 'lucide-react';

export function CorporateEventsSection() {
  const events = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Corporate Dinners',
      subtitle: 'CSR Announcement Events',
      description: 'Elegant corporate dinners designed to unveil CSR initiatives to stakeholders with impact storytelling.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Qawali Nights',
      subtitle: 'Fundraising Events',
      description: 'Cultural evenings featuring traditional Qawali performances paired with donation drives for social causes.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: <Music2 className="w-8 h-8" />,
      title: 'Concerts & Gatherings',
      subtitle: 'Donation Drive Events',
      description: 'Live music events and corporate gatherings integrated with charitable giving and cause marketing.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: 'CSR Celebration Trips',
      subtitle: 'Team Excursions',
      description: 'Employee engagement trips celebrating CSR milestones while exploring project sites and impact zones.',
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">
            Corporate Services & Events
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-2">
            Events designed to engage employees, stakeholders, and students — while keeping CSR purpose at the core
          </p>
          <p className="text-slate-500 text-sm">
            Create memorable experiences that drive social impact and strengthen corporate culture
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {event.icon}
                </div>

                <div className="mb-2">
                  <h3 className="text-slate-900 mb-1">{event.title}</h3>
                  <p className="text-teal-600">{event.subtitle}</p>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <button className="flex items-center gap-2 text-teal-600 hover:gap-3 transition-all group">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all">
            Explore Corporate Events
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}