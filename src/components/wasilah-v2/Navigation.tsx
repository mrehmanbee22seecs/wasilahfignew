import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', page: 'home' },
    { label: 'Opportunities', page: 'opportunities' },
    { label: 'NGO Directory', page: 'ngo-directory' },
    { label: 'Volunteer Directory', page: 'volunteer-directory' },
    { label: 'Resources', page: 'resources' },
    { label: 'Impact', page: 'impact' },
    { label: 'CSR Solutions', page: 'csr-solutions' },
    { label: 'Volunteer Program', page: 'volunteer-program' },
    { label: 'NGO Partners', page: 'ngo-partners' },
    { label: 'Corporate Services', page: 'corporate-services' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleMenuClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-md' 
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleMenuClick('home')}
              className="text-slate-900 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">W</span>
              </div>
              <span>Wasilah</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.page)}
                className={`transition-colors ${
                  currentPage === item.page
                    ? 'text-teal-600'
                    : 'text-slate-700 hover:text-teal-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
              Request a Proposal
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.page)}
                  className={`text-left py-2 transition-colors ${
                    currentPage === item.page
                      ? 'text-teal-600'
                      : 'text-slate-700 hover:text-teal-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all mt-2">
                Request a Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}