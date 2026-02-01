import React from 'react';
import { Rocket, Users, Handshake } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function AboutSection() {
  const cards = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'CSR Campaign Execution',
      description: 'End-to-end management of your CSR initiatives from strategic planning to impact reporting with full transparency.',
      iconBg: BRAND.teal,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Student Volunteer Program',
      description: 'Access to a trained network of 5,000+ student volunteers ready to amplify your CSR impact across Pakistan.',
      iconBg: BRAND.navy,
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'NGO Project Matching',
      description: 'Connect with verified NGO partners aligned with your CSR goals, values, and desired social impact outcomes.',
      iconBg: BRAND.teal,
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            Our Services
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            What We Do
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Wasilah bridges the gap between corporate CSR ambitions and real-world social impact
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: card.iconBg }}
              >
                {card.icon}
              </div>
              
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: BRAND.navy }}
              >
                {card.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
