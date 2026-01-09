import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What's the typical timeline from proposal to project launch?",
      answer: "For most corporate CSR projects, we can go from initial proposal to project launch within 3-4 weeks. This includes NGO vetting, project planning, volunteer recruitment, and logistics setup. Smaller initiatives can launch faster (1-2 weeks), while large-scale programs may need 6-8 weeks for proper planning."
    },
    {
      question: "How do you vet NGO partners?",
      answer: "Our vetting process includes: (1) Legal registration verification with government authorities, (2) Financial transparency audit and review of annual reports, (3) Past project documentation and beneficiary verification, (4) Reference checks with previous partners, (5) On-site visits when possible, and (6) Ongoing monitoring throughout partnerships. All verified NGOs display a 'Verified by Wasilah' badge on the platform."
    },
    {
      question: "What's included in your CSR project management service?",
      answer: "We provide end-to-end project management: strategic planning aligned with your CSR goals, NGO partner identification and vetting, volunteer recruitment and coordination, logistics and on-ground execution, real-time project monitoring, impact documentation with photos and metrics, and comprehensive reporting for internal and external stakeholders. You stay involved at decision points but we handle the operational heavy lifting."
    },
    {
      question: "Can Wasilah help with ESG reporting and compliance?",
      answer: "Yes. We provide audit-ready documentation including: impact metrics mapped to UN SDGs, beneficiary data and demographics, photographic evidence of activities, volunteer hours and engagement data, financial disbursement records, and compliance documentation. Our reports are designed to meet both internal corporate requirements and external ESG reporting standards like GRI and SASB."
    },
    {
      question: "What does a typical CSR engagement cost?",
      answer: "Our pricing depends on project scope, duration, and services required. Small pilot programs start around PKR 50,000. Mid-sized corporate volunteering programs typically range PKR 200,000–1 Million. Large multi-city CSR initiatives can exceed PKR 1 Million. We work within your budget and can design phased approaches. Request a proposal to get a customized quote based on your specific needs."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-slate-900 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
