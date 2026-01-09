import React from 'react';
import { Shield, Eye, FileCheck, Headphones } from 'lucide-react';

export function WorkingWithWasilahSection() {
  const wasilahRoles = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Operations & Verification Partner',
      description: 'Wasilah pre-screens, verifies, and vets all NGO partners before they appear on the platform',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Ongoing Monitoring',
      description: 'Continuous oversight during projects to ensure volunteer safety and program quality',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: 'Documentation & Reporting',
      description: 'All projects are documented with clear reporting standards for transparency and accountability',
      color: 'text-violet-600',
      bgColor: 'bg-violet-100'
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: 'Support & Mediation',
      description: 'Wasilah provides support to both volunteers and NGOs throughout the engagement period',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-3">Working With Wasilah</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Wasilah acts as the operations and verification partner, ensuring quality, 
            safety, and accountability across all volunteer engagements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {wasilahRoles.map((role, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${role.bgColor} rounded-lg flex items-center justify-center ${role.color} flex-shrink-0`}>
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-slate-900 mb-2">{role.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
