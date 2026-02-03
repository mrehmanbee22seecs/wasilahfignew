import React from 'react';
import { FileText, Users, AlertTriangle, Scale, Ban, ArrowLeft } from 'lucide-react';
import { BRAND } from '../../constants/brand';

interface TermsOfServicePageProps {
  onBack?: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const lastUpdated = 'February 1, 2026';
  
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: `By accessing or using the Wasilah platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service, including corporates, NGOs, and volunteers.`
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: Users,
      content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.

You are responsible for:
• Safeguarding the password you use to access the Service
• Any activities or actions under your account
• Notifying us immediately of any unauthorized access

You may not use as a username the name of another person or entity that is not lawfully available for use, or a name that is subject to any rights of another person without appropriate authorization.`
    },
    {
      id: 'user-roles',
      title: 'User Roles and Responsibilities',
      icon: Scale,
      content: `Wasilah serves three primary user types, each with specific responsibilities:

Corporates:
• Provide accurate information about CSR initiatives
• Honor commitments made to NGOs and volunteers
• Process payments in a timely manner
• Maintain professional conduct in all interactions

NGOs:
• Maintain valid registration and documentation
• Provide accurate project information and impact metrics
• Properly manage volunteer assignments
• Use funds and resources as specified

Volunteers:
• Complete assigned tasks with reasonable care
• Maintain accurate records of volunteer hours
• Communicate promptly with NGOs regarding availability
• Adhere to the code of conduct of partner organizations`
    },
    {
      id: 'prohibited',
      title: 'Prohibited Activities',
      icon: Ban,
      content: `You agree not to engage in any of the following prohibited activities:

• Copying, distributing, or disclosing any part of the Service in any medium
• Using any automated system to access the Service
• Transmitting spam, chain letters, or other unsolicited email
• Attempting to interfere with or compromise system integrity
• Collecting user information without consent
• Impersonating another user or organization
• Using the Service for any illegal or unauthorized purpose
• Uploading false, misleading, or fraudulent content
• Harassment, discrimination, or hate speech of any kind`
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: AlertTriangle,
      content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.

All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: Scale,
      content: `In no event shall Wasilah, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:

• Loss of profits, data, use, goodwill, or other intangible losses
• Resulting from your access to or use of or inability to access or use the Service
• Any conduct or content of any third party on the Service
• Any content obtained from the Service
• Unauthorized access, use, or alteration of your transmissions or content

The foregoing limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction.`
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: BRAND.creamLight }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
            style={{ color: BRAND.navy }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <FileText className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: BRAND.navy }}>
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Important Notice */}
        <div 
          className="bg-white rounded-xl p-6 mb-8 border-l-4"
          style={{ borderColor: BRAND.teal, backgroundColor: `${BRAND.teal}08` }}
        >
          <p className="font-medium mb-2" style={{ color: BRAND.navy }}>
            Important Notice
          </p>
          <p style={{ color: BRAND.gray600 }}>
            Please read these Terms of Service carefully before using the Wasilah platform. 
            By using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-xl p-8 border"
                style={{ borderColor: `${BRAND.navy}15` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${BRAND.teal}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: BRAND.teal }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: BRAND.navy }}>
                    {section.title}
                  </h2>
                </div>
                <div 
                  className="prose prose-gray max-w-none"
                  style={{ color: BRAND.gray600 }}
                >
                  {section.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Contact Section */}
        <div 
          className="mt-12 bg-white rounded-xl p-8 border text-center"
          style={{ borderColor: `${BRAND.navy}15` }}
        >
          <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND.navy }}>
            Questions about these Terms?
          </h3>
          <p className="mb-4" style={{ color: BRAND.gray600 }}>
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <a 
            href="mailto:legal@wasilah.pk"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.navy }}
          >
            Contact Legal Team
          </a>
        </div>
      </div>
    </div>
  );
}
