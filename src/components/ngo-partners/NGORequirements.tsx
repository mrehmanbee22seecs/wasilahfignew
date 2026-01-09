import React from 'react';
import { CheckCircle, FileText, TrendingUp, Target, Handshake, MapPin } from 'lucide-react';

export function NGORequirements() {
  const requirements = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Registered Trust/Society/Non-Profit',
      description: 'Valid legal registration with SECP, Social Welfare, or relevant authority'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'At Least 2-3 Completed Past Projects',
      description: 'Demonstrated track record of successful project execution and impact'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Financial Transparency',
      description: 'Clear financial records, audit reports, and transparent fund utilization'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Clear Mission & SDG Alignment',
      description: 'Well-defined organizational mission aligned with UN SDGs'
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: 'Willingness to Collaborate in CSR Reporting',
      description: 'Commitment to provide timely updates, data, and impact documentation'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'On-Ground Operational Capacity',
      description: 'Ability to execute on-ground activities and coordinate volunteers'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <CheckCircle className="w-4 h-4" />
            <span>Eligibility Criteria</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Requirements for NGO Partners
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Transparent standards ensure quality partnerships and maintain trust with corporate sponsors
          </p>
        </div>

        {/* Requirements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {req.icon}
                </div>
                <div>
                  <h4 className="text-slate-900 mb-2">{req.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{req.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2 px-8 py-6 bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-blue-200 rounded-xl max-w-3xl">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <p className="text-slate-700">
              These standardized requirements ensure we maintain the highest quality network 
              of NGOs, building trust with corporate partners and maximizing social impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
