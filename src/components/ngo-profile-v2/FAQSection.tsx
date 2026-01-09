import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'How is this NGO verified?',
      answer: 'Wasilah conducts a comprehensive verification process including legal registration checks, financial transparency reviews, reference verification, and when possible, on-site visits. We review organizational documents, past project records, and interview key stakeholders before approving any NGO partner.'
    },
    {
      question: 'Who manages volunteers during the project?',
      answer: 'Day-to-day volunteer management is handled by the NGO\'s designated coordinator. However, Wasilah provides ongoing oversight, conducts check-ins with volunteers, and is available to address any concerns or issues that arise during the engagement period.'
    },
    {
      question: 'Is this opportunity supervised?',
      answer: 'Yes. All volunteer opportunities listed through Wasilah are supervised by the partner NGO and monitored by our team. We maintain regular communication with both volunteers and NGOs to ensure a safe, productive, and meaningful experience for all parties.'
    },
    {
      question: 'What happens if I have concerns during volunteering?',
      answer: 'Wasilah provides support throughout your volunteer experience. You can contact our team at any time via email, phone, or through the platform. We take all concerns seriously and will work with you and the NGO to address any issues promptly and professionally.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
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
              className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
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
