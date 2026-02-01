import React from 'react';
import { 
  UserPlus, 
  ClipboardList, 
  ShieldCheck, 
  PlayCircle, 
  BarChart3, 
  FileCheck 
} from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function ProcessFlow() {
  const steps = [
    {
      number: '01',
      icon: <UserPlus className="w-6 h-6" />,
      title: 'Onboarding',
      description: 'Understanding your CSR vision and compliance requirements'
    },
    {
      number: '02',
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'CSR Planning',
      description: 'Strategic roadmap aligned with SDGs and corporate goals'
    },
    {
      number: '03',
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'NGO Vetting',
      description: 'Rigorous verification of partner organizations'
    },
    {
      number: '04',
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'Project Execution',
      description: 'End-to-end management with real-time monitoring'
    },
    {
      number: '05',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Impact Reporting',
      description: 'Comprehensive documentation with measurable outcomes'
    },
    {
      number: '06',
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Audit Support',
      description: 'SECP-compliant reporting and audit readiness'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="font-medium">Our Process</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            How Wasilah Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A structured, transparent approach to CSR operations that delivers results
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Step Number Badge */}
              <div 
                className="absolute -top-4 -left-4 w-12 h-12 text-white rounded-xl flex items-center justify-center shadow-lg font-bold"
                style={{ backgroundColor: index % 2 === 0 ? BRAND.teal : BRAND.navy }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${BRAND.navy}10`,
                  color: BRAND.navy
                }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 
                className="text-lg font-semibold mb-3"
                style={{ color: BRAND.navy }}
              >
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
