import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function SolutionsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do you vet NGO partners?",
      answer: "Our 6-step vetting process includes: (1) Legal registration verification with SECP/government authorities, (2) Financial transparency audit including review of audited accounts, (3) Past project documentation and beneficiary verification, (4) Reference checks with previous corporate partners, (5) On-site visits to assess operational capacity, and (6) Ongoing performance monitoring. Only NGOs that pass all checks receive our 'Verified by Wasilah' badge."
    },
    {
      question: "What are your payment terms?",
      answer: "Payment terms vary by engagement model: For Pilots, we require 50% advance and 50% upon delivery. For Project-based work, we bill monthly based on milestones. For Retainer clients, we invoice at the start of each month. All invoices include detailed expense breakdowns. We accept bank transfers, cheques, and can set up ACH/standing orders for retainer clients."
    },
    {
      question: "How do you ensure volunteer and beneficiary safeguarding?",
      answer: "We take safeguarding seriously: All NGO partners must have child protection and code of conduct policies. Volunteers receive pre-project briefings on appropriate behavior and reporting mechanisms. Projects involving minors require guardian consent and supervised interactions. We conduct surprise site visits. Any safeguarding concerns trigger immediate investigation and project suspension if needed. Post-project surveys include safeguarding feedback."
    },
    {
      question: "What's the typical timeline from kickoff to project completion?",
      answer: "Timeline depends on project complexity: Simple one-day volunteering events: 2-3 weeks. Standard CSR projects (tree plantation, school renovation): 4-6 weeks. Multi-city or complex programs: 8-12 weeks. Rush projects can be accommodated with premium pricing. We provide a detailed timeline during the planning phase and send weekly progress updates."
    },
    {
      question: "Can we choose our own NGO partner?",
      answer: "Yes, absolutely. If you have an existing NGO relationship, we can work with them—provided they pass our vetting process. We'll conduct the same due diligence checks. If they don't meet our standards, we'll provide feedback and suggest alternatives from our verified network. Many clients prefer our pre-vetted partners to save time and reduce risk."
    },
    {
      question: "What if a project doesn't go as planned?",
      answer: "We have contingency protocols: For weather delays (common in outdoor projects), we have backup dates and indoor alternatives. For NGO underperformance, we have standby partners ready. For volunteer no-shows, we maintain waitlists. If a project fundamentally fails due to our error, we offer a redo at no cost or partial refund. We carry professional liability insurance. Post-project debriefs identify lessons learned."
    },
    {
      question: "How detailed is the impact reporting?",
      answer: "Very detailed. Standard impact reports include: Executive summary with key metrics, project narrative with photos and quotes, beneficiary demographics and reach, volunteer engagement data, budget utilization breakdown, SDG alignment mapping, and media/social proof. Premium packages include video documentation, beneficiary testimonials, stakeholder interviews, and board-ready presentation decks."
    },
    {
      question: "Do you work outside of Karachi?",
      answer: "Yes. While our HQ is in Karachi, we execute projects across Pakistan including Lahore, Islamabad, Multan, Peshawar, and smaller cities. Our network includes 200+ verified NGOs nationwide. For remote locations, we conduct virtual monitoring and partner with local coordinators. Multi-city programs are common for corporates with distributed teams."
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
                data-analytics="faq_click"
                data-faq-question={faq.question}
              >
                <h3 className="text-slate-900 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-1 duration-150">
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
