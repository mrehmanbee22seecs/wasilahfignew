import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function ContactInfo() {
  const contactDetails = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: '+92-XXX-XXXXXXX',
      link: 'tel:+92XXXXXXXXX'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'hello@wasilah.org',
      link: 'mailto:hello@wasilah.org'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Office',
      value: 'Karachi, Pakistan',
      link: 'https://maps.google.com/?q=Karachi,Pakistan'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Support Hours',
      value: 'Mon–Fri, 9 AM – 6 PM PKT',
      link: undefined
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 p-8 sticky top-6">
      <h3 className="text-slate-900 mb-6">Contact Details</h3>
      
      <div className="space-y-6">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
              {detail.icon}
            </div>
            <div className="flex-1">
              <div className="text-slate-600 text-sm mb-1">{detail.label}</div>
              {detail.link ? (
                <a
                  href={detail.link}
                  target={detail.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-slate-900 hover:text-teal-600 transition-colors"
                >
                  {detail.value}
                </a>
              ) : (
                <div className="text-slate-900">{detail.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Response Time Note */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-slate-600">
            Response time: <span className="text-slate-900">within 48 hours</span>
          </span>
        </div>
      </div>
    </div>
  );
}
