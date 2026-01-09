import React from 'react';
import { 
  UserPlus, 
  ClipboardList, 
  ShieldCheck, 
  PlayCircle, 
  BarChart3, 
  FileCheck 
} from 'lucide-react';

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
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 mb-4">
            <span>Our Process</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            How Wasilah Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A structured, transparent approach to CSR operations that delivers results
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-blue-200 -z-0" 
               style={{ width: 'calc(100% - 12rem)', margin: '0 6rem' }} />
          
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-100 transition-colors">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
