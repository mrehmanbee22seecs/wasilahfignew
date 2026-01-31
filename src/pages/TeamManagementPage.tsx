import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';
import { UserManagementTable, User } from '../components/admin/team/UserManagementTable';
import { EditUserRoleModal } from '../components/admin/team/EditUserRoleModal';
import { InviteUserModal } from '../components/admin/team/InviteUserModal';
import { TwoFactorSetupModal } from '../components/admin/team/TwoFactorSetupModal';
import { toast } from 'sonner';

/**
 * Team Management Page
 * 
 * Route: /admin/team
 * 
 * Features:
 * - User list with role management
 * - Invite new team members
 * - Edit roles and permissions
 * - Enable/disable 2FA for users
 * - Suspend/reactivate accounts
 * 
 * API Endpoints:
 * - GET /admin/users
 * - POST /admin/users/invite
 * - PATCH /admin/users/:id/role
 * - POST /admin/users/:id/2fa/setup
 * - PATCH /admin/users/:id/status
 */

export default function TeamManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const currentUserId = 'user-001';
  const currentUserRole = 'super_admin';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUsers: User[] = [
        {
          userId: 'user-001',
          name: 'Ahmed Khan',
          email: 'ahmed.khan@wasilah.pk',
          role: 'super_admin',
          status: 'active',
          twoFactorEnabled: true,
          lastLogin: '2025-12-16T08:30:00Z',
          createdAt: '2024-01-15T00:00:00Z',
          permissions: ['approve_payments', 'manage_users', 'view_audit_log', 'system_settings'],
        },
        {
          userId: 'user-002',
          name: 'Sarah Ahmed',
          email: 'sarah.ahmed@wasilah.pk',
          role: 'admin',
          status: 'active',
          twoFactorEnabled: true,
          lastLogin: '2025-12-15T16:45:00Z',
          createdAt: '2024-02-20T00:00:00Z',
          permissions: ['approve_payments', 'manage_projects', 'view_audit_log'],
        },
        {
          userId: 'user-003',
          name: 'Fatima Ali',
          email: 'fatima.ali@wasilah.pk',
          role: 'admin',
          status: 'active',
          twoFactorEnabled: false,
          lastLogin: '2025-12-14T14:20:00Z',
          createdAt: '2024-03-10T00:00:00Z',
          permissions: ['approve_payments', 'manage_ngos'],
        },
        {
          userId: 'user-004',
          name: 'Ali Hassan',
          email: 'ali.hassan@wasilah.pk',
          role: 'moderator',
          status: 'active',
          twoFactorEnabled: true,
          lastLogin: '2025-12-16T07:00:00Z',
          createdAt: '2024-04-05T00:00:00Z',
          permissions: ['manage_projects', 'manage_ngos'],
        },
        {
          userId: 'user-005',
          name: 'Zainab Malik',
          email: 'zainab.malik@wasilah.pk',
          role: 'viewer',
          status: 'active',
          twoFactorEnabled: false,
          lastLogin: '2025-12-15T11:30:00Z',
          createdAt: '2024-05-12T00:00:00Z',
          permissions: ['export_data'],
        },
        {
          userId: 'user-006',
          name: 'Omar Siddiqui',
          email: 'omar.siddiqui@wasilah.pk',
          role: 'admin',
          status: 'inactive',
          twoFactorEnabled: false,
          lastLogin: '2024-12-01T00:00:00Z',
          createdAt: '2024-11-20T00:00:00Z',
          permissions: [],
        },
        {
          userId: 'user-007',
          name: 'Hassan Raza',
          email: 'hassan.raza@wasilah.pk',
          role: 'moderator',
          status: 'suspended',
          twoFactorEnabled: true,
          lastLogin: '2025-11-15T00:00:00Z',
          createdAt: '2024-06-18T00:00:00Z',
          permissions: [],
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (data: {
    email: string;
    role: 'super_admin' | 'admin' | 'moderator' | 'viewer';
    name: string;
    message?: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser: User = {
      userId: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'inactive',
      twoFactorEnabled: false,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      permissions: [],
    };

    setUsers((prev) => [newUser, ...prev]);
    console.log('User invited:', data);
    // In production: POST to /admin/users/invite
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.userId === userId);
    if (user) {
      setSelectedUser(user);
      setEditModalOpen(true);
    }
  };

  const handleUpdateUserRole = async (data: {
    userId: string;
    role: 'super_admin' | 'admin' | 'moderator' | 'viewer';
    permissions: string[];
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setUsers((prev) =>
      prev.map((user) =>
        user.userId === data.userId
          ? { ...user, role: data.role, permissions: data.permissions }
          : user
      )
    );

    console.log('User role updated:', data);
    // In production: PATCH to /admin/users/:id/role
  };

  const handleToggle2FA = (userId: string) => {
    const user = users.find((u) => u.userId === userId);
    if (user) {
      setSelectedUser(user);
      setTwoFAModalOpen(true);
    }
  };

  const handleComplete2FA = async (userId: string, backupCodes: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    setUsers((prev) =>
      prev.map((user) =>
        user.userId === userId ? { ...user, twoFactorEnabled: true } : user
      )
    );

    console.log('2FA enabled for user:', userId, 'Backup codes:', backupCodes);
    // In production: POST to /admin/users/:id/2fa/setup
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.userId === userId);
    if (!user) return;

    const action = user.status === 'active' ? 'suspend' : 'reactivate';
    const confirmMsg = `Are you sure you want to ${action} ${user.name}?`;

    if (!window.confirm(confirmMsg)) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId
          ? {
              ...u,
              status: u.status === 'active' ? ('suspended' as const) : ('active' as const),
            }
          : u
      )
    );

    toast.success(`User ${action}d successfully`);
    // In production: PATCH to /admin/users/:id/status
  };

  const handleResendInvite = async (userId: string) => {
    const user = users.find((u) => u.userId === userId);
    if (!user) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Invitation resent to ${user.email}`);
    // In production: POST to /admin/users/:id/resend-invite
  };

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    twoFactorEnabled: users.filter((u) => u.twoFactorEnabled).length,
    pendingInvites: users.filter((u) => u.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Team Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage admin users, roles, and permissions
              </p>
            </div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Invite Team Member
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Users</p>
                <p className="text-2xl text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Active Users</p>
                <p className="text-2xl text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">2FA Enabled</p>
                <p className="text-2xl text-gray-900">{stats.twoFactorEnabled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Pending Invites</p>
                <p className="text-2xl text-gray-900">{stats.pendingInvites}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        {isLoading ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600 mt-4">Loading users...</p>
          </div>
        ) : (
          <UserManagementTable
            users={users}
            onEditUser={handleEditUser}
            onToggle2FA={handleToggle2FA}
            onToggleStatus={handleToggleStatus}
            onResendInvite={handleResendInvite}
            currentUserId={currentUserId}
          />
        )}
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSubmit={handleInviteUser}
      />

      {/* Edit User Role Modal */}
      {selectedUser && (
        <EditUserRoleModal
          isOpen={editModalOpen}
          user={selectedUser}
          currentUserRole={currentUserRole}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdateUserRole}
        />
      )}

      {/* Two-Factor Setup Modal */}
      {selectedUser && (
        <TwoFactorSetupModal
          isOpen={twoFAModalOpen}
          userId={selectedUser.userId}
          userName={selectedUser.name}
          onClose={() => {
            setTwoFAModalOpen(false);
            setSelectedUser(null);
          }}
          onComplete={handleComplete2FA}
        />
      )}
    </div>
  );
}
