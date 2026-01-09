import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}

export function Container({ children, className = '' }: LayoutProps) {
  return (
    <div className={`max-w-7xl mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}

export function Grid({ 
  children, 
  cols = 1, 
  gap = 6,
  className = '' 
}: { 
  children: React.ReactNode; 
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: number;
  className?: string;
}) {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
  };

  return (
    <div className={`grid ${colsMap[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

export function Stack({ 
  children, 
  direction = 'vertical',
  gap = 4,
  className = '' 
}: { 
  children: React.ReactNode; 
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  className?: string;
}) {
  return (
    <div className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-gray-200 ${className}`} />;
}
