import React from 'react';
import { Briefcase, ArrowLeft } from 'lucide-react';

interface NGOFooterCTAProps {
  ngoName: string;
  onViewOpportunities: () => void;
  onBackToOpportunities: () => void;
}

export function NGOFooterCTA({ ngoName, onViewOpportunities, onBackToOpportunities }: NGOFooterCTAProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 via-blue-50 to-violet-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-slate-900 mb-4">
            Explore Opportunities With {ngoName}
          </h2>
          
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Ready to make an impact? View available volunteer opportunities or continue exploring other organizations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onViewOpportunities}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all"
          >
            View Open Opportunities
          </button>
          
          <button 
            onClick={onBackToOpportunities}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Opportunities
          </button>
        </div>
      </div>
    </section>
  );
}
