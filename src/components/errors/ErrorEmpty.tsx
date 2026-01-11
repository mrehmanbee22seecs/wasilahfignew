import React from 'react';
import { Inbox, Search, FileX, Users, FolderX } from 'lucide-react';

interface ErrorEmptyProps {
  type?: 'data' | 'search' | 'file' | 'users' | 'folder';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorEmpty({
  type = 'data',
  title,
  message,
  action,
  className = '',
}: ErrorEmptyProps) {
  const icons = {
    data: Inbox,
    search: Search,
    file: FileX,
    users: Users,
    folder: FolderX,
  };

  const defaults = {
    data: {
      title: 'No data available',
      message: 'There is no data to display at the moment.',
    },
    search: {
      title: 'No results found',
      message: 'Try adjusting your search criteria.',
    },
    file: {
      title: 'No files found',
      message: 'Upload files to get started.',
    },
    users: {
      title: 'No users found',
      message: 'No users match your criteria.',
    },
    folder: {
      title: 'Folder is empty',
      message: 'This folder does not contain any items.',
    },
  };

  const Icon = icons[type];
  const defaultContent = defaults[type];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title || defaultContent.title}
      </h3>
      
      <p className="text-sm text-slate-600 text-center max-w-sm mb-6">
        {message || defaultContent.message}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
