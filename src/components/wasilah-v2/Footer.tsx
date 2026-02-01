import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  navyLight: '#2A3F6E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

export function Footer() {
  return (
    <footer style={{ backgroundColor: BRAND.navy }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Wasilah Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo.jpeg" 
                alt="Wasilah Logo" 
                className="h-12 w-auto object-contain bg-white rounded-lg p-1"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-sm">
              Pakistan's premier CSR platform connecting companies with student volunteers, 
              NGOs, and meaningful social projects to create measurable impact.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <a 
                  key={label}
                  href="#" 
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 text-gray-300 hover:text-white"
                  style={{ backgroundColor: BRAND.navyLight }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND.teal;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND.navyLight;
                  }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Team', 'Careers', 'Blog', 'Press Kit'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: BRAND.teal }}
                    />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CSR Services */}
          <div>
            <h4 className="text-white font-semibold mb-5">CSR Services</h4>
            <ul className="space-y-3">
              {['Bronze Tier', 'Silver Tier', 'Gold Tier', 'Platinum Tier', 'Custom Solutions'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: BRAND.teal }}
                    />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${BRAND.teal}20` }}
                >
                  <Mail className="w-4 h-4" style={{ color: BRAND.teal }} />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Email</div>
                  <a 
                    href="mailto:contact@wasilah.pk" 
                    className="text-white hover:underline transition-colors"
                    style={{ textDecorationColor: BRAND.teal }}
                  >
                    contact@wasilah.pk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${BRAND.teal}20` }}
                >
                  <Phone className="w-4 h-4" style={{ color: BRAND.teal }} />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Phone</div>
                  <a href="tel:+922112345678" className="text-white hover:underline transition-colors">
                    +92 (21) 1234-5678
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${BRAND.teal}20` }}
                >
                  <MapPin className="w-4 h-4" style={{ color: BRAND.teal }} />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Office</div>
                  <div className="text-white">
                    Karachi, Pakistan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm"
          style={{ borderTop: `1px solid ${BRAND.navyLight}` }}
        >
          <div>
            © {new Date().getFullYear()} Wasilah. All rights reserved.
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}