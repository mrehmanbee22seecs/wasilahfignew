import React from 'react';
import { 
  Network, 
  Mail, 
  Phone, 
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'About Wasilah',
      links: [
        'Our Story',
        'Mission & Vision',
        'Leadership Team',
        'Careers',
        'Press & Media'
      ]
    },
    {
      title: 'Services',
      links: [
        'CSR Planning & SDG Alignment',
        'NGO Vetting & Verification',
        'CSR Project Execution',
        'Impact Reports & Content',
        'Compliance & Audit Support',
        'Employee Volunteering'
      ]
    },
    {
      title: 'For Corporates',
      links: [
        'CSR Strategy',
        'Compliance Resources',
        'Impact Reporting',
        'Case Studies',
        'ROI Calculator',
        'Partner Portal'
      ]
    },
    {
      title: 'For NGOs',
      links: [
        'NGO Vetting Process',
        'Partnership Opportunities',
        'NGO Onboarding',
        'Verification Standards',
        'Apply as Partner'
      ]
    },
    {
      title: 'For Students',
      links: [
        'Volunteer Programs',
        'University Partnerships',
        'Student Leadership',
        'Training & Development',
        'Join Our Network'
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">Wasilah</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Pakistan's first CSR operations partner, building bridges between corporates, NGOs, and impact.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Bar */}
        <div className="grid md:grid-cols-3 gap-6 py-8 border-y border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-slate-500 text-sm">Email</div>
              <div className="text-white">contact@wasilah.pk</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-slate-500 text-sm">Phone</div>
              <div className="text-white">+92 (21) 1234-5678</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-slate-500 text-sm">Office</div>
              <div className="text-white">Karachi, Pakistan</div>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-slate-500 text-sm">
          <div>
            © {new Date().getFullYear()} Wasilah. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">SECP Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
