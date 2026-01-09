import React from 'react';
import { Calendar, FileText, Briefcase } from 'lucide-react';

export function CorporateHero() {
  const sampleClients = [
    'Engro Corporation',
    'Lucky Cement',
    'HBL',
    'Systems Limited',
    'Unilever Pakistan',
    'Fauji Foundation'
  ];

  return (
    <section className="relative pt-32 pb-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Abstract Shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white mb-6">
              <Briefcase className="w-4 h-4" />
              <span>Corporate CSR Solutions</span>
            </div>

            <h1 className="text-white mb-6 leading-tight text-5xl">
              End-to-End CSR Execution<br />
              <span className="text-blue-300">for Pakistan's Leading Corporates</span>
            </h1>

            <p className="text-slate-200 mb-10 leading-relaxed text-lg max-w-xl">
              Wasilah handles planning, execution, reporting, volunteer mobilization, NGO vetting, 
              and impact measurement—so your teams stay focused while your CSR delivers real results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-xl group">
                <Calendar className="w-5 h-5" />
                Book a CSR Strategy Call
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                <FileText className="w-5 h-5" />
                Request Proposal
              </button>
            </div>

            {/* Trusted By */}
            <div>
              <p className="text-slate-400 text-sm mb-4">Trusted by Leading Pakistani Corporates</p>
              <div className="flex flex-wrap gap-3">
                {sampleClients.slice(0, 4).map((client, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-slate-300 text-sm"
                  >
                    {client}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-600/20 to-teal-600/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white">Corporate CSR Partnership</p>
                  <p className="text-blue-200 text-sm mt-2">Hero Image Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating Metrics */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border border-blue-200 hidden lg:block">
              <div className="text-blue-600 text-sm mb-2">CSR Events Executed</div>
              <div className="text-slate-900 text-2xl">240+</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-2xl p-6 border border-teal-200 hidden lg:block">
              <div className="text-teal-600 text-sm mb-2">Lives Impacted</div>
              <div className="text-slate-900 text-2xl">300K+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
