import React from 'react';
import { Mail, Phone, Linkedin, Github, Globe, MessageSquare } from 'lucide-react';

interface ContactSectionProps {
  contact: {
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export function ContactSection({ contact }: ContactSectionProps) {
  const contactItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: contact.email,
      link: `mailto:${contact.email}`,
      show: true
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: contact.phone || 'Not provided',
      link: contact.phone ? `tel:${contact.phone}` : null,
      show: !!contact.phone
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      value: contact.linkedin || 'Not provided',
      link: contact.linkedin,
      show: !!contact.linkedin
    },
    {
      icon: <Github className="w-5 h-5" />,
      label: 'GitHub',
      value: contact.github || 'Not provided',
      link: contact.github,
      show: !!contact.github
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Portfolio',
      value: contact.portfolio || 'Not provided',
      link: contact.portfolio,
      show: !!contact.portfolio
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8 text-center">Get in Touch</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-slate-50 rounded-xl p-8 border-2 border-slate-200">
            <h3 className="text-slate-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              {contactItems.filter(item => item.show).map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-slate-200 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-500 text-sm mb-1">{item.label}</div>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-slate-900 hover:text-blue-600 transition-colors break-all"
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-slate-600">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Card */}
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8 border-2 border-blue-200 flex flex-col justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-slate-900 mb-3">Interested in connecting?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Send a message to discuss volunteer opportunities or collaborations
              </p>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Message Volunteer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
