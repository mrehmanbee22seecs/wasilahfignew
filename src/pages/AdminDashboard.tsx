import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  FileText,
  UserCog,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  MessageSquareQuote,
  BookOpen,
  Newspaper,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import CaseManagementPage from './CaseManagementPage';
import PaymentsFinancePage from './PaymentsFinancePage';
import AuditLogPage from './AuditLogPage';
import RoleManagementPage from './RoleManagementPage';
import AdminSettingsPage from './AdminSettingsPage';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import CMSDashboard from './cms/CMSDashboard';
import ContentList from './cms/ContentList';
import ContentEditor from './cms/ContentEditor';
import TestimonialBlockEditor from './cms/TestimonialBlockEditor';
import MediaLibrary from './cms/MediaLibrary';

/**
 * Admin Dashboard - Main Container
 * 
 * This is the main admin interface that contains:
 * - Overview (Vetting Queue, KPIs, Activity Feed)
 * - Case Management
 * - Payments & Finance
 * - Audit Log
 * - Role Management
 * - Settings
 * - CMS (Content Management System)
 * 
 * All admin pages are accessible ONLY through this dashboard
 * via the sidebar navigation.
 */

type AdminSection = 
  | 'overview' 
  | 'cases' 
  | 'payments' 
  | 'audit-log' 
  | 'roles' 
  | 'settings'
  | 'cms'
  | 'cms-testimonials'
  | 'cms-case-studies'
  | 'cms-resources'
  | 'cms-media'
  | 'cms-editor';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  description: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Vetting Queue & KPIs',
  },
  {
    id: 'cases',
    label: 'Case Management',
    icon: Briefcase,
    description: 'Investigation Cases',
  },
  {
    id: 'payments',
    label: 'Payments & Finance',
    icon: DollarSign,
    description: 'Dual Approval System',
  },
  {
    id: 'audit-log',
    label: 'Audit Log',
    icon: FileText,
    description: 'Immutable Audit Trail',
  },
  {
    id: 'roles',
    label: 'Role Management',
    icon: UserCog,
    description: 'Permissions & Teams',
  },
  {
    id: 'cms',
    label: 'Content',
    icon: Newspaper,
    description: 'CMS & Media Library',
    children: [
      {
        id: 'cms-testimonials',
        label: 'Testimonials',
        icon: MessageSquareQuote,
        description: 'Homepage testimonials',
      },
      {
        id: 'cms-case-studies',
        label: 'Case Studies',
        icon: BookOpen,
        description: 'Success stories',
      },
      {
        id: 'cms-resources',
        label: 'Resources',
        icon: FileText,
        description: 'Articles & guides',
      },
      {
        id: 'cms-media',
        label: 'Media Library',
        icon: ImageIcon,
        description: 'Images & assets',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'SLA & Configuration',
  },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['cms']);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (section: AdminSection) => {
    setActiveSection(section);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const renderContent = () => {
    const contentTypeMap: Record<string, string> = {
      'cms-testimonials': 'testimonials',
      'cms-case-studies': 'case-studies',
      'cms-resources': 'resources',
      'cms-media': 'media',
    };

    switch (activeSection) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'cases':
        return <CaseManagementPage />;
      case 'payments':
        return <PaymentsFinancePage />;
      case 'audit-log':
        return <AuditLogPage />;
      case 'roles':
        return <RoleManagementPage />;
      case 'settings':
        return <AdminSettingsPage />;
      case 'cms':
        return <CMSDashboard onNavigate={handleNavigate} />;
      case 'cms-testimonials':
        // Special: Testimonials uses dedicated block editor
        return <TestimonialBlockEditor onNavigate={handleNavigate} />;
      case 'cms-case-studies':
      case 'cms-resources':
        return <ContentList contentType={contentTypeMap[activeSection]} onNavigate={handleNavigate} />;
      case 'cms-media':
        return <MediaLibrary onNavigate={handleNavigate} />;
      case 'cms-editor':
        return <ContentEditor onNavigate={handleNavigate} />;
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } lg:w-72 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden fixed lg:relative z-50 h-full`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isExpanded = expandedMenus.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.id);
                    } else {
                      handleNavigate(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="flex-1 text-left">
                    <div className={`font-medium text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  {hasChildren ? (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  ) : (
                    isActive && <ChevronRight className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                {/* Submenu */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = activeSection === child.id;

                      return (
                        <button
                          key={child.id}
                          onClick={() => handleNavigate(child.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                            isChildActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <ChildIcon className={`w-4 h-4 ${isChildActive ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className="flex-1 text-left">{child.label}</span>
                          {isChildActive && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-2 border-blue-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Dashboard
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AD</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                {navigationItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>
          </div>

          {/* Quick Actions / User Menu can go here */}
          <div className="flex items-center gap-4">
            {/* Placeholder for notifications, user menu, etc. */}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}