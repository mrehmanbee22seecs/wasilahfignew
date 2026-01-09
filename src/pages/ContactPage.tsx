import React, { useState } from 'react';
import { ContactHero } from '../components/contact/ContactHero';
import { TrustPillars } from '../components/contact/TrustPillars';
import { ContactInfo } from '../components/contact/ContactInfo';
import { ContactFAQ } from '../components/contact/ContactFAQ';
import { FooterCTA } from '../components/contact/FooterCTA';
import { ProposalForm } from '../components/proposal/ProposalForm';
import { ProposalModal } from '../components/proposal/ProposalModal';

export function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ContactHero 
        onRequestProposal={openModal}
        onScheduleCall={() => window.open('/schedule', '_blank')}
      />

      {/* Why Work With Wasilah */}
      <TrustPillars />

      {/* Form + Contact Info Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Proposal Form (2/3) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border-2 border-slate-200 p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-slate-900 mb-3">
                    Request a Proposal
                  </h2>
                  <p className="text-slate-600">
                    Fill out the form below and our CSR specialist will review your request and respond within 48 hours.
                  </p>
                </div>
                <ProposalForm />
              </div>
            </div>

            {/* Right: Contact Card (1/3) */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <ContactFAQ />

      {/* Footer CTA */}
      <FooterCTA onRequestProposal={openModal} />

      {/* Proposal Modal */}
      <ProposalModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        origin="footer"
      />
    </div>
  );
}
