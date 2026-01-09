import React from 'react';
import { Shield, Users, Edit, Trash2 } from 'lucide-react';

export interface Role {
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoleCardProps {
  role: Role;
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  onViewUsers: (roleId: string) => void;
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 border-red-200 text-red-700',
  moderator: 'bg-blue-100 border-blue-200 text-blue-700',
  reviewer: 'bg-emerald-100 border-emerald-200 text-emerald-700',
  viewer: 'bg-gray-100 border-gray-200 text-gray-700',
};

export function RoleCard({ role, onEdit, onDelete, onViewUsers }: RoleCardProps) {
  const colorClass = roleColors[role.name.toLowerCase()] || roleColors.viewer;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">{role.name}</h3>
            {role.isSystem && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200">
                System
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{role.description}</p>
        </div>
      </div>

      {/* Permissions Count */}
      <div className="mb-3">
        <div className={`inline-flex items-center px-3 py-1.5 rounded border ${colorClass}`}>
          <span className="text-sm">
            {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Users Count */}
      <button
        onClick={() => onViewUsers(role.roleId)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
      >
        <Users className="w-4 h-4" />
        <span>
          {role.userCount} user{role.userCount !== 1 ? 's' : ''}
        </span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onEdit(role.roleId)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        {!role.isSystem && (
          <button
            onClick={() => onDelete(role.roleId)}
            className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete role"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Updated {new Date(role.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
