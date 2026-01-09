import React, { useState } from "react";
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

// Import Pages
import { HomePage } from "./pages/HomePage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { VolunteerProgramPage } from "./pages/VolunteerProgramPage";
import { NGOPartnersPage } from "./pages/NGOPartnersPage";
import { CorporateServicesPage } from "./pages/CorporateServicesPage";
import { NGODirectoryPage } from "./pages/NGODirectoryPage";
import { NGOProfilePage } from "./pages/NGOProfilePage";
import { VolunteerProfilePage } from "./pages/VolunteerProfilePage";
import { VolunteerDirectoryPage } from "./pages/VolunteerDirectoryPage";
import { VolunteerOpportunitiesPage } from "./pages/VolunteerOpportunitiesPage";
import { OpportunityDetailPage } from "./pages/OpportunityDetailPage";
import { NGOProfilePageV2 } from "./pages/NGOProfilePageV2";
import { ContactPage } from "./pages/ContactPage";
import { AuthPage } from "./pages/AuthPage";
import { CorporateDashboard } from "./pages/CorporateDashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { ResourcesHub } from "./pages/ResourcesHub";
import { ImpactPage } from "./pages/ImpactPage";
// Removed separate admin page imports - they're now nested in AdminDashboard

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
  // Removed separate admin page types - they're now nested
  | "ngo-directory"
  | "ngo-profile"
  | "ngo-profile-v2"
  | "volunteer-directory"
  | "volunteer-profile"
  | "opportunities"
  | "opportunity-detail";

export default function App() {
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
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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
        return <SolutionsPage />;
      case "volunteer-program":
        return <VolunteerProgramPage />;
      case "ngo-partners":
        return <NGOPartnersPage />;
      case "corporate-services":
        return <CorporateServicesPage />;
      case "ngo-directory":
        return (
          <NGODirectoryPage
            onNavigateToProfile={handleNavigateToProfile}
          />
        );
      case "ngo-profile":
        return <NGOProfilePage ngoId={selectedNGOId} />;
      case "ngo-profile-v2":
        return (
          <NGOProfilePageV2
            ngoId={selectedNGOId}
            onBackToOpportunity={handleBackToOpportunityDetail}
            onViewOpportunity={handleNavigateToOpportunityDetail}
            onApplyToOpportunity={(oppId) => console.log("Apply to:", oppId)}
            onViewAllOpportunities={handleBackToOpportunities}
          />
        );
      case "volunteer-directory":
        return (
          <VolunteerDirectoryPage
            onNavigateToProfile={handleNavigateToVolunteerProfile}
          />
        );
      case "volunteer-profile":
        return <VolunteerProfilePage volunteerId={selectedVolunteerId} />;
      case "opportunities":
        return (
          <VolunteerOpportunitiesPage
            onNavigateToDetail={handleNavigateToOpportunityDetail}
          />
        );
      case "opportunity-detail":
        return (
          <OpportunityDetailPage
            opportunityId={selectedOpportunityId}
            onBackToOpportunities={handleBackToOpportunities}
            onViewNGOProfile={handleNavigateToNGOProfileV2}
          />
        );
      case "volunteer-dashboard":
        return <VolunteerDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
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
        return <ContactPage />;
      case "auth":
        return <AuthPage onNavigateHome={() => setCurrentPage("home")} />;
      case "corporate-dashboard":
        return <CorporateDashboard onNavigateHome={() => setCurrentPage("home")} />;
      case "ngo-dashboard":
        return <NGODashboard onNavigateHome={() => setCurrentPage("home")} />;
      case "resources":
        return <ResourcesHub />;
      case "impact":
        return <ImpactPage />;
      default:
        return <HomePage />;
    }
  };

  // Auth page and corporate dashboard have their own shell, don't show nav/footer
  if (currentPage === "auth" || currentPage === "corporate-dashboard" || currentPage === "ngo-dashboard" || currentPage === "volunteer-dashboard" || currentPage === "admin-dashboard") {
    return (
      <>
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
        
        <PageSwitcher currentPage={currentPage} onNavigate={setCurrentPage} />
      </>
    );
  }

  return (
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
      <PageSwitcher currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}