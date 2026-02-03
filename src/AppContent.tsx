import React, { useState, Suspense, lazy } from "react";
import { Navigation } from "./components/wasilah-v2/Navigation";
import { Footer } from "./components/wasilah-v2/Footer";
import { PageSwitcher } from "./components/PageSwitcher";
import { NotificationsPanel } from "./components/notifications/NotificationsPanel";
import { NotificationBadge } from "./components/notifications/NotificationBadge";
import { useNotifications } from "./hooks/useNotifications";
import { GlobalSearchModal } from "./components/search/GlobalSearchModal";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { ExportModal } from "./components/exports/ExportModal";
import { ExportHistoryPanel } from "./components/exports/ExportHistoryPanel";
import { useExport } from "./hooks/useExport";
import { NetworkStatus } from "./components/ui/NetworkStatus";
import { ToastContainer, ToastProps } from "./components/ui/Toast";
import { applyReducedMotionStyles } from "./utils/reducedMotion";
import { ChunkErrorBoundary } from "./components/lazy/ChunkErrorBoundary";
import { LazyLoadingFallback } from "./components/lazy/LazyLoadingFallback";

// Auth System
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Keep HomePage loaded immediately for initial render
import { HomePage } from "./pages/HomePage";

// Lazy load all other pages
const SolutionsPage = lazy(() => import("./pages/SolutionsPage").then(m => ({ default: m.SolutionsPage })));
const VolunteerProgramPage = lazy(() => import("./pages/VolunteerProgramPage").then(m => ({ default: m.VolunteerProgramPage })));
const NGOPartnersPage = lazy(() => import("./pages/NGOPartnersPage").then(m => ({ default: m.NGOPartnersPage })));
const CorporateServicesPage = lazy(() => import("./pages/CorporateServicesPage").then(m => ({ default: m.CorporateServicesPage })));
const NGODirectoryPage = lazy(() => import("./pages/NGODirectoryPage").then(m => ({ default: m.NGODirectoryPage })));
const NGOProfilePage = lazy(() => import("./pages/NGOProfilePage").then(m => ({ default: m.NGOProfilePage })));
const VolunteerProfilePage = lazy(() => import("./pages/VolunteerProfilePage").then(m => ({ default: m.VolunteerProfilePage })));
const VolunteerDirectoryPage = lazy(() => import("./pages/VolunteerDirectoryPage").then(m => ({ default: m.VolunteerDirectoryPage })));
const VolunteerOpportunitiesPage = lazy(() => import("./pages/VolunteerOpportunitiesPage").then(m => ({ default: m.VolunteerOpportunitiesPage })));
const OpportunityDetailPage = lazy(() => import("./pages/OpportunityDetailPage").then(m => ({ default: m.OpportunityDetailPage })));
const NGOProfilePageV2 = lazy(() => import("./pages/NGOProfilePageV2").then(m => ({ default: m.NGOProfilePageV2 })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then(m => ({ default: m.AuthPage })));
const ResourcesHub = lazy(() => import("./pages/ResourcesHub").then(m => ({ default: m.ResourcesHub })));
const ImpactPage = lazy(() => import("./pages/ImpactPage").then(m => ({ default: m.ImpactPage })));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage").then(m => ({ default: m.UnauthorizedPage })));
const SkeletonsDemo = lazy(() => import("./pages/dev/SkeletonsDemo").then(m => ({ default: m.SkeletonsDemo })));

// Dashboard pages - larger bundles, lazy load with dashboard skeleton
const CorporateDashboard = lazy(() => import("./pages/CorporateDashboard").then(m => ({ default: m.CorporateDashboard })));
const NGODashboard = lazy(() => import("./pages/NGODashboard"));
const VolunteerDashboard = lazy(() => import("./pages/VolunteerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Legal Pages
import { PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage } from "./pages/legal";

// Company Pages
import { AboutPage } from "./pages/company";

type PageType =
  | "home"
  | "csr-solutions"
  | "volunteer-program"
  | "ngo-partners"
  | "corporate-services"
  | "portfolio"
  | "contact"
  | "auth"
  | "corporate-dashboard"
  | "ngo-dashboard"
  | "volunteer-dashboard"
  | "admin-dashboard"
  | "resources"
  | "impact"
  | "unauthorized"
  | "ngo-directory"
  | "ngo-profile"
  | "ngo-profile-v2"
  | "volunteer-directory"
  | "volunteer-profile"
  | "opportunities"
  | "opportunity-detail"
  | "skeletons-demo"
  | "privacy-policy"
  | "terms-of-service"
  | "cookie-policy"
  | "about";

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedNGOId, setSelectedNGOId] = useState<string>("1");
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>("1");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>("1");
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  // Apply reduced motion styles on mount
  React.useEffect(() => {
    const cleanup = applyReducedMotionStyles();
    return cleanup;
  }, []);

  // Toast management
  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    setToasts((prev: ToastProps[]) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev: ToastProps[]) => prev.filter((t: ToastProps) => t.id !== id));
  };
  
  // Notifications
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchNotifications,
  } = useNotifications();

  // Global Search
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Cmd+K / Ctrl+K to open search
  useKeyboardShortcut({
    key: 'k',
    metaKey: true,
    callback: () => setSearchModalOpen(true),
  });

  // Exports & Reports
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportHistoryOpen, setExportHistoryOpen] = useState(false);
  const {
    exportJobs,
    isExporting,
    performExport,
    deleteExportJob,
    clearExportHistory,
    loadExportHistory,
  } = useExport();

  // Cmd+E / Ctrl+E to open export modal
  useKeyboardShortcut({
    key: 'e',
    metaKey: true,
    callback: () => setExportModalOpen(true),
  });

  // Cmd+H / Ctrl+H to open export history
  useKeyboardShortcut({
    key: 'h',
    metaKey: true,
    callback: () => setExportHistoryOpen(true),
  });

  const handleNavigateToProfile = (ngoId: string) => {
    setSelectedNGOId(ngoId);
    setCurrentPage("ngo-profile");
  };

  const handleNavigateToNGOProfileV2 = (ngoId: string) => {
    setSelectedNGOId(ngoId);
    setCurrentPage("ngo-profile-v2");
  };

  const handleNavigateToVolunteerProfile = (volunteerId: string) => {
    setSelectedVolunteerId(volunteerId);
    setCurrentPage("volunteer-profile");
  };

  const handleNavigateToOpportunityDetail = (opportunityId: string) => {
    setSelectedOpportunityId(opportunityId);
    setCurrentPage("opportunity-detail");
  };

  const handleBackToOpportunities = () => {
    setCurrentPage("opportunities");
  };

  const handleBackToOpportunityDetail = () => {
    setCurrentPage("opportunity-detail");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "csr-solutions":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <SolutionsPage />
          </Suspense>
        );
      case "volunteer-program":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <VolunteerProgramPage />
          </Suspense>
        );
      case "ngo-partners":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <NGOPartnersPage />
          </Suspense>
        );
      case "corporate-services":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <CorporateServicesPage />
          </Suspense>
        );
      case "ngo-directory":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <NGODirectoryPage
              onNavigateToProfile={handleNavigateToProfile}
            />
          </Suspense>
        );
      case "ngo-profile":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <NGOProfilePage ngoId={selectedNGOId} />
          </Suspense>
        );
      case "ngo-profile-v2":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <NGOProfilePageV2
              ngoId={selectedNGOId}
              onBackToOpportunity={handleBackToOpportunityDetail}
              onViewOpportunity={handleNavigateToOpportunityDetail}
              onApplyToOpportunity={(oppId) => console.log("Apply to:", oppId)}
              onViewAllOpportunities={handleBackToOpportunities}
            />
          </Suspense>
        );
      case "volunteer-directory":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <VolunteerDirectoryPage
              onNavigateToProfile={handleNavigateToVolunteerProfile}
            />
          </Suspense>
        );
      case "volunteer-profile":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <VolunteerProfilePage volunteerId={selectedVolunteerId} />
          </Suspense>
        );
      case "opportunities":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <VolunteerOpportunitiesPage
              onNavigateToDetail={handleNavigateToOpportunityDetail}
            />
          </Suspense>
        );
      case "opportunity-detail":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <OpportunityDetailPage
              opportunityId={selectedOpportunityId}
              onBackToOpportunities={handleBackToOpportunities}
              onViewNGOProfile={handleNavigateToNGOProfileV2}
            />
          </Suspense>
        );
      case "volunteer-dashboard":
        return (
          <Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
            <ProtectedRoute
              allowedRoles={['volunteer']}
              onUnauthorized={() => setCurrentPage('unauthorized')}
              onUnauthenticated={() => setCurrentPage('auth')}
            >
              <VolunteerDashboard />
            </ProtectedRoute>
          </Suspense>
        );
      case "admin-dashboard":
        return (
          <Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
            <ProtectedRoute
              allowedRoles={['admin']}
              onUnauthorized={() => setCurrentPage('unauthorized')}
              onUnauthenticated={() => setCurrentPage('auth')}
            >
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        );
      case "corporate-dashboard":
        return (
          <Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
            <ProtectedRoute
              allowedRoles={['corporate']}
              onUnauthorized={() => setCurrentPage('unauthorized')}
              onUnauthenticated={() => setCurrentPage('auth')}
            >
              <CorporateDashboard onNavigateHome={() => setCurrentPage("home")} />
            </ProtectedRoute>
          </Suspense>
        );
      case "ngo-dashboard":
        return (
          <Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
            <ProtectedRoute
              allowedRoles={['ngo']}
              onUnauthorized={() => setCurrentPage('unauthorized')}
              onUnauthenticated={() => setCurrentPage('auth')}
            >
              <NGODashboard onNavigateHome={() => setCurrentPage("home")} />
            </ProtectedRoute>
          </Suspense>
        );
      case "portfolio":
        return (
          <div className="pt-32 pb-24 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-slate-900 mb-4">Portfolio</h1>
              <p className="text-slate-600">
                This page is coming soon...
              </p>
            </div>
          </div>
        );
      case "contact":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <ContactPage />
          </Suspense>
        );
      case "auth":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <AuthPage onNavigateHome={() => setCurrentPage("home")} />
          </Suspense>
        );
      case "resources":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <ResourcesHub />
          </Suspense>
        );
      case "impact":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <ImpactPage />
          </Suspense>
        );
      case "unauthorized":
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <UnauthorizedPage onNavigate={(page) => setCurrentPage(page as PageType)} />
          </Suspense>
        );
      case "skeletons-demo":
        return <SkeletonsDemo />;
      case "privacy-policy":
        return <PrivacyPolicyPage onBack={() => setCurrentPage("home")} />;
      case "terms-of-service":
        return <TermsOfServicePage onBack={() => setCurrentPage("home")} />;
      case "cookie-policy":
        return <CookiePolicyPage onBack={() => setCurrentPage("home")} />;
      case "about":
        return (
          <AboutPage 
            onBack={() => setCurrentPage("home")} 
            onNavigate={(page) => setCurrentPage(page as PageType)}
          />
        return (
          <Suspense fallback={<LazyLoadingFallback type="page" />}>
            <SkeletonsDemo />
          </Suspense>
        );
      default:
        return <HomePage />;
    }
  };

  // Auth page, dashboards, and unauthorized page have their own shell, don't show nav/footer
  const pagesWithoutNavFooter = [
    "auth",
    "corporate-dashboard",
    "ngo-dashboard",
    "volunteer-dashboard",
    "admin-dashboard",
    "unauthorized",
    "skeletons-demo"
  ];

  if (pagesWithoutNavFooter.includes(currentPage)) {
    return (
      <ChunkErrorBoundary>
        {/* Network Status Banner */}
        <NetworkStatus />
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        {renderPage()}
        
        {/* Global Search - Available everywhere */}
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
        
        <PageSwitcher currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as PageType)} />
      </ChunkErrorBoundary>
    );
  }

  return (
    <ChunkErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* Network Status Banner */}
        <NetworkStatus />
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <Navigation
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page as PageType)}
        />

        {/* Render Current Page */}
        {renderPage()}

      <Footer onNavigate={(page) => setCurrentPage(page as PageType)} />
      
      {/* Notification Badge - Fixed Position */}
      <div className="fixed top-4 right-4 z-30">
        <NotificationBadge
          count={unreadCount}
          onClick={() => setNotificationsPanelOpen(true)}
        />
      </div>
        <Footer />
        
        {/* Notification Badge - Fixed Position */}
        <div className="fixed top-4 right-4 z-30">
          <NotificationBadge
            count={unreadCount}
            onClick={() => setNotificationsPanelOpen(true)}
          />
        </div>

        {/* Notifications Panel */}
        <NotificationsPanel
          isOpen={notificationsPanelOpen}
          onClose={() => setNotificationsPanelOpen(false)}
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
          onDeleteAll={deleteAllNotifications}
          onRefresh={fetchNotifications}
        />

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />

        {/* Export Modal */}
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onExport={performExport}
          isExporting={isExporting}
        />

        {/* Export History Panel */}
        <ExportHistoryPanel
          isOpen={exportHistoryOpen}
          onClose={() => setExportHistoryOpen(false)}
          jobs={exportJobs}
          onDelete={deleteExportJob}
          onClearAll={clearExportHistory}
          onRefresh={loadExportHistory}
        />
        
        {/* Page Switcher for Quick Access */}
        <PageSwitcher currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as PageType)} />
      </div>
    </ChunkErrorBoundary>
  );
}
