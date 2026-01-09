import React from 'react';
import { Shield, FileCheck, Headphones, Lock } from 'lucide-react';

export function SafetySection() {
  const safetyItems = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Code of Conduct',
      description: 'All volunteers and NGOs must adhere to our community guidelines and ethical standards',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: 'Safety Protocols',
      description: 'On-ground opportunities include safety briefings and emergency contact procedures',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: 'Wasilah Support',
      description: 'Our team is available to assist with questions, concerns, or issues during your volunteering',
      color: 'bg-violet-100 text-violet-600'
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Data Privacy',
      description: 'Your personal information is protected and never shared without your explicit consent',
      color: 'bg-emerald-100 text-emerald-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-3">Safety, Ethics & Support</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your safety and wellbeing are our priority. We maintain strict standards 
            to ensure a secure and positive volunteering experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {safetyItems.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6 hover:border-teal-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 p-6 text-center">
          <p className="text-slate-700">
            Have questions or concerns? Contact our support team at{' '}
            <a href="mailto:support@wasilah.org" className="text-teal-600 hover:text-teal-700">
              support@wasilah.org
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
