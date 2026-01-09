import React from 'react';
import { Send } from 'lucide-react';

interface FooterCTAProps {
  onRequestProposal: () => void;
}

export function FooterCTA({ onRequestProposal }: FooterCTAProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-white mb-4">
          Ready to start?
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Request a proposal and we'll get back within 48 hours with a customized plan.
        </p>
        <button
          onClick={onRequestProposal}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-lg hover:shadow-2xl transition-all hover:scale-105"
        >
          <Send className="w-5 h-5" />
          Request a Proposal
        </button>
      </div>
    </section>
  );
}
