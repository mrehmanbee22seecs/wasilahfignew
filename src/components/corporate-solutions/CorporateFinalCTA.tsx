import React from 'react';
import { Calendar, FileText, ArrowRight, Target } from 'lucide-react';

export function CorporateFinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700 relative overflow-hidden">
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

      {/* SDG Color Accents */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-green-600 via-blue-600 via-orange-600 to-pink-600 opacity-30"></div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Icon */}
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Target className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-white mb-6 leading-tight">
          Let's Build Your Next<br />
          CSR Success Story Together
        </h2>

        <p className="text-blue-50 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
          Partner with Pakistan's leading CSR operations company. We handle the complexity, 
          you get the impact, compliance, and recognition.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all shadow-2xl group">
            <Calendar className="w-6 h-6" />
            Book Consultation
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            <FileText className="w-6 h-6" />
            Request Proposal
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">24-48 Hours</div>
            <div className="text-blue-100 text-sm">First proposal delivery</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">180+ NGOs</div>
            <div className="text-blue-100 text-sm">Verified partner network</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Full Compliance</div>
            <div className="text-blue-100 text-sm">Audit-ready reporting</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">28 Cities</div>
            <div className="text-blue-100 text-sm">Pan-Pakistan coverage</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-blue-100 text-sm">
            Questions? Contact our Corporate Solutions team at{' '}
            <a href="mailto:corporate@wasilah.pk" className="text-white underline hover:no-underline">
              corporate@wasilah.pk
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
