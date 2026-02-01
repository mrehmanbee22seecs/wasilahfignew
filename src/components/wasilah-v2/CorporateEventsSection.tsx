import React from 'react';
import { Music, Utensils, Music2, Plane, ArrowRight } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function CorporateEventsSection() {
  const events = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Corporate Dinners',
      subtitle: 'CSR Announcement Events',
      description: 'Elegant corporate dinners designed to unveil CSR initiatives to stakeholders with impact storytelling.',
      iconBg: BRAND.navy,
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Qawali Nights',
      subtitle: 'Fundraising Events',
      description: 'Cultural evenings featuring traditional Qawali performances paired with donation drives for social causes.',
      iconBg: BRAND.teal,
    },
    {
      icon: <Music2 className="w-8 h-8" />,
      title: 'Concerts & Gatherings',
      subtitle: 'Donation Drive Events',
      description: 'Live music events and corporate gatherings integrated with charitable giving and cause marketing.',
      iconBg: BRAND.navy,
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: 'CSR Celebration Trips',
      subtitle: 'Team Excursions',
      description: 'Employee engagement trips celebrating CSR milestones while exploring project sites and impact zones.',
      iconBg: BRAND.teal,
    }
  ];

  return (
    <section className="py-24" style={{ backgroundColor: BRAND.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="font-medium">Events & Services</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            Corporate Services & Events
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-2 text-lg">
            Events designed to engage employees, stakeholders, and students — while keeping CSR purpose at the core
          </p>
          <p className="text-gray-500 text-sm">
            Create memorable experiences that drive social impact and strengthen corporate culture
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="p-8">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: event.iconBg }}
                >
                  {event.icon}
                </div>

                <div className="mb-2">
                  <h3 className="text-xl font-semibold mb-1" style={{ color: BRAND.navy }}>{event.title}</h3>
                  <p style={{ color: BRAND.teal }} className="font-medium">{event.subtitle}</p>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <button 
                  className="flex items-center gap-2 font-medium hover:gap-3 transition-all"
                  style={{ color: BRAND.teal }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button 
            className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
            style={{ backgroundColor: BRAND.navy }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND.teal}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND.navy}
          >
            Explore Corporate Events
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}