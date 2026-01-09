import React, { useState } from 'react';
import { Search, MoreVertical, Shield, Mail, Calendar, CheckCircle, XCircle, Lock } from 'lucide-react';

export type User = {
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  twoFactorEnabled: boolean;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
};

type UserManagementTableProps = {
  users: User[];
  onEditUser: (userId: string) => void;
  onToggle2FA: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  onResendInvite: (userId: string) => void;
  currentUserId?: string;
};

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '👑',
  },
  admin: {
    label: 'Admin',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '⚡',
  },
  moderator: {
    label: 'Moderator',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '🛡️',
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '👁️',
  },
};

const statusConfig = {
  active: {
    label: 'Active',
    color: 'text-emerald-700',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Inactive',
    color: 'text-gray-500',
    icon: XCircle,
  },
  suspended: {
    label: 'Suspended',
    color: 'text-red-700',
    icon: XCircle,
  },
};

export function UserManagementTable({
  users,
  onEditUser,
  onToggle2FA,
  onToggleStatus,
  onResendInvite,
  currentUserId = 'user-001',
}: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                2FA
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No users found matching your search
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const roleInfo = roleConfig[user.role];
                const statusInfo = statusConfig[user.status];
                const StatusIcon = statusInfo.icon;
                const isCurrentUser = user.userId === currentUserId;

                return (
                  <tr
                    key={user.userId}
                    className={`hover:bg-gray-50 transition-colors ${
                      isCurrentUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* User Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-900 truncate">
                              {user.name}
                            </p>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${roleInfo.color}`}
                      >
                        <span>{roleInfo.icon}</span>
                        <span>{roleInfo.label}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 text-sm ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* 2FA */}
                    <td className="px-4 py-3">
                      {user.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                          <Lock className="w-3 h-3" />
                          Enabled
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not enabled</span>
                      )}
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === user.userId ? null : user.userId)
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === user.userId && (
                          <>
                            {/* Backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />

                            {/* Menu */}
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                              <button
                                onClick={() => {
                                  onEditUser(user.userId);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Edit Role & Permissions
                              </button>

                              {!user.twoFactorEnabled && (
                                <button
                                  onClick={() => {
                                    onToggle2FA(user.userId);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  Enable 2FA
                                </button>
                              )}

                              {user.status === 'inactive' && (
                                <button
                                  onClick={() => {
                                    onResendInvite(user.userId);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  Resend Invite
                                </button>
                              )}

                              <div className="my-1 border-t border-gray-200" />

                              {user.status === 'active' && !isCurrentUser && (
                                <button
                                  onClick={() => {
                                    onToggleStatus(user.userId);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 transition-colors"
                                >
                                  Suspend User
                                </button>
                              )}

                              {user.status === 'suspended' && (
                                <button
                                  onClick={() => {
                                    onToggleStatus(user.userId);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  Reactivate User
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
}
