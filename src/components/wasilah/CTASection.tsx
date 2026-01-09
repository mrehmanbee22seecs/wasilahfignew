import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }}>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Main Headline */}
        <h2 className="text-white mb-6 leading-tight">
          Let's Build Meaningful<br />
          CSR Together
        </h2>

        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          Partner with Pakistan's first dedicated CSR operations platform. 
          Transform your corporate social responsibility from obligation to strategic impact.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl group">
            <Calendar className="w-5 h-5" />
            Book a Consultation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            See How We Work
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-white mb-2">Rapid Response</div>
            <div className="text-blue-200">Initial consultation within 24 hours</div>
          </div>
          <div className="text-center">
            <div className="text-white mb-2">Zero Commitment</div>
            <div className="text-blue-200">Free strategy session to explore fit</div>
          </div>
          <div className="text-center">
            <div className="text-white mb-2">Full Transparency</div>
            <div className="text-blue-200">Clear pricing, no hidden costs</div>
          </div>
        </div>
      </div>
    </section>
  );
}
