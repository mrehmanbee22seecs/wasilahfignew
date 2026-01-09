import React from 'react';
import { Rocket, MessageCircle } from 'lucide-react';

interface FinalCTAProps {
  onApply: () => void;
}

export function FinalCTA({ onApply }: FinalCTAProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 via-blue-50 to-violet-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-slate-900 mb-4">
            Ready to Make an Impact?
          </h2>
          
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Join this opportunity and contribute to meaningful change. 
            Your skills and time can create lasting impact in the community.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onApply}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all text-lg"
          >
            Apply Now
          </button>
          
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all">
            <MessageCircle className="w-5 h-5" />
            Have Questions? Contact Wasilah
          </button>
        </div>

        {/* Small Note */}
        <p className="text-slate-500 text-sm mt-8">
          By applying, you agree to Wasilah's Terms of Service and Privacy Policy
        </p>
      </div>
    </section>
  );
}
