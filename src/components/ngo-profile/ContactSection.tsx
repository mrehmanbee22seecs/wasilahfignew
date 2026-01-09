import React from 'react';
import { MapPin, Mail, Phone, Globe, Facebook, Twitter, Linkedin, Instagram, MessageSquare } from 'lucide-react';

export function ContactSection() {
  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Address',
      value: 'A-25, Block 7-8, Clifton, Karachi, Pakistan',
      link: null
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'info@tcf.org.pk',
      link: 'mailto:info@tcf.org.pk'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: '+92 21 1234 5678',
      link: 'tel:+922112345678'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Website',
      value: 'www.tcf.org.pk',
      link: 'https://www.tcf.org.pk'
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', color: 'hover:bg-pink-600' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-slate-900 mb-2">
            Contact Information
          </h2>
          <p className="text-slate-600">
            Get in touch with our team for partnerships, volunteering, or general inquiries
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div>
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
              <h3 className="text-slate-900 mb-6">Get in Touch</h3>

              {/* Contact Info List */}
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-slate-500 text-sm mb-1">{info.label}</div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-slate-900 hover:text-blue-600 transition-colors"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-slate-900">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-slate-200">
                <div className="text-slate-700 mb-4">Follow Us</div>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:text-white transition-all ${social.color}`}
                      title={social.label}
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <button className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden h-full">
              {/* Map Placeholder */}
              <div className="h-full min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <div className="text-slate-600 mb-2">Google Maps Embed</div>
                  <p className="text-slate-500 text-sm">
                    A-25, Block 7-8, Clifton<br />
                    Karachi, Pakistan
                  </p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
                    Open in Google Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Hours (Optional) */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200 text-center">
            <div className="text-slate-900 mb-2">Office Hours</div>
            <div className="text-slate-600 text-sm">Mon - Fri: 9:00 AM - 5:00 PM</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200 text-center">
            <div className="text-slate-900 mb-2">Response Time</div>
            <div className="text-slate-600 text-sm">Usually within 24 hours</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200 text-center">
            <div className="text-slate-900 mb-2">Languages</div>
            <div className="text-slate-600 text-sm">English, Urdu</div>
          </div>
        </div>
      </div>
    </section>
  );
}
