import React from 'react';
import { CheckCircle, XCircle, Archive, UserX, Download, Mail, Trash2 } from 'lucide-react';

export type BulkAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant: 'primary' | 'success' | 'danger' | 'warning';
  onClick: () => void;
};

type BulkActionToolbarProps = {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  resourceType?: string;
};

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white',
};

export function BulkActionToolbar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  resourceType = 'items',
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-blue-600 border-b border-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-white">
                {selectedCount} {resourceType} selected
                {selectedCount === totalCount && (
                  <span className="ml-2 text-blue-100">(All)</span>
                )}
              </span>
            </div>

            <button
              onClick={onClearSelection}
              className="text-sm text-blue-100 hover:text-white transition-colors underline"
            >
              Clear selection
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${variantStyles[action.variant]}`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Preset bulk actions for common use cases
export const commonBulkActions = {
  approve: (onClick: () => void): BulkAction => ({
    id: 'approve',
    label: 'Approve',
    icon: <CheckCircle className="w-4 h-4" />,
    variant: 'success',
    onClick,
  }),
  reject: (onClick: () => void): BulkAction => ({
    id: 'reject',
    label: 'Reject',
    icon: <XCircle className="w-4 h-4" />,
    variant: 'danger',
    onClick,
  }),
  archive: (onClick: () => void): BulkAction => ({
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="w-4 h-4" />,
    variant: 'warning',
    onClick,
  }),
  suspend: (onClick: () => void): BulkAction => ({
    id: 'suspend',
    label: 'Suspend',
    icon: <UserX className="w-4 h-4" />,
    variant: 'warning',
    onClick,
  }),
  export: (onClick: () => void): BulkAction => ({
    id: 'export',
    label: 'Export',
    icon: <Download className="w-4 h-4" />,
    variant: 'primary',
    onClick,
  }),
  notify: (onClick: () => void): BulkAction => ({
    id: 'notify',
    label: 'Notify',
    icon: <Mail className="w-4 h-4" />,
    variant: 'primary',
    onClick,
  }),
  delete: (onClick: () => void): BulkAction => ({
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger',
    onClick,
  }),
};
