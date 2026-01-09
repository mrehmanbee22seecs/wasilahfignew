import React from 'react';
import { UserPlus, Search, Award } from 'lucide-react';

export function VolunteerHeader() {
  return (
    <section className="relative pt-32 pb-24 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 overflow-hidden">
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
              <Award className="w-4 h-4" />
              <span>Student Volunteer Program</span>
            </div>

            <h1 className="text-white mb-6 leading-tight">
              Empowering Students Through<br />
              <span className="text-emerald-100">Real-World CSR Experience</span>
            </h1>

            <p className="text-emerald-50 mb-10 leading-relaxed text-lg max-w-xl">
              Wasilah enables students to volunteer in corporate-backed CSR initiatives, 
              gain experience, build skills, and contribute to national impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-emerald-50 transition-all shadow-xl group">
                <UserPlus className="w-5 h-5" />
                Register as Volunteer
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                <Search className="w-5 h-5" />
                View Opportunities
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white">Diverse Student Volunteers</p>
                  <p className="text-emerald-100 text-sm mt-2">Hero Image Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 border border-emerald-200 hidden lg:block">
              <div className="text-emerald-600 text-sm mb-2">Active Volunteers</div>
              <div className="text-slate-900 text-2xl">5,240+</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-2xl p-6 border border-teal-200 hidden lg:block">
              <div className="text-teal-600 text-sm mb-2">Universities</div>
              <div className="text-slate-900 text-2xl">28</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
