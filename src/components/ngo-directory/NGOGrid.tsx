import React from 'react';
import { NGOCard } from './NGOCard';

interface NGO {
  id: string;
  name: string;
  description: string;
  causes: string[];
  location: string;
  verified: boolean;
  size?: string;
}

interface NGOGridProps {
  ngos: NGO[];
  onNavigateToProfile?: (id: string) => void;
}

export function NGOGrid({ ngos, onNavigateToProfile }: NGOGridProps) {
  if (ngos.length === 0) {
    return (
      <div className="col-span-3 text-center py-16">
        <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-slate-400 text-3xl">🔍</span>
        </div>
        <h3 className="text-slate-900 mb-2">No NGOs Found</h3>
        <p className="text-slate-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      {ngos.map((ngo) => (
        <NGOCard key={ngo.id} ngo={ngo} onViewProfile={onNavigateToProfile} />
      ))}
    </>
  );
}