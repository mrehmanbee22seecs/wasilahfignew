import React, { useState } from 'react';
import { X, Shield, CheckSquare, Square } from 'lucide-react';

interface CreateRoleModalProps {
  isOpen: boolean;
  roleToEdit?: {
    roleId: string;
    name: string;
    description: string;
    permissions: string[];
  } | null;
  onClose: () => void;
  onSubmit: (payload: {
    roleId?: string;
    name: string;
    description: string;
    permissions: string[];
  }) => Promise<void>;
}

const AVAILABLE_PERMISSIONS = [
  {
    category: 'Vetting & Moderation',
    permissions: [
      { id: 'view_queue', label: 'View Moderation Queue' },
      { id: 'assign_cases', label: 'Assign Cases' },
      { id: 'approve_ngo', label: 'Approve NGOs' },
      { id: 'reject_ngo', label: 'Reject NGOs' },
      { id: 'conditional_approve', label: 'Conditional Approve' },
      { id: 'view_documents', label: 'View Documents' },
    ],
  },
  {
    category: 'Payments & Finance',
    permissions: [
      { id: 'view_payments', label: 'View Payment Holds' },
      { id: 'first_approval', label: 'Give First Approval' },
      { id: 'second_approval', label: 'Give Second Approval' },
      { id: 'reject_payment', label: 'Reject Payment Release' },
      { id: 'create_hold', label: 'Create Payment Hold' },
    ],
  },
  {
    category: 'Cases & Investigations',
    permissions: [
      { id: 'view_cases', label: 'View Cases' },
      { id: 'create_case', label: 'Create Cases' },
      { id: 'assign_investigator', label: 'Assign Investigators' },
      { id: 'escalate_case', label: 'Escalate Cases' },
      { id: 'close_case', label: 'Close/Resolve Cases' },
      { id: 'view_evidence', label: 'View Evidence' },
      { id: 'upload_evidence', label: 'Upload Evidence' },
    ],
  },
  {
    category: 'Audit & Reporting',
    permissions: [
      { id: 'view_audit_log', label: 'View Audit Log' },
      { id: 'export_data', label: 'Export Data' },
      { id: 'generate_reports', label: 'Generate Reports' },
    ],
  },
  {
    category: 'System Administration',
    permissions: [
      { id: 'manage_users', label: 'Manage Users' },
      { id: 'manage_roles', label: 'Manage Roles' },
      { id: 'configure_settings', label: 'Configure Settings' },
      { id: 'view_all_data', label: 'View All Data' },
    ],
  },
];

export function CreateRoleModal({ isOpen, roleToEdit, onClose, onSubmit }: CreateRoleModalProps) {
  const [name, setName] = useState(roleToEdit?.name || '');
  const [description, setDescription] = useState(roleToEdit?.description || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    roleToEdit?.permissions || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!roleToEdit;

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const selectAllInCategory = (category: typeof AVAILABLE_PERMISSIONS[0]) => {
    const categoryPermissionIds = category.permissions.map((p) => p.id);
    const allSelected = categoryPermissionIds.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !categoryPermissionIds.includes(p)));
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...categoryPermissionIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedPermissions.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        roleId: roleToEdit?.roleId,
        name: name.trim(),
        description: description.trim(),
        permissions: selectedPermissions,
      });
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Error creating/updating role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 id="modal-title" className="text-lg text-gray-900">
                  {isEditMode ? 'Edit Role' : 'Create New Role'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Role Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  Role Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Content Moderator, Senior Reviewer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the responsibilities and scope of this role..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-700">
                  Permissions <span className="text-red-600">*</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedPermissions.length} selected
                </span>
              </div>

              <div className="space-y-4">
                {AVAILABLE_PERMISSIONS.map((category) => {
                  const categoryPermissionIds = category.permissions.map((p) => p.id);
                  const allSelected = categoryPermissionIds.every((id) =>
                    selectedPermissions.includes(id)
                  );
                  const someSelected = categoryPermissionIds.some((id) =>
                    selectedPermissions.includes(id)
                  );

                  return (
                    <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                      {/* Category Header */}
                      <button
                        type="button"
                        onClick={() => selectAllInCategory(category)}
                        className="flex items-center gap-2 mb-3 text-sm text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
                      >
                        {allSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : someSelected ? (
                          <div className="w-5 h-5 border-2 border-blue-600 rounded flex items-center justify-center">
                            <div className="w-2.5 h-0.5 bg-blue-600" />
                          </div>
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="font-medium">{category.category}</span>
                      </button>

                      {/* Permissions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
                        {category.permissions.map((permission) => {
                          const isSelected = selectedPermissions.includes(permission.id);
                          return (
                            <label
                              key={permission.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePermission(permission.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{permission.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPermissions.length === 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  Please select at least one permission for this role.
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!name.trim() || selectedPermissions.length === 0 || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEditMode ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Changes' : 'Create Role'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
