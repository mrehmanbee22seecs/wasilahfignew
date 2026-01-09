import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How long does the verification process take?',
      answer: 'The verification process typically takes 7-14 business days from the time you submit your complete application. This includes document review, background checks, and approval. High-priority or complex cases may take slightly longer.'
    },
    {
      question: 'Is there any cost to join Wasilah as an NGO partner?',
      answer: 'No, there is absolutely no cost to register or join Wasilah as an NGO partner. Our platform is free for verified NGOs. We operate on a corporate partnership model where companies fund the platform operations.'
    },
    {
      question: 'Do NGOs receive guaranteed funding once verified?',
      answer: 'Verification grants you access to our platform and corporate CSR opportunities, but funding is project-based and depends on corporate partner selection. However, our track record shows that 85% of verified NGOs receive at least one project within their first 3 months.'
    },
    {
      question: 'How does Wasilah select NGOs for corporate projects?',
      answer: 'Selection is based on multiple factors: your NGO\'s expertise and past work, alignment with the corporate\'s CSR goals, geographic coverage, operational capacity, and project requirements. We use a transparent matching algorithm and corporate partners make final selections.'
    },
    {
      question: 'Can small or new NGOs apply?',
      answer: 'Yes! While we require evidence of 2-3 past projects, we welcome both established and emerging NGOs. Newer organizations can demonstrate capacity through smaller community projects, pilot initiatives, or volunteer-driven activities.'
    },
    {
      question: 'What support does Wasilah provide during project execution?',
      answer: 'We provide volunteer coordination, logistics support, reporting templates, impact measurement tools, and a dedicated operations team. You focus on ground execution while we handle corporate communications and administrative requirements.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600">
            Common questions from NGO partners about joining Wasilah
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h4 className="text-slate-900 pr-4">{faq.question}</h4>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            Contact Our NGO Support Team
          </button>
        </div>
      </div>
    </section>
  );
}
