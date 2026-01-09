import React from 'react';
import { ArrowRight, Users, Clock, Building2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(45, 212, 191) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 mb-6">
              <span>Pakistan's Premier CSR Platform</span>
            </div>

            <h1 className="text-slate-900 mb-6 leading-tight">
              Corporate Social Responsibility That Creates <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Real Impact</span>
            </h1>

            <p className="text-slate-600 mb-8 leading-relaxed max-w-xl text-lg">
              Wasilah connects companies with skilled student volunteers, NGOs, and meaningful 
              social projects — enabling high-value CSR activation with measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all group">
                Explore CSR Solutions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all bg-white">
                Book a Consultation
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-teal-600 mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-slate-900 mb-1">5,240+</div>
                <div className="text-slate-500 text-sm">Volunteers Engaged</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-slate-900 mb-1">45,000+</div>
                <div className="text-slate-500 text-sm">CSR Hours Delivered</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-violet-600 mb-2">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-slate-900 mb-1">180+</div>
                <div className="text-slate-500 text-sm">NGOs Supported</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder Hero Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 via-blue-100 to-violet-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-teal-600" />
                  </div>
                  <p className="text-slate-600">Corporate + Students + Community Collaboration</p>
                  <p className="text-slate-500 text-sm mt-2">Hero Image Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-200 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <div className="text-slate-900">Impact Verified</div>
                  <div className="text-slate-500 text-sm">Real Results</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-slate-200 hidden lg:block">
              <div className="text-slate-500 text-sm mb-1">Active Projects</div>
              <div className="text-slate-900">48</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
