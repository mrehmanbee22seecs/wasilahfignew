import React from 'react';
import { Shield, CheckCircle2, FileCheck, Users, Eye, Lock } from 'lucide-react';

interface VerificationComplianceSectionProps {
  verification: {
    legalRegistration: boolean;
    financialTransparency: boolean;
    pastProjectVerification: boolean;
    safeguardingPolicies: boolean;
    siteVisitCompleted: boolean;
  };
}

export function VerificationComplianceSection({ verification }: VerificationComplianceSectionProps) {
  const verificationItems = [
    {
      key: 'legalRegistration',
      icon: <FileCheck className="w-6 h-6" />,
      label: 'Legal Registration',
      description: 'Registered as a non-profit entity with relevant authorities',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      key: 'financialTransparency',
      icon: <Shield className="w-6 h-6" />,
      label: 'Financial Transparency',
      description: 'Annual financial reports reviewed and verified',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'pastProjectVerification',
      icon: <CheckCircle2 className="w-6 h-6" />,
      label: 'Past Project Verification',
      description: 'Previous projects reviewed for impact and legitimacy',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      key: 'safeguardingPolicies',
      icon: <Lock className="w-6 h-6" />,
      label: 'Safeguarding Policies',
      description: 'Child protection and safety protocols in place',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      key: 'siteVisitCompleted',
      icon: <Eye className="w-6 h-6" />,
      label: 'Site Visit Completed',
      description: 'Physical verification of operations conducted',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">Verification & Compliance</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          Wasilah conducts thorough verification of all partner NGOs. Each check below has been completed 
          to ensure this organization meets our standards for legitimacy, transparency, and operational excellence.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {verificationItems.map((item) => {
            const isVerified = verification[item.key as keyof typeof verification];
            return (
              <div
                key={item.key}
                className={`bg-white rounded-xl border-2 ${
                  isVerified ? 'border-slate-200' : 'border-slate-100 opacity-60'
                } p-6 transition-all`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                    {item.icon}
                  </div>
                  {isVerified && (
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-slate-900 mb-2">{item.label}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {isVerified && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emphasis Note */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-slate-900 mb-2">Checked, Not Approved Blindly</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                Wasilah's verification process involves legal document review, financial audits, 
                reference checks, and when possible, on-site visits. We maintain ongoing monitoring 
                throughout all partnerships to ensure continued compliance with our standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
