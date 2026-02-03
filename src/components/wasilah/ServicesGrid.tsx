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

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function ServicesGrid() {
  const services = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'CSR Planning & SDG Alignment',
      description: 'Strategic CSR roadmaps aligned with your corporate values and UN SDG targets for maximum impact.',
      iconBg: BRAND.teal,
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'NGO Vetting & Verification',
      description: 'Rigorous due diligence on NGO partners to ensure transparency, credibility, and legal compliance.',
      iconBg: BRAND.navy,
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'CSR Project Execution',
      description: 'End-to-end project management from planning to delivery with real-time monitoring and reporting.',
      iconBg: BRAND.teal,
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'CSR Impact Reports & Content',
      description: 'Professional documentation with photos, videos, and metrics for stakeholder communication.',
      iconBg: BRAND.navy,
    },
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: 'CSR Compliance & Audit Support',
      description: 'SECP-compliant documentation and audit-ready reports to meet regulatory requirements.',
      iconBg: BRAND.teal,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Employee Volunteering Management',
      description: 'Structured volunteer programs connecting your employees with meaningful CSR activities.',
      iconBg: BRAND.navy,
    }
  ];

  return (
    <section 
      className="py-24"
      style={{ backgroundColor: BRAND.cream }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <span className="font-medium">Our Services</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: BRAND.navy }}
          >
            What We Do
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Full-spectrum CSR operations support to help your organization create lasting social impact
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: service.iconBg }}
              >
                {service.icon}
              </div>
              
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: BRAND.navy }}
              >
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <button 
                className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                style={{ color: BRAND.teal }}
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
