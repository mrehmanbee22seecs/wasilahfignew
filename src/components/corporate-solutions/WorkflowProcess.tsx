import React from 'react';
import { Phone, Target, Handshake, Calendar, PlayCircle, Eye, FileText, ArrowRight } from 'lucide-react';

export function WorkflowProcess() {
  const steps = [
    {
      number: '01',
      icon: <Phone className="w-6 h-6" />,
      title: 'Discovery Call',
      description: 'Understanding your CSR goals, budget, and organizational priorities',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: <Target className="w-6 h-6" />,
      title: 'CSR Goals Mapping',
      description: 'SDG alignment, impact areas, and strategic planning for maximum effect',
      color: 'from-teal-500 to-teal-600'
    },
    {
      number: '03',
      icon: <Handshake className="w-6 h-6" />,
      title: 'NGO Matching',
      description: 'Selecting verified NGO partners aligned with your mission and values',
      color: 'from-violet-500 to-violet-600'
    },
    {
      number: '04',
      icon: <Calendar className="w-6 h-6" />,
      title: 'Resource Planning',
      description: 'Volunteer mobilization, logistics coordination, and timeline setup',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      number: '05',
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'Event Execution',
      description: 'On-ground management, volunteer coordination, and real-time oversight',
      color: 'from-amber-500 to-amber-600'
    },
    {
      number: '06',
      icon: <Eye className="w-6 h-6" />,
      title: 'Monitoring',
      description: 'Live tracking, photo documentation, and attendance verification',
      color: 'from-pink-500 to-pink-600'
    },
    {
      number: '07',
      icon: <FileText className="w-6 h-6" />,
      title: 'Reporting & PR',
      description: 'Impact dashboards, compliance docs, and PR-ready content delivery',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            How Wasilah Works With Your Company
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            A streamlined, proven process that takes your CSR from concept to measurable impact
          </p>
        </div>

        {/* Workflow Timeline */}
        <div className="relative">
          {/* Connection Line for Desktop */}
          <div className="hidden xl:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-teal-200 via-violet-200 via-emerald-200 via-amber-200 via-pink-200 to-indigo-200 -z-10"
               style={{ width: 'calc(100% - 8rem)', margin: '0 4rem' }} />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-slate-900 mb-2 text-center text-sm">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for Desktop - Hidden on last item and at breakpoints */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute top-20 -right-3 text-blue-300 z-10">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Process Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 border-2 border-blue-200 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 mb-2">End-to-End Management</h4>
            <p className="text-slate-600 text-sm">We handle every step so your team stays focused on core business</p>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-teal-200 text-center">
            <div className="w-12 h-12 bg-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <Eye className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 mb-2">Full Transparency</h4>
            <p className="text-slate-600 text-sm">Real-time updates and comprehensive documentation at every phase</p>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-violet-200 text-center">
            <div className="w-12 h-12 bg-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 mb-2">Compliance Ready</h4>
            <p className="text-slate-600 text-sm">Reports formatted for audits, boards, and ESG disclosures</p>
          </div>
        </div>
      </div>
    </section>
  );
}
