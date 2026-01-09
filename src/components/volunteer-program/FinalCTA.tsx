import React from 'react';
import { UserPlus, Search, ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
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
          Ready to Volunteer and<br />
          Make a Lasting Impact?
        </h2>

        <p className="text-emerald-50 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
          Join 5,000+ students across Pakistan who are building their careers while creating real social change. 
          Your journey to meaningful volunteering starts here.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 rounded-lg hover:bg-emerald-50 transition-all shadow-2xl group">
            <UserPlus className="w-6 h-6" />
            Create Account
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            <Search className="w-6 h-6" />
            Browse Opportunities
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Free to Join</div>
            <div className="text-emerald-100 text-sm">No fees, no hidden costs—start volunteering today</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Verified Certificates</div>
            <div className="text-emerald-100 text-sm">Recognized credentials from corporates & NGOs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-white mb-2">Flexible Schedule</div>
            <div className="text-emerald-100 text-sm">Choose opportunities that fit your availability</div>
          </div>
        </div>
      </div>
    </section>
  );
}
