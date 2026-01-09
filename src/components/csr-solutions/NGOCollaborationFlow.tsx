import React from 'react';
import { FileText, CheckCircle, Users, PlayCircle, BarChart3, ArrowRight } from 'lucide-react';

export function NGOCollaborationFlow() {
  const steps = [
    {
      number: '01',
      icon: <FileText className="w-8 h-8" />,
      title: 'NGO Project Submission',
      description: 'NGOs submit verified project proposals with clear impact objectives and resource requirements',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Corporate Selection',
      description: 'Companies review and select projects aligned with their CSR values and strategic goals',
      color: 'from-teal-500 to-teal-600'
    },
    {
      number: '03',
      icon: <Users className="w-8 h-8" />,
      title: 'Volunteer Team Assignment',
      description: 'Student volunteers are matched and trained based on project requirements and skill needs',
      color: 'from-violet-500 to-violet-600'
    },
    {
      number: '04',
      icon: <PlayCircle className="w-8 h-8" />,
      title: 'Execution & Monitoring',
      description: 'Real-time project tracking, on-ground coordination, and quality assurance throughout',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      number: '05',
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Impact Reporting',
      description: 'Comprehensive documentation with metrics, photos, videos, and stakeholder testimonials',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            NGO Collaboration Model
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A transparent, structured process that connects corporate CSR with verified NGO projects
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          {/* Connection Line for Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-teal-200 to-amber-200 -z-10"
               style={{ width: 'calc(100% - 8rem)', margin: '0 4rem' }} />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg text-sm">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 text-teal-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200 text-center">
            <div className="text-blue-700 mb-2">180+</div>
            <div className="text-slate-600 text-sm">Verified NGO Partners</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200 text-center">
            <div className="text-teal-700 mb-2">98%</div>
            <div className="text-slate-600 text-sm">Project Success Rate</div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 text-center">
            <div className="text-violet-700 mb-2">45 Days</div>
            <div className="text-slate-600 text-sm">Avg. Project Duration</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 text-center">
            <div className="text-amber-700 mb-2">100%</div>
            <div className="text-slate-600 text-sm">Transparency & Compliance</div>
          </div>
        </div>
      </div>
    </section>
  );
}
