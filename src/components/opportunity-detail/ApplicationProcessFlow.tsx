import React from 'react';
import { FileText, Search, CheckCircle, Rocket, ArrowRight } from 'lucide-react';

export function ApplicationProcessFlow() {
  const steps = [
    {
      number: 1,
      icon: <FileText className="w-6 h-6" />,
      title: 'Submit Application',
      description: 'Fill out a brief application form with your details and motivation',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      number: 2,
      icon: <Search className="w-6 h-6" />,
      title: 'Review by Wasilah',
      description: 'Our team reviews your application (typically 2-3 business days)',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      number: 3,
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Confirmation',
      description: 'Receive confirmation and interview details if applicable',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      number: 4,
      icon: <Rocket className="w-6 h-6" />,
      title: 'Start Volunteering',
      description: 'Complete onboarding and begin making an impact',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-3">What Happens After You Apply</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A transparent, straightforward process from application to impact. 
            We'll guide you every step of the way.
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-teal-400 transition-all">
                {/* Step Number */}
                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {step.icon}
                </div>

                <div className="mb-2">
                  <div className="text-slate-400 text-xs mb-1">Step {step.number}</div>
                  <h3 className="text-slate-900 text-sm mb-2">{step.title}</h3>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow Between Steps */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Flow */}
        <div className="md:hidden space-y-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.number}>
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-400 text-xs mb-1">Step {step.number}</div>
                    <h3 className="text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-6 bg-slate-200" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reassurance Message */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 text-center">
          <p className="text-slate-700">
            <span className="text-slate-900">No surprises.</span> We'll keep you informed at every stage 
            and answer any questions you have along the way.
          </p>
        </div>
      </div>
    </section>
  );
}
