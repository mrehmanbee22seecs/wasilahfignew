import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

// Brand colors matching the logo
const BRAND_COLORS = {
  navyBlue: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onRequestProposal?: () => void;
}

interface MenuItem {
  label: string;
  page?: string;
  children?: { label: string; page: string; description?: string }[];
}

export function Navigation({ currentPage, onNavigate, onRequestProposal }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleRequestProposal = () => {
    if (onRequestProposal) {
      onRequestProposal();
    } else {
      // Default: navigate to contact page
      onNavigate('contact');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reorganized menu structure with dropdowns
  const menuItems: MenuItem[] = [
    { label: 'Home', page: 'home' },
    { 
      label: 'Solutions', 
      children: [
        { label: 'CSR Solutions', page: 'csr-solutions', description: 'Corporate social responsibility packages' },
        { label: 'Corporate Services', page: 'corporate-services', description: 'Tailored enterprise solutions' },
        { label: 'Volunteer Program', page: 'volunteer-program', description: 'Employee engagement programs' },
      ]
    },
    { 
      label: 'Directory', 
      children: [
        { label: 'NGO Directory', page: 'ngo-directory', description: 'Browse registered NGOs' },
        { label: 'Volunteer Directory', page: 'volunteer-directory', description: 'Find skilled volunteers' },
        { label: 'Opportunities', page: 'opportunities', description: 'Current volunteer opportunities' },
      ]
    },
    { label: 'Impact', page: 'impact' },
    { label: 'Resources', page: 'resources' },
    { label: 'Contact', page: 'contact' }
  ];

  // All menu items flattened for mobile
  const allMenuItems = [
    { label: 'Home', page: 'home' },
    { label: 'CSR Solutions', page: 'csr-solutions' },
    { label: 'Corporate Services', page: 'corporate-services' },
    { label: 'Volunteer Program', page: 'volunteer-program' },
    { label: 'NGO Directory', page: 'ngo-directory' },
    { label: 'Volunteer Directory', page: 'volunteer-directory' },
    { label: 'Opportunities', page: 'opportunities' },
    { label: 'NGO Partners', page: 'ngo-partners' },
    { label: 'Impact', page: 'impact' },
    { label: 'Resources', page: 'resources' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleMenuClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isPageActive = (item: MenuItem): boolean => {
    if (item.page) return currentPage === item.page;
    if (item.children) {
      return item.children.some(child => currentPage === child.page);
    }
    return false;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleMenuClick('home')}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2EC4B6] rounded-lg"
              aria-label="Go to homepage"
            >
              <img 
                src="/logo.jpeg" 
                alt="Wasilah Logo" 
                className="h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                {item.children ? (
                  // Dropdown menu item
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isPageActive(item)
                          ? 'text-white'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ 
                        color: isPageActive(item) ? 'white' : BRAND_COLORS.navyBlue,
                        backgroundColor: isPageActive(item) ? BRAND_COLORS.teal : undefined
                      }}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Dropdown panel */}
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        {item.children.map((child, childIndex) => (
                          <button
                            key={childIndex}
                            onClick={() => handleMenuClick(child.page)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                              currentPage === child.page ? 'bg-gray-50' : ''
                            }`}
                          >
                            <div 
                              className="font-medium"
                              style={{ color: currentPage === child.page ? BRAND_COLORS.teal : BRAND_COLORS.navyBlue }}
                            >
                              {child.label}
                            </div>
                            {child.description && (
                              <div className="text-sm text-gray-500 mt-0.5">
                                {child.description}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <button
                    onClick={() => handleMenuClick(item.page!)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === item.page
                        ? 'text-white'
                        : 'hover:bg-gray-50'
                    }`}
                    style={{ 
                      color: currentPage === item.page ? 'white' : BRAND_COLORS.navyBlue,
                      backgroundColor: currentPage === item.page ? BRAND_COLORS.teal : undefined
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button 
              onClick={handleRequestProposal}
              className="px-6 py-3 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: BRAND_COLORS.navyBlue }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_COLORS.teal}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND_COLORS.navyBlue}
            >
              Request a Proposal
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            style={{ color: BRAND_COLORS.navyBlue }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col gap-1">
              {allMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.page)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    currentPage === item.page
                      ? 'text-white'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ 
                    color: currentPage === item.page ? 'white' : BRAND_COLORS.navyBlue,
                    backgroundColor: currentPage === item.page ? BRAND_COLORS.teal : undefined
                  }}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-4 px-4">
                <button 
                  onClick={handleRequestProposal}
                  className="w-full px-6 py-3 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  style={{ backgroundColor: BRAND_COLORS.navyBlue }}
                >
                  Request a Proposal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}