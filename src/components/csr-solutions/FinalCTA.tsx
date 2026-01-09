import React from 'react';
import { FileText, Phone, ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-teal-600 via-blue-600 to-teal-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Icon */}
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
          <FileText className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-white mb-6 leading-tight">
          Ready to Create a CSR Program That<br />
          Delivers Measurable, Real-World Impact?
        </h2>

        <p className="text-teal-50 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
          Let Wasilah design, execute, and measure your CSR initiatives with our proven framework 
          of student volunteers, verified NGOs, and strategic impact reporting.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-all shadow-2xl group">
            <FileText className="w-6 h-6" />
            Request Corporate Proposal
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            <Phone className="w-6 h-6" />
            Talk to Our CSR Consultant
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Free Consultation</div>
            <div className="text-teal-100 text-sm">No obligation strategy session to explore fit</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Custom Solutions</div>
            <div className="text-teal-100 text-sm">Tailored CSR programs for your industry</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Proven Track Record</div>
            <div className="text-teal-100 text-sm">98% client satisfaction rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
