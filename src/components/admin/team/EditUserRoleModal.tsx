import React, { useState } from 'react';
import { X, Shield, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'super_admin' | 'admin' | 'moderator' | 'viewer';

type Permission = {
  id: string;
  label: string;
  description: string;
  category: string;
};

type EditUserRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    userId: string;
    name: string;
    email: string;
    role: Role;
    permissions: string[];
  };
  onSubmit: (data: { userId: string; role: Role; permissions: string[] }) => Promise<void>;
  currentUserRole: Role;
};

const roleOptions: { value: Role; label: string; description: string; icon: string }[] = [
  {
    value: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access, can manage other admins',
    icon: '👑',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage users, approve payments, view all data',
    icon: '⚡',
  },
  {
    value: 'moderator',
    label: 'Moderator',
    description: 'Can moderate content, limited financial access',
    icon: '🛡️',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to reports and analytics',
    icon: '👁️',
  },
];

const availablePermissions: Permission[] = [
  {
    id: 'approve_payments',
    label: 'Approve Payments',
    description: 'Can approve payment holds and releases',
    category: 'Financial',
  },
  {
    id: 'manage_users',
    label: 'Manage Users',
    description: 'Can create, edit, and suspend user accounts',
    category: 'Administration',
  },
  {
    id: 'view_audit_log',
    label: 'View Audit Log',
    description: 'Access to full system audit trail',
    category: 'Security',
  },
  {
    id: 'manage_projects',
    label: 'Manage Projects',
    description: 'Can approve, edit, or suspend projects',
    category: 'Operations',
  },
  {
    id: 'manage_ngos',
    label: 'Manage NGOs',
    description: 'Can verify, approve, or suspend NGO accounts',
    category: 'Operations',
  },
  {
    id: 'export_data',
    label: 'Export Data',
    description: 'Can export reports and user data',
    category: 'Data',
  },
  {
    id: 'system_settings',
    label: 'System Settings',
    description: 'Can modify platform configuration',
    category: 'Administration',
  },
];

export function EditUserRoleModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  currentUserRole,
}: EditUserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async () => {
    // Validation: Super Admin cannot downgrade themselves
    if (currentUserRole === 'super_admin' && selectedRole !== 'super_admin') {
      toast.error('Super Admins cannot downgrade their own role');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        userId: user.userId,
        role: selectedRole,
        permissions: selectedPermissions,
      });
      toast.success('User role updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges =
    selectedRole !== user.role ||
    JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(user.permissions.sort());

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-900">Edit User Role</h2>
            <p className="text-sm text-gray-600 mt-1">
              {user.name} ({user.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => {
                const isDisabled =
                  currentUserRole !== 'super_admin' && option.value === 'super_admin';

                return (
                  <button
                    key={option.value}
                    onClick={() => !isDisabled && setSelectedRole(option.value)}
                    disabled={isDisabled}
                    className={`
                      p-4 border-2 rounded-lg text-left transition-all
                      ${
                        selectedRole === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning Banner */}
          {selectedRole !== user.role && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">Role Change Warning</p>
                <p className="text-amber-700">
                  Changing this user's role from{' '}
                  <strong>{roleOptions.find((r) => r.value === user.role)?.label}</strong> to{' '}
                  <strong>{roleOptions.find((r) => r.value === selectedRole)?.label}</strong>{' '}
                  will immediately affect their access permissions.
                </p>
              </div>
            </div>
          )}

          {/* Permissions */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Additional Permissions
            </label>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    {category}
                  </p>
                  <div className="space-y-2">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handleTogglePermission(permission.id)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{permission.label}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">About Permissions</p>
              <p className="text-blue-700">
                Role-based permissions are automatically assigned. Additional permissions allow
                fine-grained control for specific use cases.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Update Role
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
