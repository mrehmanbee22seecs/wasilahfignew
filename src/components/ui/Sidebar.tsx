import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 bg-white border-r border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export function SidebarItem({ icon, children, active = false, badge, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="w-5 h-5">{icon}</span>}
        <span>{children}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">{badge}</span>
      )}
    </button>
  );
}

export function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h4 className="px-4 mb-2 text-gray-500 uppercase tracking-wide">{title}</h4>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}
