import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar,
  FolderKanban,
  Settings, 
  HelpCircle,
  Menu,
  X,
  DollarSign,
  TrendingUp,
  Target,
  LogOut,
  Home
} from 'lucide-react';

interface DashboardNavProps {
  activeTab: 'overview' | 'payments' | 'budget' | 'contracts' | 'csr-plan' | 'volunteering' | 'calendar' | 'projects';
  onTabChange: (tab: DashboardNavProps['activeTab']) => void;
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onToggleMobile?: () => void;
  onCollapse?: () => void;
  onNavigateHome?: () => void;
}

export function DashboardNav({ 
  activeTab, 
  onTabChange, 
  isCollapsed = false,
  isMobileOpen = false,
  onToggleMobile,
  onCollapse,
  onNavigateHome
}: DashboardNavProps) {
  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'payments' as const, label: 'Payments', icon: DollarSign },
    { id: 'budget' as const, label: 'Budget', icon: TrendingUp },
    { id: 'contracts' as const, label: 'Contracts', icon: FileText },
    { id: 'csr-plan' as const, label: 'CSR Plan', icon: Target },
    { id: 'volunteering' as const, label: 'Volunteering', icon: Users },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar }
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const allItems = [...navItems, ...bottomItems];
      const currentIndex = allItems.findIndex(item => item.id === tabId);
      const nextIndex = e.key === 'ArrowDown' 
        ? (currentIndex + 1) % allItems.length
        : (currentIndex - 1 + allItems.length) % allItems.length;
      
      const nextItem = allItems[nextIndex];
      if (navItems.some(item => item.id === nextItem.id)) {
        onTabChange(nextItem.id as DashboardNavProps['activeTab']);
      }
      
      // Focus next button
      const buttons = document.querySelectorAll('[data-nav-item]');
      (buttons[nextIndex] as HTMLElement)?.focus();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-150"
          onClick={onToggleMobile}
        />
      )}

      {/* Navigation */}
      <nav
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r-2 border-slate-200 
          flex flex-col z-50 transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className={`p-6 border-b-2 border-slate-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">W</span>
              </div>
              <div>
                <div className="text-slate-900">Wasilah</div>
                <div className="text-slate-600 text-xs">Corporate Portal</div>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">W</span>
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                data-nav-item
                onClick={() => {
                  onTabChange(item.id);
                  onToggleMobile?.();
                }}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-700 hover:bg-slate-100'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom Items */}
        <div className="border-t-2 border-slate-200 p-3 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                data-nav-item
                onClick={() => console.log(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  text-slate-700 hover:bg-slate-100 text-sm
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
          
          {/* Logout/Home Button */}
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                text-slate-700 hover:bg-red-50 hover:text-red-600 text-sm
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? 'Exit to Home' : undefined}
              aria-label="Exit dashboard and return to home"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Exit Dashboard</span>}
            </button>
          )}
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={onCollapse}
          className="hidden lg:block border-t-2 border-slate-200 p-4 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
        >
          {isCollapsed ? '→ Expand' : '← Collapse'}
        </button>
      </nav>
    </>
  );
}