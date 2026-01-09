import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface NavbarProps {
  logo?: React.ReactNode;
  children?: React.ReactNode;
}

export function Navbar({ logo, children }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {logo || <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>}
            <span className="text-gray-900">CSR Platform</span>
          </div>
          {children}
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export function NavbarLink({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href="#"
      className={`px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </a>
  );
}
