import React from 'react';
import { UserPlus, MessageSquare, ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-violet-600 to-blue-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-400 rounded-full blur-3xl"></div>
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
          <UserPlus className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-white mb-6 leading-tight">
          Become a Verified<br />
          Wasilah NGO Partner
        </h2>

        <p className="text-blue-50 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
          Join Pakistan's first CSR Operations Network and unlock access to funding, volunteers, 
          and impact support from leading corporations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all shadow-2xl group">
            <UserPlus className="w-6 h-6" />
            Register Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            <MessageSquare className="w-6 h-6" />
            Talk to Our Team
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Free to Join</div>
            <div className="text-blue-100 text-sm">No registration or platform fees—ever</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">7-14 Days</div>
            <div className="text-blue-100 text-sm">Fast verification and onboarding process</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">180+ NGOs</div>
            <div className="text-blue-100 text-sm">Join Pakistan's largest verified NGO network</div>
          </div>
        </div>
      </div>
    </section>
  );
}
