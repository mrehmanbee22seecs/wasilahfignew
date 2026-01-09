import React from 'react';
import { 
  Target, 
  Shield, 
  Rocket, 
  FileText, 
  CheckSquare, 
  Users,
  ArrowRight 
} from 'lucide-react';

export function ServicesGrid() {
  const services = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'CSR Planning & SDG Alignment',
      description: 'Strategic CSR roadmaps aligned with your corporate values and UN SDG targets for maximum impact.',
      color: 'blue'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'NGO Vetting & Verification',
      description: 'Rigorous due diligence on NGO partners to ensure transparency, credibility, and legal compliance.',
      color: 'emerald'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'CSR Project Execution',
      description: 'End-to-end project management from planning to delivery with real-time monitoring and reporting.',
      color: 'violet'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'CSR Impact Reports & Content',
      description: 'Professional documentation with photos, videos, and metrics for stakeholder communication.',
      color: 'cyan'
    },
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: 'CSR Compliance & Audit Support',
      description: 'SECP-compliant documentation and audit-ready reports to meet regulatory requirements.',
      color: 'blue'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Employee Volunteering Management',
      description: 'Structured volunteer programs connecting your employees with meaningful CSR activities.',
      color: 'emerald'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      hover: 'hover:border-blue-200'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      hover: 'hover:border-emerald-200'
    },
    violet: {
      bg: 'bg-violet-50',
      icon: 'text-violet-600',
      hover: 'hover:border-violet-200'
    },
    cyan: {
      bg: 'bg-cyan-50',
      icon: 'text-cyan-600',
      hover: 'hover:border-cyan-200'
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <span>Our Services</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            What We Do
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Full-spectrum CSR operations support to help your organization create lasting social impact
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 border border-slate-200 ${colors.hover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-6 ${colors.icon}`}>
                  {service.icon}
                </div>
                
                <h3 className="text-slate-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <button className={`flex items-center gap-2 ${colors.icon} group-hover:gap-3 transition-all`}>
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
