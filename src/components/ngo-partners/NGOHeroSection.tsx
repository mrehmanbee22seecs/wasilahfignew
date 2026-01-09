import React from 'react';
import { UserPlus, FileText, Handshake } from 'lucide-react';

export function NGOHeroSection() {
  return (
    <section className="relative pt-32 pb-24 bg-gradient-to-br from-blue-600 via-violet-600 to-blue-700 overflow-hidden">
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

      {/* Abstract Shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white mb-6">
              <Handshake className="w-4 h-4" />
              <span>NGO Partnership Program</span>
            </div>

            <h1 className="text-white mb-6 leading-tight">
              Partner with Wasilah and<br />
              <span className="text-blue-100">Amplify Your Social Impact</span>
            </h1>

            <p className="text-blue-50 mb-10 leading-relaxed text-lg max-w-xl">
              We connect verified NGOs with Pakistan's leading corporations to fund, support, 
              and scale community-driven initiatives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all shadow-xl group">
                <UserPlus className="w-5 h-5" />
                Register Your NGO
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                <FileText className="w-5 h-5" />
                See Requirements
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Handshake className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white">NGO Partnership Network</p>
                  <p className="text-blue-100 text-sm mt-2">Hero Image Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border border-blue-200 hidden lg:block">
              <div className="text-blue-600 text-sm mb-2">Verified NGOs</div>
              <div className="text-slate-900 text-2xl">180+</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-2xl p-6 border border-violet-200 hidden lg:block">
              <div className="text-violet-600 text-sm mb-2">Active Projects</div>
              <div className="text-slate-900 text-2xl">240+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
