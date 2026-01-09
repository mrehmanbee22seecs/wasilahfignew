import React from 'react';
import { FileText, ShieldCheck, ClipboardCheck, Eye, CheckCircle, ArrowRight } from 'lucide-react';

export function VerificationProcess() {
  const steps = [
    {
      number: '01',
      icon: <FileText className="w-6 h-6" />,
      title: 'Submit Application',
      description: 'Complete online form with basic profile, organizational goals, and required documents',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Compliance & Documentation Review',
      description: 'Legal checks, registration proof verification, and board information assessment',
      color: 'from-teal-500 to-teal-600'
    },
    {
      number: '03',
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: 'Background Evaluation',
      description: 'Review of 3-5 past projects, financial transparency, and organizational capacity',
      color: 'from-violet-500 to-violet-600'
    },
    {
      number: '04',
      icon: <Eye className="w-6 h-6" />,
      title: 'Site Visit (Optional)',
      description: 'For high-impact or large-scale NGOs, physical verification of operations and facilities',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      number: '05',
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Approval & Onboarding',
      description: 'Access to Wasilah dashboard, CSR opportunities, and corporate partnership network',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Trust & Transparency</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            NGO Verification Process
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Our rigorous verification ensures only credible, transparent, and impactful NGOs join our network
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connection Line for Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-teal-200 via-violet-200 via-emerald-200 to-amber-200 -z-10"
               style={{ width: 'calc(100% - 10rem)', margin: '0 5rem' }} />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 group h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-slate-900 mb-2 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 text-blue-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-6 border border-blue-200 text-center">
            <div className="text-blue-700 mb-2">7-14 Days</div>
            <div className="text-slate-600 text-sm">Average Verification Time</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200 text-center">
            <div className="text-teal-700 mb-2">95%</div>
            <div className="text-slate-600 text-sm">Approval Rate</div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 text-center">
            <div className="text-violet-700 mb-2">100%</div>
            <div className="text-slate-600 text-sm">Free Application</div>
          </div>
        </div>
      </div>
    </section>
  );
}
