import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function CTABanner() {
  return (
    <section 
      className="py-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 50%, ${BRAND.navy} 100%)`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: BRAND.teal }}></div>
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
        <div 
          className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/30"
        >
          <FileText className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Ready to Launch a CSR Initiative<br />
          That Truly Makes a Difference?
        </h2>

        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Let's discuss how Wasilah can help you design, execute, and measure CSR programs 
          that create lasting social impact while strengthening your corporate reputation.
        </p>

        {/* CTA Button */}
        <button 
          className="inline-flex items-center gap-2 px-10 py-5 bg-white rounded-xl hover:shadow-2xl transition-all group text-lg font-semibold"
          style={{ color: BRAND.navy }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = BRAND.cream;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Request a Proposal
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { title: '24-Hour Response', desc: "We'll get back to you within one business day" },
            { title: 'Custom Solutions', desc: 'Tailored CSR programs for your company' },
            { title: 'No Obligation', desc: 'Free consultation to explore possibilities' },
          ].map((item) => (
            <div 
              key={item.title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors"
            >
              <div className="text-white font-semibold mb-2">{item.title}</div>
              <div className="text-white/70 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
