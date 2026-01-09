import React, { useState } from 'react';
import { UserPlus, FileText, Shield, Rocket, BarChart } from 'lucide-react';

export function HowItWorks() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: 'Onboard',
      summary: 'Intake call',
      details: 'We conduct a 45-minute discovery call to understand your CSR goals, budget, timeline, and compliance requirements. You receive a summary deck within 2 business days.',
      duration: '1 week'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Plan',
      summary: 'Strategy & scope',
      details: 'Our team develops an SDG-aligned CSR plan with project options, budget breakdown, and timeline. Includes 2 revision rounds based on your feedback.',
      duration: '1-2 weeks'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Vet',
      summary: 'NGO verification',
      details: 'We verify NGO partners through legal registration checks, financial audits, past project documentation, and reference calls. Only vetted NGOs proceed.',
      duration: '1 week'
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: 'Execute',
      summary: 'Project delivery',
      details: 'We handle volunteer recruitment, logistics, on-ground coordination, and real-time monitoring. You receive daily updates and can join site visits.',
      duration: '2-6 weeks'
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Report',
      summary: 'Impact documentation',
      details: 'Final deliverables include: impact report with photos and metrics, board presentation deck, ESG documentation, social media kit, and beneficiary testimonials.',
      duration: '1 week'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            A proven 5-step process from onboarding to impact reporting
          </p>
        </div>

        {/* Horizontal Flow */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-0.5 bg-slate-200" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                  className={`w-full text-left transition-all ${
                    selectedStep === index
                      ? 'transform scale-105'
                      : 'hover:scale-105'
                  }`}
                  data-analytics="how_it_works_step_click"
                  data-step={step.title}
                >
                  {/* Step Circle */}
                  <div className={`w-28 h-28 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${
                    selectedStep === index
                      ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                    {step.icon}
                  </div>

                  {/* Step Info */}
                  <div className="text-center">
                    <h4 className="text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-slate-600 text-sm">{step.summary}</p>
                    <p className="text-teal-600 text-xs mt-1">{step.duration}</p>
                  </div>
                </button>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 -right-6 w-12 h-0.5 bg-slate-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-4 border-transparent border-l-slate-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        {selectedStep !== null && (
          <div className="mt-12 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-200 p-8 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                {steps[selectedStep].icon}
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 mb-2">
                  Step {selectedStep + 1}: {steps[selectedStep].title}
                </h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  {steps[selectedStep].details}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Typical Duration:</span>
                  <span className="px-3 py-1 bg-white rounded-full text-teal-600 border border-teal-200">
                    {steps[selectedStep].duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
