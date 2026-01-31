import React, { useState } from 'react';
import { Menu, X, Home, Shield, Clock, FolderKanban, User, HelpCircle, LogOut, Bell, ArrowLeft } from 'lucide-react';
import { BackgroundCheckTab } from '../components/volunteer/BackgroundCheckTab';
import { HoursTrackingTab } from '../components/volunteer/HoursTrackingTab';
import { 
  MOCK_BACKGROUND_CHECK, 
  BACKGROUND_CHECK_REQUIREMENTS,
  MOCK_VOLUNTEER_SESSIONS,
  MOCK_HOURS_SUMMARY,
  MOCK_AVAILABLE_PROJECTS
} from '../data/mockVolunteerData';
import type { BackgroundCheck, VolunteerHoursSession, CheckInRequest, CheckOutRequest } from '../types/volunteer-verification';
import { toast } from 'sonner';

type TabId = 'overview' | 'hours' | 'background' | 'projects' | 'profile';

const TABS = [
  { id: 'overview' as TabId, label: 'Overview', icon: Home },
  { id: 'hours' as TabId, label: 'Hours', icon: Clock },
  { id: 'background' as TabId, label: 'Background Check', icon: Shield },
  { id: 'projects' as TabId, label: 'My Projects', icon: FolderKanban },
  { id: 'profile' as TabId, label: 'Profile', icon: User }
];

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backgroundCheck, setBackgroundCheck] = useState<BackgroundCheck | null>(MOCK_BACKGROUND_CHECK);
  const [sessions, setSessions] = useState<VolunteerHoursSession[]>(MOCK_VOLUNTEER_SESSIONS);
  const [hoursSummary, setHoursSummary] = useState(MOCK_HOURS_SUMMARY);

  const activeSession = sessions.find(s => s.status === 'checked_in') || null;

  const volunteerInfo = {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    joinedDate: '2024-10-15',
    isVerified: backgroundCheck?.status === 'approved'
  };

  // Handler functions
  const handleSubmitBackgroundCheck = async (checkType: BackgroundCheck['checkType'], documents: File[]) => {
    console.log('Submit background check:', checkType, documents);
    
    // TODO: Implement Supabase upload and insert
    // 1. Upload documents to Supabase Storage
    // 2. Create background check record
    // 3. Update volunteer profile
    
    // Mock response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBackgroundCheck({
      id: 'bgc-' + Date.now(),
      volunteerId: 'vol-123',
      volunteerName: volunteerInfo.name,
      status: 'pending_review',
      checkType,
      submittedAt: new Date().toISOString(),
      documents: documents.map((file, idx) => ({
        id: 'doc-' + idx,
        type: 'cnic',
        fileName: file.name,
        fileUrl: 'https://example.com/docs/' + file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'pending'
      })),
      notes: 'Submitted for review'
    });
  };

  const handleUploadDocument = async (file: File, type: any) => {
    console.log('Upload document:', file.name, type);
    
    // TODO: Implement Supabase Storage upload
    // const { data, error } = await supabase.storage
    //   .from('volunteer-documents')
    //   .upload(`${volunteerId}/${type}/${Date.now()}_${file.name}`, file);
    
    return 'https://example.com/docs/' + file.name;
  };

  const handleCheckIn = async (request: CheckInRequest) => {
    console.log('Check in:', request);
    
    // TODO: Implement Supabase insert
    // await supabase.from('volunteer_hours_sessions').insert({
    //   volunteer_id: volunteerId,
    //   project_id: request.projectId,
    //   check_in_time: new Date().toISOString(),
    //   check_in_location: request.latitude ? { lat: request.latitude, lng: request.longitude } : null,
    //   task_description: request.taskDescription,
    //   status: 'checked_in'
    // });
    
    // Mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const project = MOCK_AVAILABLE_PROJECTS.find(p => p.id === request.projectId);
    
    const newSession: VolunteerHoursSession = {
      id: 'session-' + Date.now(),
      volunteerId: 'vol-123',
      volunteerName: volunteerInfo.name,
      projectId: request.projectId,
      projectName: project?.name || 'Unknown Project',
      ngoId: 'ngo-1',
      ngoName: project?.ngoName || 'Unknown NGO',
      checkInTime: new Date().toISOString(),
      checkInLocation: request.latitude ? {
        latitude: request.latitude,
        longitude: request.longitude,
        address: request.address || 'Current Location'
      } : undefined,
      status: 'checked_in',
      taskDescription: request.taskDescription
    };
    
    setSessions(prev => [newSession, ...prev]);
  };

  const handleCheckOut = async (request: CheckOutRequest) => {
    console.log('Check out:', request);
    
    // TODO: Implement Supabase update
    // await supabase.from('volunteer_hours_sessions')
    //   .update({
    //     check_out_time: new Date().toISOString(),
    //     check_out_location: request.latitude ? { lat: request.latitude, lng: request.longitude } : null,
    //     notes: request.notes,
    //     status: 'checked_out'
    //   })
    //   .eq('id', request.sessionId);
    
    // Mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSessions(prev => prev.map(session => {
      if (session.id === request.sessionId) {
        const checkOutTime = new Date();
        const checkInTime = new Date(session.checkInTime);
        const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...session,
          checkOutTime: checkOutTime.toISOString(),
          checkOutLocation: request.latitude ? {
            latitude: request.latitude,
            longitude: request.longitude,
            address: request.address || 'Current Location'
          } : undefined,
          totalHours: Math.round(hours * 100) / 100,
          status: 'checked_out' as const,
          notes: request.notes
        };
      }
      return session;
    }));
    
    // Update summary
    setHoursSummary(prev => ({
      ...prev,
      pendingHours: prev.pendingHours + 5 // Approximate
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b-2 border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={volunteerInfo.avatar} 
              alt={volunteerInfo.name} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-sm text-slate-900">{volunteerInfo.name}</h3>
              <span className="text-xs text-gray-600">
                {volunteerInfo.isVerified ? '✓ Verified' : 'Not verified'}
              </span>
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
            {/* Header */}
            <div className="p-6 border-b-2 border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={volunteerInfo.avatar} 
                  alt={volunteerInfo.name}
                  className="w-16 h-16 rounded-full border-2 border-slate-200"
                />
                <div className="flex-1">
                  <h2 className="text-sm text-slate-900 mb-1">{volunteerInfo.name}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border-2 ${
                    volunteerInfo.isVerified 
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {volunteerInfo.isVerified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-0.5">This Month</p>
                  <p className="text-lg text-slate-900">{hoursSummary.thisMonth}h</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-0.5">All Time</p>
                  <p className="text-lg text-slate-900">{hoursSummary.allTime}h</p>
                </div>
              </div>

              {/* Active Session Indicator */}
              {activeSession && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <p className="text-xs text-blue-900 font-medium">Active Session</p>
                  </div>
                  <p className="text-xs text-blue-800">{activeSession.projectName}</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md' 
                          : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t-2 border-slate-200 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5" />
                Help Center
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border-2 border-teal-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Exit Dashboard
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
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border-b-2 border-slate-200 px-6 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-slate-900 mb-1">Volunteer Dashboard</h1>
              <p className="text-slate-600">
                Track your volunteer hours and manage your profile
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Overview</h2>
                  <p className="text-gray-600">Welcome to your volunteer dashboard! Get started by checking in to a project or completing your background verification.</p>
                </div>
              )}

              {activeTab === 'hours' && (
                <HoursTrackingTab
                  sessions={sessions}
                  summary={hoursSummary}
                  activeSession={activeSession}
                  availableProjects={MOCK_AVAILABLE_PROJECTS}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              )}

              {activeTab === 'background' && (
                <BackgroundCheckTab
                  backgroundCheck={backgroundCheck}
                  requirements={BACKGROUND_CHECK_REQUIREMENTS}
                  onSubmitCheck={handleSubmitBackgroundCheck}
                  onUploadDocument={handleUploadDocument}
                />
              )}

              {activeTab === 'projects' && (
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">My Projects</h2>
                  <p className="text-gray-600">Your enrolled projects will appear here.</p>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Profile Settings</h2>
                  <p className="text-gray-600">Manage your profile information.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}