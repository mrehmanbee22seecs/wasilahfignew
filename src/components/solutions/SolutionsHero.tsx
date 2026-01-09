import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface SolutionsHeroProps {
  onRequestPilot: () => void;
  onSeeSolutions: () => void;
}

export function SolutionsHero({ onRequestPilot, onSeeSolutions }: SolutionsHeroProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-white overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(20 184 166) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(20 184 166) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h1 className="text-slate-900 mb-6">
              Enterprise CSR Operations — From Plan to Proof
            </h1>
            
            <h2 className="text-slate-700 mb-8">
              We handle the full CSR delivery chain—strategy, vetting, execution, and audit-ready reporting—so your team can focus on core business.
            </h2>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onRequestPilot}
                data-analytics="solutions_hero_request_pilot"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Request Pilot
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={onSeeSolutions}
                data-analytics="solutions_hero_see_solutions"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all"
              >
                See Solutions
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-slate-200">
              <div>
                <div className="text-slate-900 text-2xl">127</div>
                <div className="text-slate-600 text-sm">Pilots Run</div>
              </div>
              <div>
                <div className="text-slate-900 text-2xl">43</div>
                <div className="text-slate-600 text-sm">Corporate Partners</div>
              </div>
              <div>
                <div className="text-slate-900 text-2xl">89%</div>
                <div className="text-slate-600 text-sm">Renewal Rate</div>
              </div>
            </div>
          </div>

          {/* Right: Hero Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl p-12 shadow-xl relative group cursor-pointer">
              {/* Video Thumbnail Placeholder */}
              <div className="aspect-video bg-white rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-blue-600/20" />
                <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-teal-600 ml-1" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-slate-900 text-sm">See how we delivered a 50-volunteer tree plantation in 2 weeks</div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-600 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
