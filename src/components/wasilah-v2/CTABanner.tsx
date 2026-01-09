import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="py-24 bg-gradient-to-r from-teal-600 via-blue-600 to-teal-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Icon */}
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
          <FileText className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-white mb-6 leading-tight">
          Ready to Launch a CSR Initiative<br />
          That Truly Makes a Difference?
        </h2>

        <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
          Let's discuss how Wasilah can help you design, execute, and measure CSR programs 
          that create lasting social impact while strengthening your corporate reputation.
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-all shadow-2xl hover:shadow-3xl group text-lg">
          Request a Proposal
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">24-Hour Response</div>
            <div className="text-teal-100 text-sm">We'll get back to you within one business day</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Custom Solutions</div>
            <div className="text-teal-100 text-sm">Tailored CSR programs for your company</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">No Obligation</div>
            <div className="text-teal-100 text-sm">Free consultation to explore possibilities</div>
          </div>
        </div>
      </div>
    </section>
  );
}
