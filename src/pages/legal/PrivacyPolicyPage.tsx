import React from 'react';
import { Shield, Lock, Eye, Database, Mail, ArrowLeft } from 'lucide-react';
import { BRAND } from '../../constants/brand';

interface PrivacyPolicyPageProps {
  onBack?: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const lastUpdated = 'February 1, 2026';
  
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Shield,
      content: `Welcome to Wasilah. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.

By using Wasilah, you agree to the collection and use of information in accordance with this policy.`
    },
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      icon: Database,
      content: `We collect information that you provide directly to us, including:

• Account Information: Name, email address, phone number, organization details, and password when you register for an account.

• Profile Information: Job title, skills, interests, profile photo, and biographical information you choose to provide.

• Organization Information: For corporates and NGOs, we collect organization name, registration details, industry sector, and CSR preferences.

• Transaction Information: Records of donations, volunteer hours, project participation, and payment information.

• Communications: Messages you send through our platform, including correspondence with NGOs, volunteers, and our support team.

• Usage Data: Information about how you interact with our platform, including pages visited, features used, and time spent.`
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Match volunteers with appropriate opportunities
• Facilitate connections between corporates and NGOs
• Process transactions and send related information
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions and other illegal activities
• Personalize your experience on our platform`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: `We implement appropriate technical and organizational security measures to protect your personal information, including:

• Encryption: All data transmitted between your browser and our servers is encrypted using TLS/SSL.

• Access Controls: Only authorized personnel have access to personal data, and they are bound by confidentiality obligations.

• Regular Audits: We conduct regular security assessments and penetration testing.

• Data Minimization: We only collect and retain data that is necessary for the purposes described in this policy.

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.`
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: Shield,
      content: `You have the following rights regarding your personal information:

• Access: You can request a copy of the personal information we hold about you.

• Correction: You can request that we correct any inaccurate or incomplete information.

• Deletion: You can request that we delete your personal information, subject to certain exceptions.

• Portability: You can request a copy of your data in a machine-readable format.

• Opt-out: You can opt out of receiving marketing communications at any time.

To exercise any of these rights, please contact us at privacy@wasilah.pk.`
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: Mail,
      content: `If you have any questions about this Privacy Policy or our data practices, please contact us:

Email: privacy@wasilah.pk
Address: Wasilah CSR Platform, Karachi, Pakistan

We will respond to your inquiry within 30 days.`
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
            <Shield className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: BRAND.navy }}>
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Table of Contents */}
        <div 
          className="bg-white rounded-xl p-6 mb-8 border"
          style={{ borderColor: `${BRAND.navy}15` }}
        >
          <h2 className="font-semibold mb-4" style={{ color: BRAND.navy }}>
            Table of Contents
          </h2>
          <nav className="space-y-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors hover:bg-gray-50"
              >
                <span 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: BRAND.teal }}
                >
                  {index + 1}
                </span>
                <span style={{ color: BRAND.navy }}>{section.title}</span>
              </a>
            ))}
          </nav>
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

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm" style={{ color: BRAND.gray500 }}>
          <p>
            This Privacy Policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
        </div>
      </div>
    </div>
  );
}
