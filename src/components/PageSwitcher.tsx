import React, { useState } from 'react';
import { Grid, X, LogIn, LayoutDashboard, Building2, Users, Shield, Briefcase, DollarSign, FileText, UserCog, Settings, Box } from 'lucide-react';
import { BRAND } from '../constants/brand';

interface PageSwitcherProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PageSwitcher({ currentPage, onNavigate }: PageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const specialPages = [
    { name: 'Auth System', page: 'auth', icon: LogIn, gradient: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)` },
    { name: 'Corporate Dashboard', page: 'corporate-dashboard', icon: LayoutDashboard, gradient: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)`, description: 'Includes Projects Manager' },
    { name: 'NGO Dashboard', page: 'ngo-dashboard', icon: Building2, gradient: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)`, description: 'Includes Projects Tab' },
    { name: 'Volunteer Dashboard', page: 'volunteer-dashboard', icon: Users, gradient: `linear-gradient(135deg, ${BRAND.teal} 0%, ${BRAND.navy} 100%)`, description: 'Discover, Apply, Track' },
    { name: 'Admin Dashboard', page: 'admin-dashboard', icon: Shield, gradient: `linear-gradient(135deg, ${BRAND.navyDark} 0%, ${BRAND.navy} 100%)`, description: 'All admin pages nested inside' },
    { name: 'Skeletons Demo', page: 'skeletons-demo', icon: Box, gradient: `linear-gradient(135deg, ${BRAND.teal} 0%, ${BRAND.tealLight} 100%)`, description: 'Loading components showcase' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
        style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)` }}
        aria-label="Page switcher"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Grid className="w-6 h-6" />}
        
        {/* Tooltip */}
        {!isOpen && (
          <div 
            className="absolute right-full mr-3 px-3 py-2 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ backgroundColor: BRAND.navy }}
          >
            Quick Access
          </div>
        )}
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div 
            className="fixed bottom-24 right-6 bg-white rounded-xl shadow-xl border-2 p-4 z-50 min-w-[280px] animate-in slide-in-from-bottom-4 duration-200"
            style={{ borderColor: `${BRAND.navy}15` }}
          >
            <div className="mb-3 pb-3 border-b-2" style={{ borderColor: `${BRAND.navy}15` }}>
              <h3 className="text-sm" style={{ color: BRAND.navy }}>Quick Access</h3>
              <p className="text-xs mt-1" style={{ color: BRAND.gray600 }}>Jump to any page</p>
            </div>

            <div className="space-y-2">
              {specialPages.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                
                return (
                  <div key={item.page}>
                    <button
                      onClick={() => handleNavigate(item.page)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                      style={isActive ? {
                        background: item.gradient,
                        color: BRAND.white,
                        boxShadow: '0 4px 12px rgba(27, 42, 78, 0.3)'
                      } : {
                        backgroundColor: BRAND.cream,
                        color: BRAND.navy
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = `${BRAND.teal}15`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = BRAND.cream;
                        }
                      }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <span className="text-sm block">{item.name}</span>
                        {item.description && (
                          <span 
                            className="text-xs block mt-0.5"
                            style={{ color: isActive ? 'rgba(255,255,255,0.8)' : BRAND.gray500 }}
                          >
                            {item.description}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t-2" style={{ borderColor: `${BRAND.navy}15` }}>
              <p className="text-xs" style={{ color: BRAND.gray500 }}>
                Current: <span className="font-medium" style={{ color: BRAND.navy }}>{currentPage}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}