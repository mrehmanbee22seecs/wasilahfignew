import React, { useState, useEffect, useRef } from 'react';
import { 
  X, FileText, Users, TrendingUp, Calendar, DollarSign, Target,
  Building2, CheckCircle, Clock, AlertCircle, MoreVertical, 
  Download, MessageSquare, Plus, Activity, Eye, XCircle
} from 'lucide-react';
import { Project, SDG_LIST } from '../../types/projects';
import { OverviewTab } from './drawer-tabs/OverviewTab';
import { NGOVettingTab } from './drawer-tabs/NGOVettingTab';
import { MilestonesMediaTab } from './drawer-tabs/MilestonesMediaTab';
import { VolunteersTab } from './drawer-tabs/VolunteersTab';
import { FinanceTab } from './drawer-tabs/FinanceTab';
import { ImpactTab } from './drawer-tabs/ImpactTab';

interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (partialProject: Partial<Project>) => void;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'ngos', label: 'NGOs & Vetting', icon: Building2 },
  { id: 'milestones', label: 'Milestones & Media', icon: Target },
  { id: 'volunteers', label: 'Volunteers', icon: Users },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'impact', label: 'Impact', icon: TrendingUp }
] as const;

type TabId = typeof TABS[number]['id'];

export function ProjectDetailDrawer({ project, isOpen, onClose, onUpdate }: ProjectDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isClosing, setIsClosing] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Minimum swipe distance (in px) to trigger close
  const minSwipeDistance = 100;

  // Touch handlers for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    if (touchStart) {
      const distance = e.targetTouches[0].clientX - touchStart;
      // Only allow right swipe (closing)
      if (distance > 0) {
        setSwipeOffset(distance);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }
    
    const distance = touchEnd - touchStart;
    const isRightSwipe = distance > minSwipeDistance;
    
    if (isRightSwipe) {
      handleClose();
    }
    
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Reset tab when opening new project
  useEffect(() => {
    if (isOpen && project) {
      setActiveTab('overview');
    }
  }, [isOpen, project?.id]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close
      if (e.key === 'Escape') {
        handleClose();
      }

      // Left/Right arrows to switch tabs
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        let newIndex;
        
        if (e.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
        } else {
          newIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
        }
        
        setActiveTab(TABS[newIndex].id);
        e.preventDefault();
      }

      // Ctrl+Tab / Ctrl+Shift+Tab for tab switching
      if (e.ctrlKey && e.key === 'Tab') {
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        const newIndex = e.shiftKey
          ? (currentIndex > 0 ? currentIndex - 1 : TABS.length - 1)
          : (currentIndex < TABS.length - 1 ? currentIndex + 1 : 0);
        
        setActiveTab(TABS[newIndex].id);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    drawer.addEventListener('keydown', handleTabKey as any);
    return () => drawer.removeEventListener('keydown', handleTabKey as any);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240);
  };

  const handleBackdropClick = () => {
    // TODO: Check for unsaved changes before closing
    handleClose();
  };

  const handleApprove = () => {
    if (onUpdate) {
      onUpdate({ status: 'active' });
      setShowApproveModal(false);
      onClose();
    }
  };

  const handleReject = () => {
    if (onUpdate) {
      onUpdate({ status: 'archived' });
      setShowRejectModal(false);
      onClose();
    }
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  if (!isOpen || !project) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Clock
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: CheckCircle
        };
      case 'draft':
        return {
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
      case 'archived':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: AlertCircle
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/32 z-[60] transition-opacity duration-240 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed right-0 top-0 bottom-0 w-full md:w-[520px] lg:w-[38vw] lg:min-w-[520px] lg:max-w-[680px] bg-white shadow-2xl z-[70] overflow-hidden flex flex-col transition-all duration-240 ${
          isClosing ? 'translate-x-5 opacity-0' : 'translate-x-0 opacity-100'
        }`} 
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b-2 border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h2 
                id="drawer-title" 
                className="text-slate-900 pr-2 truncate"
              >
                {project.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1 truncate">
                {project.slug || 'Wasilah Corporate'}
              </p>
            </div>
            
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="flex-shrink-0 p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close project details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs ${statusConfig.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{project.status}</span>
            </div>

            <div className="flex items-center gap-2">
              {project.status === 'pending' && (
                <>
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                    aria-label="Approve project"
                  >
                    Approve
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 text-sm bg-white border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                    aria-label="Reject project"
                  >
                    Reject
                  </button>
                </>
              )}
              
              <button
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Last updated info */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <Activity className="w-3.5 h-3.5" />
            <span>
              Updated {new Date(project.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })} by {project.created_by || 'Wasilah Corporate'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 sticky top-0 bg-white border-b-2 border-slate-200 px-6 z-10">
          <div 
            className="flex gap-6 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="Project information tabs"
          >
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  id={`${tab.id}-tab`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {activeTab === 'overview' && (
              <div 
                role="tabpanel" 
                id="overview-panel" 
                aria-labelledby="overview-tab"
              >
                <OverviewTab project={project} onTabChange={handleTabChange} />
              </div>
            )}

            {activeTab === 'ngos' && (
              <div 
                role="tabpanel" 
                id="ngos-panel" 
                aria-labelledby="ngos-tab"
              >
                <NGOVettingTab projectId={project.id} />
              </div>
            )}

            {activeTab === 'milestones' && (
              <div 
                role="tabpanel" 
                id="milestones-panel" 
                aria-labelledby="milestones-tab"
              >
                <MilestonesMediaTab projectId={project.id} />
              </div>
            )}

            {activeTab === 'volunteers' && (
              <div 
                role="tabpanel" 
                id="volunteers-panel" 
                aria-labelledby="volunteers-tab"
              >
                <VolunteersTab projectId={project.id} volunteerTarget={project.volunteer_target} />
              </div>
            )}

            {activeTab === 'finance' && (
              <div 
                role="tabpanel" 
                id="finance-panel" 
                aria-labelledby="finance-tab"
              >
                <FinanceTab projectId={project.id} totalBudget={project.budget} />
              </div>
            )}

            {activeTab === 'impact' && (
              <div 
                role="tabpanel" 
                id="impact-panel" 
                aria-labelledby="impact-tab"
              >
                <ImpactTab projectId={project.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-slate-900">Approve Project</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to approve <strong>{project.title}</strong>? 
              This will change the status to Active and notify all stakeholders.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Approve Project
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-slate-900">Reject Project</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to reject <strong>{project.title}</strong>?
            </p>
            
            <textarea
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm mb-6 resize-none"
              rows={3}
              placeholder="Reason for rejection (optional)"
            />
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Reject Project
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}