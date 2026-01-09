import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Wasilah Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">W</span>
              </div>
              <span className="text-white">Wasilah</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              Pakistan's premier CSR platform connecting companies with student volunteers, 
              NGOs, and meaningful social projects to create measurable impact.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Press Kit</a></li>
            </ul>
          </div>

          {/* CSR Services */}
          <div>
            <h4 className="text-white mb-4">CSR Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Bronze Tier</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Silver Tier</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Gold Tier</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Platinum Tier</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Custom Solutions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-sm">Email</div>
                  <a href="mailto:contact@wasilah.pk" className="text-white hover:text-teal-400 transition-colors">
                    contact@wasilah.pk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-sm">Phone</div>
                  <a href="tel:+922112345678" className="text-white hover:text-teal-400 transition-colors">
                    +92 (21) 1234-5678
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-sm">Office</div>
                  <div className="text-white">
                    Karachi, Pakistan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <div>
            © {new Date().getFullYear()} Wasilah. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}