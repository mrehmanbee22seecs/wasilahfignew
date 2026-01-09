import React from 'react';
import { FileText, Calendar } from 'lucide-react';

interface ContactHeroProps {
  onRequestProposal: () => void;
  onScheduleCall?: () => void;
}

export function ContactHero({ onRequestProposal, onScheduleCall }: ContactHeroProps) {
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
              Let's build impact, not paperwork.
            </h1>
            
            <h2 className="text-slate-700 mb-8">
              We handle CSR planning, vetting and delivery—so your team can focus on business.
            </h2>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRequestProposal}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <FileText className="w-5 h-5" />
                Request Proposal
              </button>
              
              <button
                onClick={onScheduleCall || (() => window.open('/schedule', '_blank'))}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Book a 15-min Call
              </button>
            </div>
          </div>

          {/* Right: Hero Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl p-12 shadow-xl">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Illustration showing team collaboration and impact measurement"
              >
                {/* People collaborating */}
                <circle cx="150" cy="120" r="40" fill="#0d9488" opacity="0.3" />
                <circle cx="250" cy="120" r="40" fill="#2563eb" opacity="0.3" />
                
                {/* Documents/Reports */}
                <rect x="100" y="180" width="200" height="100" rx="8" fill="#0d9488" opacity="0.2" />
                <rect x="110" y="190" width="180" height="4" rx="2" fill="#0d9488" opacity="0.4" />
                <rect x="110" y="200" width="140" height="4" rx="2" fill="#0d9488" opacity="0.4" />
                <rect x="110" y="210" width="160" height="4" rx="2" fill="#0d9488" opacity="0.4" />
                
                {/* Check marks */}
                <circle cx="340" cy="60" r="20" fill="#10b981" />
                <path d="M 330 60 L 335 65 L 350 50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                
                <circle cx="60" cy="220" r="15" fill="#10b981" />
                <path d="M 53 220 L 57 224 L 67 214" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
