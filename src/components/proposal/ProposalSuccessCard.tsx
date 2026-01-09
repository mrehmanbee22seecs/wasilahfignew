import React from 'react';
import { CheckCircle, Calendar, FileText } from 'lucide-react';

interface ProposalSuccessCardProps {
  companyName: string;
  onScheduleCall?: () => void;
  onDownloadReport?: () => void;
}

export function ProposalSuccessCard({ 
  companyName, 
  onScheduleCall,
  onDownloadReport 
}: ProposalSuccessCardProps) {
  return (
    <div className="text-center py-12 px-6">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      {/* Title */}
      <h2 className="text-slate-900 mb-4">
        Thanks — we received your request!
      </h2>

      {/* Body */}
      <p className="text-slate-700 text-lg mb-2">
        Hi {companyName ? `from ${companyName}` : 'there'}! Our CSR specialist will review and reply within 48 hours.
      </p>
      
      <p className="text-slate-600 mb-8">
        Meanwhile, schedule a 15-min discovery call or view our sample impact reports.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <button
          onClick={onScheduleCall || (() => window.open('/schedule', '_blank'))}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Calendar className="w-5 h-5" />
          Schedule a Call
        </button>
        
        <button
          onClick={onDownloadReport || (() => window.open('#', '_blank'))}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all"
        >
          <FileText className="w-5 h-5" />
          Download Sample Report
        </button>
      </div>

      {/* Info Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-900 text-sm">
          We've sent a confirmation email to your inbox. Please check your spam folder if you don't see it.
        </p>
      </div>
    </div>
  );
}
