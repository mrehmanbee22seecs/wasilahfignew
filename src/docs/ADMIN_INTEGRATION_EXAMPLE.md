# Admin Dashboard Integration Example

## Complete Usage Example

This document shows how to integrate all admin components together in a production application.

## Example: Enhanced Admin Dashboard with All Features

```typescript
import React, { useState } from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Import all components
import { NotificationsPanel, Notification } from '../components/admin/NotificationsPanel';
import { GlobalSearch, SearchResult } from '../components/admin/GlobalSearch';
import { ExportPackageGenerator } from '../components/admin/ExportPackageGenerator';

export default function EnhancedAdminDashboard() {
  // State management
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-001',
      type: 'alert',
      title: 'New Vetting Request',
      message: 'Pakistan Education Foundation submitted vetting documents',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      actionLabel: 'Review Now',
      actionUrl: '/admin?vetting=vet-001',
      resourceType: 'vetting',
      resourceId: 'vet-001',
    },
    {
      id: 'notif-002',
      type: 'warning',
      title: 'Case Escalated',
      message: 'CASE-003 has been escalated to senior review',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      actionLabel: 'View Case',
      actionUrl: '/admin/cases/case-003',
      resourceType: 'case',
      resourceId: 'case-003',
    },
    {
      id: 'notif-003',
      type: 'success',
      title: 'Payment Released',
      message: 'PKR 450,000 released for Clean Water Initiative',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true,
      actionLabel: 'View Details',
      actionUrl: '/admin/payments/hold-001',
      resourceType: 'payment',
      resourceId: 'hold-001',
    },
  ]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
      
      // Cmd/Ctrl + N for notifications
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setNotificationsPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationAction = (notification: Notification) => {
    console.log('Navigate to:', notification.actionUrl);
    setNotificationsPanelOpen(false);
    // In production: navigate to URL
  };

  const handleSearchResult = (result: SearchResult) => {
    console.log('Navigate to:', result.url);
    // In production: navigate to URL
  };

  const handleGenerateExport = async (config: any) => {
    console.log('Generate export:', config);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Export job queued. You\'ll be notified when ready.');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with integrated actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, Ahmed Khan
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              {/* Global Search Button */}
              <button
                onClick={() => setGlobalSearchOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Search (Cmd+K)"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="px-2 py-0.5 text-xs bg-white border border-gray-300 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Notifications Button */}
              <button
                onClick={() => setNotificationsPanelOpen(true)}
                className="relative p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Notifications (Cmd+N)"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Settings Link */}
              <button
                onClick={() => console.log('Navigate to settings')}
                className="p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Admin Avatar */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm text-blue-700">AK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Your dashboard content here */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => console.log('Navigate to moderation queue')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="text-gray-900 mb-1">Moderation Queue</h3>
              <p className="text-sm text-gray-600">Review pending vetting requests</p>
            </button>

            <button
              onClick={() => console.log('Navigate to cases')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors"
            >
              <h3 className="text-gray-900 mb-1">Case Management</h3>
              <p className="text-sm text-gray-600">Investigate incidents and issues</p>
            </button>

            <button
              onClick={() => setExportModalOpen(true)}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              <h3 className="text-gray-900 mb-1">Generate Export</h3>
              <p className="text-sm text-gray-600">Create evidence packages</p>
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm text-blue-900 mb-2">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
            <div>
              <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">⌘K</kbd>{' '}
              Search
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">⌘N</kbd>{' '}
              Notifications
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">↑↓</kbd>{' '}
              Navigate
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">Enter</kbd>{' '}
              Open
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Components */}
      <NotificationsPanel
        isOpen={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onAction={handleNotificationAction}
      />

      <GlobalSearch
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        onResultClick={handleSearchResult}
      />

      <ExportPackageGenerator
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onGenerate={handleGenerateExport}
      />
    </div>
  );
}
```

## Integration with Existing Admin Dashboard

To enhance the existing AdminDashboard.tsx with these components:

```typescript
// In /pages/AdminDashboard.tsx

import { NotificationsPanel, Notification } from '../components/admin/NotificationsPanel';
import { GlobalSearch, SearchResult } from '../components/admin/GlobalSearch';
import { ExportPackageGenerator } from '../components/admin/ExportPackageGenerator';

// Add to state:
const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
const [exportModalOpen, setExportModalOpen] = useState(false);

// In the header section, replace the global search input with:
<button
  onClick={() => setGlobalSearchOpen(true)}
  className="relative w-64"
>
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    type="text"
    placeholder="Search... (⌘K)"
    readOnly
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
  />
</button>

<button
  onClick={() => setNotificationsPanelOpen(true)}
  className="relative p-2 hover:bg-gray-100 rounded-lg"
>
  <Bell className="w-5 h-5" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</button>

// Add at the end of the return statement:
<NotificationsPanel
  isOpen={notificationsPanelOpen}
  onClose={() => setNotificationsPanelOpen(false)}
  notifications={notifications}
  onMarkAsRead={handleMarkAsRead}
  onMarkAllAsRead={handleMarkAllAsRead}
  onAction={handleNotificationAction}
/>

<GlobalSearch
  isOpen={globalSearchOpen}
  onClose={() => setGlobalSearchOpen(false)}
  onResultClick={handleSearchResult}
/>
```

## API Integration Example

```typescript
// Example API service for admin dashboard

export class AdminAPI {
  // Vetting
  static async getVettingRequests(filters: FilterState) {
    const response = await fetch('/api/admin/vetting?' + new URLSearchParams(filters));
    return response.json();
  }

  static async approveVetting(vettingId: string, payload: any) {
    const response = await fetch(`/api/admin/vetting/${vettingId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Cases
  static async getCases(filters: any) {
    const response = await fetch('/api/admin/cases?' + new URLSearchParams(filters));
    return response.json();
  }

  static async createCase(payload: any) {
    const response = await fetch('/api/admin/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Payments
  static async getPaymentHolds(filters: any) {
    const response = await fetch('/api/admin/payments/holds?' + new URLSearchParams(filters));
    return response.json();
  }

  static async approvePayment(holdId: string, payload: any) {
    const response = await fetch(`/api/admin/payments/holds/${holdId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Audit Log
  static async getAuditLogs(filters: any) {
    const response = await fetch('/api/admin/audit-log?' + new URLSearchParams(filters));
    return response.json();
  }

  static async exportAuditLogs(format: 'csv' | 'json', filters: any) {
    const response = await fetch(`/api/admin/audit-log/export?format=${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return response.blob();
  }

  // Roles
  static async getRoles() {
    const response = await fetch('/api/admin/roles');
    return response.json();
  }

  static async createRole(payload: any) {
    const response = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Settings
  static async getSettings() {
    const response = await fetch('/api/admin/settings');
    return response.json();
  }

  static async updateSettings(payload: any) {
    const response = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Search
  static async globalSearch(query: string, types?: string[]) {
    const params = new URLSearchParams({ q: query });
    if (types) params.append('types', types.join(','));
    const response = await fetch('/api/admin/search?' + params);
    return response.json();
  }

  // Notifications
  static async getNotifications() {
    const response = await fetch('/api/admin/notifications');
    return response.json();
  }

  static async markNotificationRead(id: string) {
    const response = await fetch(`/api/admin/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return response.json();
  }

  // Exports
  static async generateExport(config: any) {
    const response = await fetch('/api/admin/exports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.json();
  }

  static async getExportStatus(jobId: string) {
    const response = await fetch(`/api/admin/exports/${jobId}/status`);
    return response.json();
  }
}
```

## Supabase Integration Example

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Real-time subscriptions
export function useVettingRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Initial fetch
    const fetchRequests = async () => {
      const { data } = await supabase
        .from('vetting_requests')
        .select('*')
        .order('submitted_at', { ascending: false });
      setRequests(data || []);
    };
    fetchRequests();

    // Subscribe to changes
    const subscription = supabase
      .channel('vetting_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vetting_requests' },
        (payload) => {
          console.log('Change received!', payload);
          fetchRequests(); // Refetch on change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return requests;
}

// Audit log insert (automatic trigger)
export async function insertAuditLog(entry: AuditLogEntry) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert(entry);
  
  if (error) console.error('Audit log error:', error);
  return data;
}

// Role-based access control
export async function checkPermission(userId: string, permission: string) {
  const { data } = await supabase
    .from('user_roles')
    .select('roles(permissions)')
    .eq('user_id', userId)
    .single();

  return data?.roles?.permissions?.includes(permission) || false;
}
```

## Testing Example

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationsPanel } from './NotificationsPanel';

describe('NotificationsPanel', () => {
  const mockNotifications = [
    {
      id: '1',
      type: 'alert',
      title: 'Test Notification',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];

  it('renders notification count badge', () => {
    render(
      <NotificationsPanel
        isOpen={true}
        onClose={() => {}}
        notifications={mockNotifications}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
        onAction={() => {}}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('marks notification as read on click', async () => {
    const mockMarkAsRead = jest.fn();
    
    render(
      <NotificationsPanel
        isOpen={true}
        onClose={() => {}}
        notifications={mockNotifications}
        onMarkAsRead={mockMarkAsRead}
        onMarkAllAsRead={() => {}}
        onAction={() => {}}
      />
    );

    const markButton = screen.getByLabelText('Mark as read');
    fireEvent.click(markButton);

    await waitFor(() => {
      expect(mockMarkAsRead).toHaveBeenCalledWith('1');
    });
  });
});
```

---

This integration example shows how all the admin components work together in a cohesive system!
