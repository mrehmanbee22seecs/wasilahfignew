import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Shield, Users, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  mode?: 'view' | 'accept'; // 'view' = just reading, 'accept' = must accept to continue
}

export function TermsModal({ isOpen, onClose, onAccept, mode = 'view' }: TermsModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [canAccept, setCanAccept] = useState(mode === 'view');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && mode === 'accept') {
      setHasScrolled(false);
      setCanAccept(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollThreshold = element.scrollHeight - element.clientHeight - 50;
    
    if (element.scrollTop >= scrollThreshold && !hasScrolled) {
      setHasScrolled(true);
      setCanAccept(true);
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    handleClose();
  };

  const handleClose = () => {
    setHasScrolled(false);
    setCanAccept(mode === 'view');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="terms-title" className="text-2xl font-semibold text-slate-900 mb-1">
                Terms & Conditions
              </h2>
              <p className="text-slate-600 text-sm">
                Last updated: January 7, 2024
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Scroll Indicator (only in accept mode) */}
        {mode === 'accept' && !canAccept && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-amber-900 text-sm">
              Please scroll to the bottom to continue
            </p>
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-6 text-slate-700"
          onScroll={handleScroll}
        >
          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Introduction</h3>
              <p className="text-sm leading-relaxed mb-3">
                Welcome to Wasilah ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
              </p>
              <p className="text-sm leading-relaxed">
                Wasilah is a CSR (Corporate Social Responsibility) platform connecting Pakistani corporates with student volunteers, NGOs, and impact projects. Our mission is to facilitate meaningful partnerships and drive social impact across Pakistan.
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Definitions</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>"Platform"</strong> refers to the Wasilah website and all associated services.</li>
                <li><strong>"User"</strong> refers to any individual or organization accessing the Platform.</li>
                <li><strong>"Corporate"</strong> refers to business entities seeking CSR partnerships.</li>
                <li><strong>"NGO"</strong> refers to registered non-profit organizations on the Platform.</li>
                <li><strong>"Volunteer"</strong> refers to individuals participating in CSR activities.</li>
                <li><strong>"Project"</strong> refers to any CSR initiative listed on the Platform.</li>
              </ul>
            </section>

            {/* Eligibility */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Eligibility</h3>
              <p className="text-sm leading-relaxed mb-3">
                To use Wasilah, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Be at least 18 years of age</li>
                <li>Have the legal authority to enter into binding agreements</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>For NGOs: Be a legally registered non-profit organization in Pakistan</li>
                <li>For Corporates: Be a legally registered business entity</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Account Registration & Security</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>4.1 Registration:</strong> You must create an account to access most Platform features. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mb-3">
                <li>Provide accurate, current, and complete information</li>
                <li>Update your information to maintain its accuracy</li>
                <li>Maintain one account per user or organization</li>
                <li>Not share your account with others</li>
              </ul>
              <p className="text-sm leading-relaxed mb-3">
                <strong>4.2 Account Security:</strong> You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Maintaining the confidentiality of your password</li>
                <li>All activities that occur under your account</li>
                <li>Immediately notifying us of unauthorized access</li>
              </ul>
            </section>

            {/* User Conduct */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">5. User Conduct</h3>
              <p className="text-sm leading-relaxed mb-3">
                You agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use the Platform for unauthorized commercial purposes</li>
                <li>Attempt to interfere with Platform security or functionality</li>
                <li>Scrape, data mine, or use automated tools without permission</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            {/* NGO Verification */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">6. NGO Verification Process</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>6.1 Verification Requirements:</strong> NGOs must undergo our verification process, which includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mb-3">
                <li>Legal registration verification with SECP or relevant authorities</li>
                <li>Financial transparency audit and annual report review</li>
                <li>Past project documentation and beneficiary verification</li>
                <li>Reference checks with previous partners</li>
                <li>On-site visits (when deemed necessary)</li>
                <li>Ongoing compliance monitoring</li>
              </ul>
              <p className="text-sm leading-relaxed">
                <strong>6.2 Verification Badge:</strong> Verified NGOs receive a "Verified by Wasilah" badge. We reserve the right to revoke verification at any time if standards are not maintained.
              </p>
            </section>

            {/* Projects & Partnerships */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">7. Projects & Partnerships</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>7.1 Project Listings:</strong> Organizations listing projects agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mb-3">
                <li>Provide accurate project descriptions and requirements</li>
                <li>Deliver on commitments made to partners and volunteers</li>
                <li>Maintain transparent financial reporting</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="text-sm leading-relaxed">
                <strong>7.2 Platform Role:</strong> Wasilah acts as a facilitator. We are not a party to agreements between users and do not guarantee project outcomes or partnership success.
              </p>
            </section>

            {/* Payment & Fees */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">8. Payment & Fees</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>8.1 Platform Fees:</strong> Certain services may require payment. Fees will be clearly disclosed before you incur any charges.
              </p>
              <p className="text-sm leading-relaxed mb-3">
                <strong>8.2 Payment Processing:</strong> Payments are processed through third-party providers. You agree to their terms and conditions.
              </p>
              <p className="text-sm leading-relaxed">
                <strong>8.3 Refunds:</strong> Fees are generally non-refundable except as required by law or at our discretion.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">9. Intellectual Property</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>9.1 Platform Content:</strong> All content on the Platform (logos, designs, text, code) is owned by Wasilah or our licensors and protected by copyright and trademark laws.
              </p>
              <p className="text-sm leading-relaxed mb-3">
                <strong>9.2 User Content:</strong> You retain ownership of content you submit but grant us a worldwide, royalty-free license to use, display, and distribute it in connection with the Platform.
              </p>
              <p className="text-sm leading-relaxed">
                <strong>9.3 Trademarks:</strong> "Wasilah" and our logo are trademarks. You may not use them without our written permission.
              </p>
            </section>

            {/* Privacy & Data Protection */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">10. Privacy & Data Protection</h3>
              <p className="text-sm leading-relaxed mb-3">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Platform, you consent to our data practices as described in the Privacy Policy.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-900 text-sm font-medium mb-1">Data Security</p>
                    <p className="text-blue-700 text-sm">
                      We implement industry-standard security measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">11. Disclaimers</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>11.1 "AS IS" Service:</strong> The Platform is provided "as is" without warranties of any kind, express or implied.
              </p>
              <p className="text-sm leading-relaxed mb-3">
                <strong>11.2 No Guarantee:</strong> We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy or reliability of Platform content</li>
                <li>Results from using the Platform</li>
                <li>Success of partnerships or projects</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">12. Limitation of Liability</h3>
              <p className="text-sm leading-relaxed mb-3">
                To the maximum extent permitted by law, Wasilah shall not be liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or goodwill</li>
                <li>Damages arising from user interactions or partnerships</li>
                <li>Third-party actions or content</li>
              </ul>
              <p className="text-sm leading-relaxed mt-3">
                Our total liability shall not exceed the fees you paid in the past 12 months, or PKR 10,000, whichever is greater.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">13. Indemnification</h3>
              <p className="text-sm leading-relaxed">
                You agree to indemnify and hold Wasilah harmless from any claims, damages, losses, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of others</li>
                <li>Content you submit to the Platform</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">14. Termination</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>14.1 By You:</strong> You may terminate your account at any time through account settings.
              </p>
              <p className="text-sm leading-relaxed mb-3">
                <strong>14.2 By Us:</strong> We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mb-3">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or illegal activity</li>
                <li>Pose a security or legal risk</li>
                <li>Request account closure</li>
              </ul>
              <p className="text-sm leading-relaxed">
                <strong>14.3 Effect:</strong> Upon termination, your right to use the Platform ceases immediately. Provisions that should survive termination will remain in effect.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">15. Dispute Resolution</h3>
              <p className="text-sm leading-relaxed mb-3">
                <strong>15.1 Governing Law:</strong> These Terms are governed by the laws of Pakistan.
              </p>
              <p className="text-sm leading-relaxed mb-3">
                <strong>15.2 Arbitration:</strong> Disputes shall first be attempted to be resolved through good faith negotiation. If unresolved, disputes shall be settled by arbitration in Karachi, Pakistan.
              </p>
              <p className="text-sm leading-relaxed">
                <strong>15.3 Jurisdiction:</strong> You agree to submit to the jurisdiction of courts in Karachi, Pakistan for any disputes.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">16. Changes to Terms</h3>
              <p className="text-sm leading-relaxed">
                We may update these Terms at any time. We will notify you of significant changes via email or Platform notification. Continued use after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">17. Contact Us</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-slate-900 font-medium mb-2">Questions about these Terms?</p>
                    <p className="text-slate-700">
                      <strong>Email:</strong> legal@wasilah.pk<br />
                      <strong>Phone:</strong> +92-21-XXXX-XXXX<br />
                      <strong>Address:</strong> Wasilah CSR Platform, Karachi, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="mb-4">
              <div className="bg-teal-50 border-2 border-teal-300 rounded-lg p-4">
                <p className="text-teal-900 text-sm font-medium">
                  ✓ By creating a Wasilah account, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {mode === 'view' ? (
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={!canAccept}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canAccept ? 'I Accept' : 'Scroll to Accept'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
