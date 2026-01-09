import React from 'react';
import { UserPlus, Search, FileCheck, Users, PlayCircle, Award, ArrowRight } from 'lucide-react';

export function WorkflowTimeline() {
  const steps = [
    {
      number: '01',
      icon: <UserPlus className="w-6 h-6" />,
      title: 'Create Profile',
      description: 'Upload basic info, skills, interests, and availability preferences',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: <Search className="w-6 h-6" />,
      title: 'Browse CSR Projects',
      description: 'View corporate-sponsored initiatives across education, health, and environment',
      color: 'from-teal-500 to-teal-600'
    },
    {
      number: '03',
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Apply to Opportunities',
      description: 'Select NGOs, events, or CSR campaigns that match your skills and passion',
      color: 'from-violet-500 to-violet-600'
    },
    {
      number: '04',
      icon: <Users className="w-6 h-6" />,
      title: 'Get Selected & Join Teams',
      description: 'Assigned based on skills, availability, and project requirements',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      number: '05',
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'Volunteer & Complete Tasks',
      description: 'Participate in on-ground activities or contribute with skill-based support',
      color: 'from-amber-500 to-amber-600'
    },
    {
      number: '06',
      icon: <Award className="w-6 h-6" />,
      title: 'Receive Verified Certificates',
      description: 'Get digital badges, certificates, and experience reports for your portfolio',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your journey from registration to certified volunteer in six simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line for Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-teal-200 via-violet-200 via-emerald-200 via-amber-200 to-pink-200 -z-10"
               style={{ width: 'calc(100% - 8rem)', margin: '0 4rem' }} />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-teal-300 hover:shadow-2xl transition-all duration-300 group h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
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
                {index < steps.length - 1 && index % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-20 -right-4 text-teal-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:shadow-xl transition-all">
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
