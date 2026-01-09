import React from 'react';
import { FileText, Calendar, Target } from 'lucide-react';

export function CSRHeader() {
  return (
    <section className="relative pt-32 pb-24 bg-gradient-to-br from-teal-600 via-blue-600 to-teal-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white mb-6">
              <Target className="w-4 h-4" />
              <span>Corporate CSR Solutions</span>
            </div>

            <h1 className="text-white mb-6 leading-tight">
              CSR Solutions Built for<br />
              <span className="text-teal-200">Corporate Impact</span>
            </h1>

            <p className="text-teal-50 mb-10 leading-relaxed text-lg max-w-xl">
              Wasilah delivers scalable, measurable, and high-quality CSR programs powered by 
              student volunteers and NGO partnerships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-all shadow-xl group">
                <FileText className="w-5 h-5" />
                Request Proposal
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                <Calendar className="w-5 h-5" />
                Book Consultation
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white">Professional CSR Impact</p>
                  <p className="text-teal-100 text-sm mt-2">Hero Image Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border border-teal-200 hidden lg:block">
              <div className="text-teal-600 text-sm mb-2">Success Rate</div>
              <div className="text-slate-900 text-2xl">98%</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-2xl p-6 border border-blue-200 hidden lg:block">
              <div className="text-blue-600 text-sm mb-2">Active Programs</div>
              <div className="text-slate-900 text-2xl">156</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
