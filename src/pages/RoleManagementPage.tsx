import React, { useState, useEffect } from 'react';
import { Plus, Shield, Users, Search } from 'lucide-react';
import { RoleCard, Role } from '../components/admin/RoleCard';
import { CreateRoleModal } from '../components/admin/CreateRoleModal';
import { toast } from 'sonner';

/**
 * Role & Team Management Page
 * 
 * Route: /admin/roles
 * 
 * Features:
 * - View all roles and permissions
 * - Create custom roles
 * - Edit role permissions
 * - Delete roles (non-system)
 * - View users assigned to each role
 * - Granular permission management
 * 
 * API Endpoints:
 * - GET /admin/roles
 * - POST /admin/roles
 * - PATCH /admin/roles/:id
 * - DELETE /admin/roles/:id
 * - GET /admin/roles/:id/users
 */

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockRoles: Role[] = [
        {
          roleId: 'role-001',
          name: 'Admin',
          description: 'Full system access. Can manage all resources, users, and configurations.',
          permissions: [
            'view_queue',
            'assign_cases',
            'approve_ngo',
            'reject_ngo',
            'conditional_approve',
            'view_documents',
            'view_payments',
            'first_approval',
            'second_approval',
            'reject_payment',
            'create_hold',
            'view_cases',
            'create_case',
            'assign_investigator',
            'escalate_case',
            'close_case',
            'view_evidence',
            'upload_evidence',
            'view_audit_log',
            'export_data',
            'generate_reports',
            'manage_users',
            'manage_roles',
            'configure_settings',
            'view_all_data',
          ],
          userCount: 3,
          isSystem: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          roleId: 'role-002',
          name: 'Moderator',
          description:
            'Can review and process vetting requests, manage cases, but cannot configure system settings.',
          permissions: [
            'view_queue',
            'assign_cases',
            'approve_ngo',
            'reject_ngo',
            'conditional_approve',
            'view_documents',
            'view_cases',
            'create_case',
            'assign_investigator',
            'view_evidence',
            'upload_evidence',
            'view_audit_log',
          ],
          userCount: 8,
          isSystem: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-12-10T14:30:00Z',
        },
        {
          roleId: 'role-003',
          name: 'Reviewer',
          description:
            'Can view vetting queue and add notes, but cannot approve or reject. Used for initial screening.',
          permissions: ['view_queue', 'view_documents', 'view_cases', 'view_evidence', 'view_audit_log'],
          userCount: 5,
          isSystem: false,
          createdAt: '2025-02-15T10:00:00Z',
          updatedAt: '2025-11-20T09:15:00Z',
        },
        {
          roleId: 'role-004',
          name: 'Finance Approver',
          description:
            'Specialized role for payment processing. Can give first or second approval for payment releases.',
          permissions: [
            'view_payments',
            'first_approval',
            'second_approval',
            'reject_payment',
            'view_audit_log',
            'export_data',
          ],
          userCount: 4,
          isSystem: false,
          createdAt: '2025-03-01T11:00:00Z',
          updatedAt: '2025-12-01T16:45:00Z',
        },
        {
          roleId: 'role-005',
          name: 'Investigator',
          description:
            'Focused on case investigations. Can create, manage, and escalate cases with full evidence access.',
          permissions: [
            'view_cases',
            'create_case',
            'assign_investigator',
            'escalate_case',
            'close_case',
            'view_evidence',
            'upload_evidence',
            'view_audit_log',
          ],
          userCount: 6,
          isSystem: false,
          createdAt: '2025-04-10T09:30:00Z',
          updatedAt: '2025-11-15T13:20:00Z',
        },
        {
          roleId: 'role-006',
          name: 'Viewer',
          description: 'Read-only access. Can view queues and audit logs but cannot make any changes.',
          permissions: ['view_queue', 'view_cases', 'view_payments', 'view_audit_log'],
          userCount: 12,
          isSystem: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      setRoles(mockRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrEdit = async (payload: {
    roleId?: string;
    name: string;
    description: string;
    permissions: string[];
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (payload.roleId) {
      // Edit existing role
      setRoles((prev) =>
        prev.map((role) =>
          role.roleId === payload.roleId
            ? {
                ...role,
                name: payload.name,
                description: payload.description,
                permissions: payload.permissions,
                updatedAt: new Date().toISOString(),
              }
            : role
        )
      );
      toast.success('Role updated successfully');
    } else {
      // Create new role
      const newRole: Role = {
        roleId: `role-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        permissions: payload.permissions,
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoles((prev) => [newRole, ...prev]);
      toast.success('Role created successfully');
    }

    setCreateModalOpen(false);
    setRoleToEdit(null);
  };

  const handleEdit = (roleId: string) => {
    const role = roles.find((r) => r.roleId === roleId);
    if (role) {
      setRoleToEdit(role);
      setCreateModalOpen(true);
    }
  };

  const handleDelete = (roleId: string) => {
    const role = roles.find((r) => r.roleId === roleId);
    if (role) {
      setRoleToDelete(role);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    await new Promise((resolve) => setTimeout(resolve, 800));
    setRoles((prev) => prev.filter((r) => r.roleId !== roleToDelete.roleId));
    toast.success('Role deleted successfully');
    setDeleteConfirmOpen(false);
    setRoleToDelete(null);
  };

  const handleViewUsers = (roleId: string) => {
    toast.info(`View users for role ${roleId}`);
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
  const totalPermissions = Array.from(new Set(roles.flatMap((r) => r.permissions))).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Role & Team Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage roles with granular permissions
              </p>
            </div>
            <button
              onClick={() => {
                setRoleToEdit(null);
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>Create Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Roles</p>
                <p className="text-2xl text-gray-900">{roles.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Users</p>
                <p className="text-2xl text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Unique Permissions</p>
                <p className="text-2xl text-gray-900">{totalPermissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Roles Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600 mt-4">Loading roles...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No roles found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <RoleCard
                key={role.roleId}
                role={role}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewUsers={handleViewUsers}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Role Modal */}
      <CreateRoleModal
        isOpen={createModalOpen}
        roleToEdit={roleToEdit}
        onClose={() => {
          setCreateModalOpen(false);
          setRoleToEdit(null);
        }}
        onSubmit={handleCreateOrEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && roleToDelete && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setDeleteConfirmOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg text-gray-900 mb-2">Delete Role?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete the role "{roleToDelete.name}"? This action cannot
                be undone.
                {roleToDelete.userCount > 0 && (
                  <span className="block mt-2 text-red-600">
                    Warning: {roleToDelete.userCount} user{roleToDelete.userCount !== 1 ? 's are' : ' is'}{' '}
                    currently assigned to this role.
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
