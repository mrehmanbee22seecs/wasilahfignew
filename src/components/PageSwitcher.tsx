import React, { useState } from 'react';
import { Grid, X, LogIn, LayoutDashboard, Building2, Users, Shield, Briefcase, DollarSign, FileText, UserCog, Settings } from 'lucide-react';

interface PageSwitcherProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PageSwitcher({ currentPage, onNavigate }: PageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const specialPages = [
    { name: 'Auth System', page: 'auth', icon: LogIn, color: 'from-violet-600 to-purple-600' },
    { name: 'Corporate Dashboard', page: 'corporate-dashboard', icon: LayoutDashboard, color: 'from-teal-600 to-blue-600', description: 'Includes Projects Manager' },
    { name: 'NGO Dashboard', page: 'ngo-dashboard', icon: Building2, color: 'from-indigo-600 to-purple-600', description: 'Includes Projects Tab' },
    { name: 'Volunteer Dashboard', page: 'volunteer-dashboard', icon: Users, color: 'from-emerald-600 to-teal-600', description: 'Discover, Apply, Track' },
    { name: 'Admin Dashboard', page: 'admin-dashboard', icon: Shield, color: 'from-red-600 to-orange-600', description: 'All admin pages nested inside' },
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-teal-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
        aria-label="Page switcher"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Grid className="w-6 h-6" />}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
          <div className="fixed bottom-24 right-6 bg-white rounded-xl shadow-xl border-2 border-slate-200 p-4 z-50 min-w-[280px] animate-in slide-in-from-bottom-4 duration-200">
            <div className="mb-3 pb-3 border-b-2 border-slate-200">
              <h3 className="text-slate-900 text-sm">Quick Access</h3>
              <p className="text-slate-600 text-xs mt-1">Jump to any page</p>
            </div>

            <div className="space-y-2">
              {specialPages.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                
                return (
                  <div key={item.page}>
                    <button
                      onClick={() => handleNavigate(item.page)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <span className="text-sm block">{item.name}</span>
                        {item.description && (
                          <span className={`text-xs block mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t-2 border-slate-200">
              <p className="text-slate-500 text-xs">
                Current: <span className="text-slate-700 font-medium">{currentPage}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}