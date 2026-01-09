import React from 'react';
import { Rocket, Users, Handshake } from 'lucide-react';

export function AboutSection() {
  const cards = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'CSR Campaign Execution',
      description: 'End-to-end management of your CSR initiatives from strategic planning to impact reporting with full transparency.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Student Volunteer Program',
      description: 'Access to a trained network of 5,000+ student volunteers ready to amplify your CSR impact across Pakistan.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'NGO Project Matching',
      description: 'Connect with verified NGO partners aligned with your CSR goals, values, and desired social impact outcomes.',
      color: 'from-violet-500 to-violet-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            What We Do
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Wasilah bridges the gap between corporate CSR ambitions and real-world social impact
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              
              <h3 className="text-slate-900 mb-3">
                {card.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
