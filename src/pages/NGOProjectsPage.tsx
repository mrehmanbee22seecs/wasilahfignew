import React, { useState } from 'react';
import { FolderKanban, FileText, Menu, X, Home, User, TrendingUp, MessageSquare, HelpCircle, LogOut, Building2 } from 'lucide-react';
import { ProjectsTab } from '../components/ngo-projects/tabs/ProjectsTab';
import { ReportsTab } from '../components/ngo-projects/tabs/ReportsTab';
import { SubmitUpdateModal } from '../components/ngo-projects/SubmitUpdateModal';
import { MOCK_NGO_PROJECTS, MOCK_PROJECT_REPORTS } from '../data/mockNGOProjects';
import { MOCK_NGO } from '../data/mockNGOData';
import type { NGOAssignedProject, ProjectUpdate } from '../types/ngo-projects';
import { toast } from 'sonner@2.0.3';

type TabType = 'projects' | 'reports';

const TABS = [
  { id: 'projects' as TabType, label: 'Projects', icon: FolderKanban },
  { id: 'reports' as TabType, label: 'Reports', icon: FileText }
];

const NGO_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'scorecard', label: 'Scorecard', icon: TrendingUp }
];

export function NGOProjectsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<NGOAssignedProject | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [projects, setProjects] = useState(MOCK_NGO_PROJECTS);

  const handleSubmitUpdate = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowSubmitModal(true);
    }
  };

  const handleViewDetails = (projectId: string) => {
    toast.info('Project details drawer would open here');
    console.log('View project:', projectId);
  };

  const handleUpdateSubmit = async (update: Partial<ProjectUpdate>) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update project progress
    setProjects(prev => prev.map(p => {
      if (p.id === update.project_id) {
        const newTasksCompleted = p.tasks_completed + (update.tasks_completed?.length || 0);
        const newProgress = Math.round((newTasksCompleted / p.tasks_total) * 100);
        return {
          ...p,
          tasks_completed: newTasksCompleted,
          progress: newProgress,
          last_update: new Date().toISOString(),
          updates_count: p.updates_count + 1,
          beneficiaries_reached: p.beneficiaries_reached + (update.beneficiaries_count || 0)
        };
      }
      return p;
    }));

    console.log('Update submitted:', update);
  };

  const handleDownloadReport = (reportId: string, format: 'pdf' | 'docx') => {
    toast.success(`Downloading report as ${format.toUpperCase()}...`);
    console.log('Download report:', reportId, format);
  };

  const activeCounts = {
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b-2 border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {MOCK_NGO.logo_url && (
              <img src={MOCK_NGO.logo_url} alt={MOCK_NGO.name} className="w-10 h-10 rounded-lg" />
            )}
            <div>
              <h3 className="text-sm text-slate-900">{MOCK_NGO.name}</h3>
              <p className="text-xs text-slate-600">Projects</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r-2 border-slate-200 z-40
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full overflow-y-auto">
            {/* NGO Header */}
            <div className="p-6 border-b-2 border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                {MOCK_NGO.logo_url && (
                  <img
                    src={MOCK_NGO.logo_url}
                    alt={MOCK_NGO.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-sm text-slate-900 mb-1">{MOCK_NGO.name}</h2>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-700 border-2 border-emerald-200">
                    <Building2 className="w-3 h-3" />
                    NGO Account
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600 mb-0.5">Active</p>
                  <p className="text-lg text-emerald-900">{activeCounts.active}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-0.5">Completed</p>
                  <p className="text-lg text-blue-900">{activeCounts.completed}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4" role="navigation" aria-label="NGO navigation">
              <div className="space-y-1">
                {NGO_NAV_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = item.id === 'projects';
                  return (
                    <button
                      key={item.id}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md' 
                          : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t-2 border-slate-200 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5" />
                Help Center
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border-b-2 border-slate-200 px-6 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-slate-900 mb-1">Projects</h1>
                <p className="text-slate-600">
                  Manage assigned projects, submit updates, and download reports
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 border-b-2 border-slate-200">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-6 py-3 border-b-2 -mb-0.5 transition-colors
                        ${isActive
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                        }
                      `}
                      role="tab"
                      aria-selected={isActive}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={projects}
                  onSubmitUpdate={handleSubmitUpdate}
                  onViewDetails={handleViewDetails}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsTab
                  reports={MOCK_PROJECT_REPORTS}
                  onDownload={handleDownloadReport}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Submit Update Modal */}
      {selectedProject && (
        <SubmitUpdateModal
          isOpen={showSubmitModal}
          onClose={() => {
            setShowSubmitModal(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
}
