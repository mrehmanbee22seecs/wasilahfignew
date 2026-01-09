import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-slate-200">
      <div className="max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
